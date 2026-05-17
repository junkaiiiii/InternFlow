import prisma from "../libs/prisma.js"
import type { Request, Response } from "express"
import { sendError, sendSuccess } from "../libs/response.js";
import type { TAnalyticsResponse, TTopSkill, TPipelineStage } from "../types/types.js";
import OpenAI from "openai";
import { createRequire } from "module"
import { PDFParse } from "pdf-parse";

class DashboardService {
    static getAnalytics = async (req: Request, res: Response) => {
        try {
            const userId = req.user!.id;

            const [pipeline, topSkillsRaw] = await Promise.all([
                prisma.column.findMany({
                    where: { board: { userId } },
                    include: {
                        _count: { select: { applications: true } }
                    },
                    orderBy: { order: 'asc' }
                }),
                prisma.$queryRaw<{ skill: string; count: bigint }[]>`
                    SELECT 
                        UNNEST(a.skills) as skill,
                        COUNT(*) as count
                    FROM "Application" a
                    JOIN "Column" c ON a."columnId" = c.id
                    JOIN "Board" b ON c."boardId" = b.id
                    WHERE b."userId" = ${userId}
                    GROUP BY skill
                    ORDER BY count DESC
                    LIMIT 10
                `
            ]);

            // Pipeline
            const total = pipeline.reduce((sum, col) => sum + col._count.applications, 0);
            const pipelineData = pipeline.map(col => ({
                stage: col.name,
                count: col._count.applications,
                percentage: total ? Math.round((col._count.applications / total) * 100) : 0
            }));



            // Top skills
            const topSkills: TTopSkill[] = topSkillsRaw.map(row => ({
                skill: row.skill,
                count: Number(row.count)
            }));

            sendSuccess(res, { pipelineData, topSkills });
        } catch {
            sendError(res, "Error when getting analytics data");
        }
    }

    static getAISummary = async (req: Request, res: Response) => {
        const userId = req.user!.id

        try {
            const client = new OpenAI({
                apiKey: process.env.GROQ_API_KEY,
                baseURL: "https://api.groq.com/openai/v1"
            })

            const applications = await prisma.application.findMany({
                where: { column: { board: { userId } } },
                include: { column: { select: { name: true } } }
            })

            if (applications.length < 1) {
                return sendSuccess(res, {
                    message: "Please add internship applications first"
                })
            }

            const resume = await prisma.document.findFirst({
                where: { userId }
            })

            if (!resume) {
                return sendError(res, "Resume not found")
            }

            let resumeText = ""

            try {
                const buffer = Buffer.from(
                    new Uint8Array(resume.file)
                )

                if (!buffer || buffer.length < 1000) {
                    return sendError(res, "PDF file is invalid")
                }
                const parser = new PDFParse({ data: buffer })
                const data = await parser.getText()
                resumeText = data.text

            } catch (err) {
                console.error("PDF PARSE ERROR:", err)
                return sendError(res, "Failed to parse resume PDF")
            }

            // Shape it so the AI only sees what's meaningful
            const appSummary = applications.map(app => ({
                company: app.company,
                role: app.role,
                status: app.column.name,          // e.g. "Applied", "Interview", "Rejected"
                skills: app.skills,               // the skills array you already store
            }))

            const prompt = `
            You are an AI career advisor reviewing a student's internship job search.

            The RESUME shows the candidate's actual skills and experience.
            The APPLICATIONS are internship roles they have applied for, each with the required skills and current status (e.g. Applied, Interview, Offer, Rejected).
            Call candidate as "You" as you are direct giving suggestion to the candidate

            Compare the resume skills against the required skills across all applications.
            Identify patterns: which skills appear frequently in applications but are missing or weak in the resume?
            Also note what the candidate is doing well based on their resume vs what roles they are targeting.

            Return ONLY a raw JSON object, no markdown, no code fences:
            {"summary": "3 sentences: brief profile, what skills match well, what skill gaps appear across their applications, and one actionable suggestion"}

            RESUME:
            ${resumeText}

            APPLICATIONS (${appSummary.length} total):
            ${JSON.stringify(appSummary, null, 2)}
            `

            const response = await client.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: "You are a JSON-only API. Output raw JSON with no markdown formatting, no code fences, no explanation. Only output the JSON object." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.2
            })

            const message = response.choices?.[0]?.message?.content

            if (!message) {
                return sendError(res, "No AI response returned")
            }

            let parsed
            try {
                parsed = JSON.parse(message)
            } catch (err) {
                console.error("AI JSON ERROR:", message)
                return sendError(res, "AI returned invalid JSON")
            }

            return sendSuccess(res, { message: parsed })

        } catch (error) {
            console.error("AI SUMMARY ERROR:", error)
            return sendError(res, "Error when getting AI summary")
        }
    }
}

export default DashboardService
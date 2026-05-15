import prisma from "../libs/prisma.js"
import type { Request, Response } from "express"
import { sendError, sendSuccess } from "../libs/response.js";
import type { TAnalyticsResponse, TTopSkill, TPipelineStage } from "../types/types.js";

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
}

export default DashboardService
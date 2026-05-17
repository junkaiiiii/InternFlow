'use client'
import { useEffect, useState } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { TApiResponse, TDocument, TPublicUser } from "@/types/types";
import Sidebar from "@/components/sidebar"
import { api } from "@/libs/api";
// type TPublicUser = {
//     id: number;
//     username: string;
//     email: string;
//     registered_at: string;
// }
function InfoRow({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-primary/10 last:border-0">
            <span className="mt-0.5 textwhite shrink-0">{icon}</span>
            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-white mb-0.5">
                    {label}
                </p>
                <p className="text-sm font-medium text-white truncate">{value}</p>
            </div>
        </div>
    );
}

export default function Profile() {
    const currentUser: TPublicUser | null = useCurrentUser();
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleUpload() {
        if (!file) return

        try {
            setLoading(true)
            const formData = new FormData()
            formData.append('file', file)
            const response: TApiResponse<{document: TDocument}> = await api.filePost('/document', formData)
            console.log(response.data.document)
        } catch (error) {
            console.error(error)
            alert('Upload failed')

        } finally {
            setLoading(false)
        }

    }

    /* Unauthenticated state */
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-background">
                <Sidebar />
                <div className="min-h-screen bg-background flex items-center justify-center p-6">
                    <div className="text-center space-y-3">
                        <p className="text-sm text-primary/50 font-medium">Not signed in</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            {/* Header */}


            <main className="min-w-0 px-4 py-6 sm:px-6 lg:pl-72 lg:pr-8 flex flex-col gap-10">
                <div className="min-h-screen bg-background flex items-center justify-center p-6">
                    <div
                        className="w-full max-w-sm animate-[fadeUp_0.4s_ease_both]"
                        style={
                            {
                                "--tw-animate-delay": "0ms",
                            } as React.CSSProperties
                        }
                    >
                        {/* Card */}
                        <div className="rounded-3xl border border-white bg-background overflow-hidden">

                            {/* Content */}
                            <div className="px-6 pt-16 pb-6 text-center">
                                <h1 className="text-xl font-bold text-primary tracking-tight leading-tight">
                                    {currentUser.username}
                                </h1>
                                <p className="text-xs text-primary/40 mt-1 font-medium">
                                    Member #{currentUser.id}
                                </p>

                                <div className="my-6 border-t border-white" />

                                <div className="text-left space-y-0">
                                    <InfoRow
                                        label="Username"
                                        value={currentUser.username}
                                        icon={
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                                />
                                            </svg>
                                        }
                                    />
                                    <InfoRow
                                        label="Email"
                                        value={currentUser.email}
                                        icon={
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                                                />
                                            </svg>
                                        }
                                    />
                                    <InfoRow
                                        label="Member since"
                                        value={new Date(currentUser.registered_at).toUTCString()}
                                        icon={
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                                                />
                                            </svg>
                                        }
                                    />
                                </div>

                                <div className="mt-6 flex flex-col gap-4">
                                    <label
                                        htmlFor="pdf-upload"
                                        className="
                                        group relative cursor-pointer overflow-hidden
                                        rounded-2xl border border-dashed border-primary/20
                                        bg-white/[0.02]
                                        p-6 transition-all duration-200
                                        hover:border-primary/40
                                        hover:bg-white/[0.04]
                                    "
                                    >
                                        <input
                                            id="pdf-upload"
                                            type="file"
                                            accept=".pdf"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (!e.target.files?.[0]) return
                                                setFile(e.target.files[0])
                                            }}
                                        />

                                        <div className="flex flex-col items-center justify-center text-center">
                                            {/* Upload Icon */}
                                            <div
                                                className="
                                                mb-4 flex h-14 w-14 items-center justify-center
                                                rounded-full bg-primary/10
                                                text-primary transition
                                                group-hover:scale-105
                                            "
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-7 w-7"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={1.8}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 16V4m0 0-4 4m4-4 4 4m-9 8h10"
                                                    />
                                                </svg>
                                            </div>

                                            <p className="text-sm font-semibold text-primary">
                                                {file ? file.name : 'Upload your resume'}
                                            </p>

                                            <p className="mt-1 text-xs text-primary/40">
                                                PDF only • Max 5MB
                                            </p>
                                        </div>
                                    </label>

                                    {/* File Preview */}
                                    {file && (
                                        <div
                                            className="
                                            flex items-center justify-between
                                            rounded-xl border border-primary/10
                                            bg-white/[0.03]
                                            px-4 py-3
                                        "
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-primary">
                                                    {file.name}
                                                </p>

                                                <p className="text-xs text-primary/40">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setFile(null)}
                                                className="
                                                rounded-lg p-2 text-primary/40
                                                transition hover:bg-white/5 hover:text-primary
                                            "
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18 18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    <button
                                        onClick={handleUpload}
                                        disabled={!file || loading}
                                        className="
                                            rounded-xl bg-primary px-4 py-3
                                            text-sm font-semibold text-background
                                            transition-all duration-200
                                            hover:opacity-90
                                            disabled:cursor-not-allowed
                                            disabled:opacity-40
                                        "
                                    >
                                        {loading ? 'Uploading...' : 'Upload PDF'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Subtle footer note */}
                        <p className="text-center text-xs text-primary/25 mt-4 tracking-wide">
                            ID · {currentUser.id}
                        </p>
                    </div>

                </div>


            </main>
        </div>
    )
}
"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import useCurrentUser from "@/hooks/useCurrentUser"
import {
    LayoutDashboard,
    Briefcase,
    BarChart3,
    Sparkles,
    Calendar,
    Settings,
    ChevronLeft,
    Plus,
} from "lucide-react"
import type { TPublicUser } from "@/types/types"

const navigation = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Applications", icon: Briefcase, href: "/applications" },
    { name: "Analytics", icon: BarChart3, href: "/analytics" },
    { name: "AI Match", icon: Sparkles, href: "/ai-match" },
    { name: "Calendar", icon: Calendar, href: "/calendar" },
    { name: "Settings", icon: Settings, href: "/settings" },
]

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const path = usePathname()
    const router = useRouter()
    const user: TPublicUser|null= useCurrentUser()

    return (
        <div
            className={`fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border bg-sidebar transition-all duration-300 ease-out lg:flex ${collapsed ? "w-[72px]" : "w-64"
                }`}
        >
            {/* Logo */}
            <div
                className={`flex h-16 items-center border-b border-border ${collapsed ? "justify-center px-2" : "justify-between px-4"
                    }`}
            >
                <div className={`items-center gap-3 transition-opacity ${collapsed ? "hidden" : "flex opacity-100"}`}>
                    <span className="text-base font-semibold tracking-tight text-foreground">
                        InternFlow
                    </span>
                </div>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                    <ChevronLeft
                        className={`h-4 w-4 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
                    />
                </button>
            </div>

            {/* Quick Actions */}
            <div className={`border-b border-border py-4 ${collapsed ? "px-2" : "px-3"}`}>
                <button
                    className={`flex w-full items-center rounded-lg bg-primary/10 py-2 text-primary transition-all hover:bg-primary/20 ${collapsed ? "justify-center px-2" : "justify-start gap-2 px-3"
                        }`}
                >
                    <Plus className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="text-sm">Add Application</span>}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = path.slice(1) === item.name.toLowerCase()
                        // console.log(`path: ${path.slice(1)}, item: ${item.name.toLowerCase()}, same: ${path.slice(1) === item.name.toLowerCase()}`)
                        // e.g path = /analytics
                        // so slice

                        const Icon = item.icon

                        return (
                            <li key={item.name}>
                                <button
                                    onClick={() => router.push(`/${item.name.toLowerCase()}`)}
                                    className={`group relative flex w-full items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-150 ${isActive
                                        ? "bg-accent text-foreground"
                                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                        } ${collapsed ? "justify-center px-2" : "gap-3 px-3"}`}
                                >
                                    {isActive && (
                                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
                                    )}

                                    <Icon className="h-4 w-4 shrink-0" />

                                    {!collapsed && (
                                        <span className="flex-1 text-left">{item.name}</span>
                                    )}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* User Section */}
            <div className={`border-t border-border ${collapsed ? "p-2" : "p-3"}`}>
                <div
                    className={`flex cursor-pointer items-center gap-3 rounded-lg py-2 transition-colors hover:bg-accent ${collapsed ? "justify-center px-2" : "px-3"
                        }`}
                >
                    <div className="relative">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/60 to-primary text-xs font-semibold text-primary-foreground">
                            {user?.username.slice(0,2).toUpperCase()}
                        </div>
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-sidebar bg-green-500" />
                    </div>

                    {(!collapsed && user) && (
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                                {user.username}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

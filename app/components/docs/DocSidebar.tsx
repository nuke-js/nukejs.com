"use client"
import { useState, useEffect } from "react"

const NAV = [
    {
        group: "Getting Started",
        items: [
            { href: "/docs", label: "Introduction" },
            { href: "/docs/installation", label: "Installation" },
            { href: "/docs/project-structure", label: "Project Structure" },
        ]
    },
    {
        group: "Core Concepts",
        items: [
            { href: "/docs/routing", label: "Pages & Routing" },
            { href: "/docs/layouts", label: "Layouts" },
            { href: "/docs/client-components", label: "Client Components" },
            { href: "/docs/api-routes", label: "API Routes" },
            { href: "/docs/middleware", label: "Middleware" },
            { href: "/docs/navigation", label: "Navigation" },
            { href: "/docs/static-files", label: "Static Files" },
            { href: "/docs/head-management", label: "useHtml()" },
        ]
    },
    {
        group: "Configuration",
        items: [
            { href: "/docs/configuration", label: "nuke.config.ts" },
            { href: "/docs/deploying", label: "Deploying" },
        ]
    },
    {
        group: "Integrations",
        items: [
            { href: "/docs/examples/tailwindcss", label: "Tailwind CSS" },
            { href: "/docs/examples/prisma", label: "Prisma" },
            { href: "/docs/examples/mongoose", label: "Mongoose" },
            { href: "/docs/examples/orpc", label: "oRPC" },
        ]
    },
]

export default function DocSidebar() {
    const [path, setPath] = useState("")
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setPath(window.location.pathname)
    }, [])

    // Close on route change (for client-side nav)
    useEffect(() => {
        if (!open) return
        const close = () => setOpen(false)
        window.addEventListener("popstate", close)
        return () => window.removeEventListener("popstate", close)
    }, [open])

    return (
        <>
            {/* Mobile hamburger toggle */}
            <button
                className={`doc-sidebar-toggle${open ? " open" : ""}`}
                onClick={() => setOpen(o => !o)}
                aria-label={open ? "Close navigation" : "Open navigation"}
                aria-expanded={open}
            >
                <span />
                <span />
                <span />
            </button>

            {/* Backdrop overlay for mobile */}
            {open && (
                <div
                    className="doc-sidebar-overlay"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside className={`doc-sidebar${open ? " open" : ""}`}>
                <span>
                    {NAV.map(section => (
                        <div key={section.group} className="doc-nav-group">
                            <p className="doc-nav-label">{section.group}</p>
                            <ul>
                                {section.items.map(item => {
                                    const active = path === item.href
                                    return (
                                        <li key={item.href}>
                                            <a
                                                href={item.href}
                                                className={`doc-nav-link${active ? " active" : ""}`}
                                                onClick={() => setOpen(false)}
                                            >
                                                {item.label}
                                            </a>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    ))}
                </span>
            </aside>
        </>
    )
}

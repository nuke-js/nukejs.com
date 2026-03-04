import { useHtml } from "nukejs"
import CodeBlock from "../../../components/docs/CodeBlock"

export default function TailwindPage() {
    const title = "Tailwind CSS"
    const subtitle = "Add Tailwind CSS to a NukeJS project. Because NukeJS controls the HTML pipeline you run Tailwind as a CLI watcher alongside the dev server."
    useHtml({ title })
    const prev = { href: "/docs/deploying", label: "Deploying" }
    const next = { href: "/docs/examples/prisma", label: "Prisma" }
    return (
        <article className="doc-article">
            <header className="doc-article-header">
                <h1 className="doc-article-title">{title}</h1>
                {subtitle && <p className="doc-article-subtitle">{subtitle}</p>}
            </header>

            <div className="doc-body">
                <div className="doc-integration-badge">Integration</div>

                <h2>Install</h2>
                <CodeBlock language="bash" filename="terminal" code={`npm install -D tailwindcss @tailwindcss/cli`} />

                <h2>Create the CSS entry file</h2>
                <p>Tailwind v4 uses a CSS-first approach. Create one CSS file that imports Tailwind and declares your source paths:</p>
                <CodeBlock language="css" filename="app/styles/tailwind.css" code={`@import "tailwindcss";

/* Tell Tailwind where to scan for class names */
@source "../pages/**/*.tsx";
@source "../components/**/*.tsx";`} />

                <h2>Add Tailwind output to public/</h2>
                <p>Run the Tailwind CLI to compile your CSS into a file NukeJS can serve statically:</p>
                <CodeBlock language="bash" filename="terminal" code={`# One-time build
npx @tailwindcss/cli -i app/styles/tailwind.css -o app/public/tailwind.css

# Watch mode during development
npx @tailwindcss/cli -i app/styles/tailwind.css -o app/public/tailwind.css --watch`} />

                <h2>Update package.json scripts</h2>
                <p>Run Tailwind and NukeJS dev concurrently. Install <code>concurrently</code> for this:</p>
                <CodeBlock language="bash" filename="terminal" code={`npm install -D concurrently`} />
                <CodeBlock language="json" filename="package.json" code={`{
    "scripts": {
        "dev": "concurrently \\"nuke dev\\" \\"@tailwindcss/cli -i app/styles/tailwind.css -o app/public/tailwind.css --watch\\"",
        "build:css": "@tailwindcss/cli -i app/styles/tailwind.css -o app/public/tailwind.css --minify",
        "prebuild": "npm run build:css",
        "build": "nuke build"
    }
}`} />

                <h2>Load the stylesheet in your layout</h2>
                <CodeBlock filename="app/pages/layout.tsx" code={`import { useHtml } from 'nukejs'

export default function Layout({ children }: { children: React.ReactNode }) {
    useHtml({
        link: [{ rel: 'stylesheet', href: '/tailwind.css' }]
    })
    return <>{children}</>
}`} />

                <h2>Use Tailwind classes</h2>
                <p>Now use any Tailwind utility class in your components:</p>
                <CodeBlock filename="app/pages/index.tsx" code={`export default async function Home() {
    const posts = await db.getPosts()

    return (
        <main className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-8">
                Latest posts
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map(post => (
                    <article
                        key={post.id}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-orange-500 transition-colors"
                    >
                        <h2 className="text-lg font-semibold text-white mb-2">{post.title}</h2>
                        <p className="text-zinc-400 text-sm leading-relaxed">{post.excerpt}</p>
                        <a
                            href={'/blog/' + post.slug}
                            className="inline-block mt-4 text-orange-400 text-sm font-medium hover:text-orange-300"
                        >
                            Read more →
                        </a>
                    </article>
                ))}
            </div>
        </main>
    )
}`} />

                <h2>Tailwind with a client component</h2>
                <p>Client components use Tailwind classes exactly the same way — as long as the CSS is loaded in the layout, it applies everywhere:</p>
                <CodeBlock filename="app/components/Dropdown.tsx" code={`"use client"
import { useState } from 'react'

export default function Dropdown({ options }: { options: string[] }) {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(options[0])

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white hover:border-orange-500 transition-colors"
            >
                {selected}
                <span className={open ? 'rotate-180 transition-transform' : 'transition-transform'}>▾</span>
            </button>
            {open && (
                <ul className="absolute top-full mt-1 left-0 bg-zinc-900 border border-zinc-700 rounded-lg py-1 min-w-full z-10 shadow-xl">
                    {options.map(opt => (
                        <li key={opt}>
                            <button
                                onClick={() => { setSelected(opt); setOpen(false) }}
                                className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                            >
                                {opt}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}`} />

                <div className="doc-callout tip">
                    <span className="doc-callout-icon">✅</span>
                    <div className="doc-callout-body">
                        <strong>Use Tailwind v4 — it's faster and config-free</strong>
                        Tailwind v4 eliminates the <code>tailwind.config.js</code> file entirely. Everything — content paths, theme tokens, plugins — lives in your CSS file.
                    </div>
                </div>
            </div>
        </article>
    )
}

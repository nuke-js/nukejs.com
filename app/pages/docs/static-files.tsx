import { useHtml } from "nukejs"
import CodeBlock from "../../components/docs/CodeBlock"

export default function StaticFilesPage() {
    const title = "Static Files"
    const subtitle = "Drop any file into app/public/ and it's served directly at its URL — images, fonts, CSS, JSON, WASM, anything."
    useHtml({ title })
    const prev = { href: "/docs/navigation", label: "Navigation" }
    const next = { href: "/docs/head-management", label: "useHtml()" }
    return (
        <article className="doc-article">
            <header className="doc-article-header">
                <h1 className="doc-article-title">{title}</h1>
                {subtitle && <p className="doc-article-subtitle">{subtitle}</p>}
            </header>

            <div className="doc-body">
                <h2>How it works</h2>
                <p>Files in <code>app/public/</code> are served at the root with the correct <code>Content-Type</code> automatically. No route file, no import, no config required.</p>
                <CodeBlock language="bash" filename="file → URL" code={`app/public/
├── favicon.ico          →  /favicon.ico
├── robots.txt           →  /robots.txt
├── logo.png             →  /logo.png
├── main.css             →  /main.css
└── fonts/
    └── inter.woff2      →  /fonts/inter.woff2`} />

                <h2>Referencing public files</h2>
                <p>Use root-relative paths in your components. The leading <code>/</code> maps to <code>app/public/</code>:</p>
                <CodeBlock filename="app/pages/layout.tsx" code={`import { useHtml } from 'nukejs'

export default function Layout({ children }: { children: React.ReactNode }) {
    useHtml({
        link: [
            { rel: 'icon', href: '/favicon.ico' },
            { rel: 'stylesheet', href: '/main.css' },
        ]
    })
    return (
        <>
            <img src="/logo.png" alt="Logo" width={120} height={40} />
            {children}
        </>
    )
}`} />

                <h2>Deployment behaviour</h2>
                <div className="doc-table-wrap">
                    <table className="doc-table">
                        <thead><tr><th>Environment</th><th>How public files are served</th></tr></thead>
                        <tbody>
                            <tr><td>nuke dev</td><td>Built-in middleware serves them before any routing</td></tr>
                            <tr><td>nuke build (Node)</td><td>Copied to <code>dist/static/</code>, served by the Node HTTP server</td></tr>
                            <tr><td>nuke build (Vercel)</td><td>Copied to <code>.vercel/output/static/</code> — served by Vercel's CDN, zero function invocations</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="doc-callout tip">
                    <span className="doc-callout-icon">✅</span>
                    <div className="doc-callout-body">
                        <strong>Public files are free on Vercel</strong>
                        Static files served from the CDN don't count against your function invocation quota. Put everything that doesn't need server logic in <code>app/public/</code>.
                    </div>
                </div>
            </div>
        </article>
    )
}

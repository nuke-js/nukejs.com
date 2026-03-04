import { useHtml } from "nukejs"
import CodeBlock from "../../components/docs/CodeBlock"

export default function ConfigurationPage() {
    const title = "Configuration"
    const subtitle = "NukeJS works without any config. Create nuke.config.ts when you need to override defaults."
    useHtml({ title })
    const prev = { href: "/docs/head-management", label: "useHtml()" }
    const next = { href: "/docs/deploying", label: "Deploying" }
    return (
        <article className="doc-article">
            <header className="doc-article-header">
                <h1 className="doc-article-title">{title}</h1>
                {subtitle && <p className="doc-article-subtitle">{subtitle}</p>}
            </header>

            <div className="doc-body">
                <h2>nuke.config.ts</h2>
                <p>Place this file at the project root. All options are optional.</p>
                <CodeBlock filename="nuke.config.ts" code={`export default {
    // Directory for API route handlers
    // Default: './server'
    serverDir: './server',

    // Dev server port
    // Default: 3000 (auto-increments if port is in use)
    port: 3000,

    // Logging verbosity:
    //   false    — silent (default)
    //   'error'  — errors only
    //   'info'   — startup messages + errors
    //   true     — all debug output
    debug: false,
}`} />

                <h2>Options reference</h2>
                <div className="doc-table-wrap">
                    <table className="doc-table">
                        <thead><tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td>serverDir</td><td>string</td><td>'./server'</td><td>Path to your API route handlers</td></tr>
                            <tr><td>port</td><td>number</td><td>3000</td><td>Dev server port</td></tr>
                            <tr><td>debug</td><td>boolean | 'error' | 'info'</td><td>false</td><td>Logging verbosity</td></tr>
                        </tbody>
                    </table>
                </div>

                <h2>Environment variables</h2>
                <p>These environment variables control the production server:</p>
                <div className="doc-table-wrap">
                    <table className="doc-table">
                        <thead><tr><th>Variable</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td>ENVIRONMENT=production</td><td>Disables HMR and file watching</td></tr>
                            <tr><td>PORT</td><td>Port for the production HTTP server</td></tr>
                        </tbody>
                    </table>
                </div>
                <CodeBlock language="bash" filename="terminal" code={`PORT=8080 ENVIRONMENT=production node dist/index.mjs`} />

                <h2>TypeScript path aliases</h2>
                <p>If you want path aliases (e.g. <code>@/components</code>), add them to <code>tsconfig.json</code>:</p>
                <CodeBlock language="json" filename="tsconfig.json" code={`{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["app/*"]
        }
    }
}`} />
            </div>
        </article>
    )
}

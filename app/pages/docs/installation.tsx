import { useHtml } from "nukejs"
import CodeBlock from "../../components/docs/CodeBlock"

export default function InstallationPage() {
    const title = "Installation"
    const subtitle = "Get a NukeJS app running in under a minute."
    useHtml({ title })
    const prev = { href: "/docs", label: "Introduction" }
    const next = { href: "/docs/project-structure", label: "Project Structure" }
    return (
        <article className="doc-article">
            <header className="doc-article-header">
                <h1 className="doc-article-title">{title}</h1>
                {subtitle && <p className="doc-article-subtitle">{subtitle}</p>}
            </header>

            <div className="doc-body">
                <h2>Requirements</h2>
                <ul>
                    <li>Node.js 20 or later</li>
                    <li>npm 9 or later (or pnpm / bun)</li>
                </ul>

                <h2>Create a new project</h2>
                <p>Run the create command and follow the prompts. It scaffolds a working app in seconds:</p>
                <CodeBlock language="bash" filename="terminal" code={`npm create nuke@latest`} />
                <p>This creates a new directory with:</p>
                <ul>
                    <li>A home page at <code>app/pages/index.tsx</code></li>
                    <li>A root layout at <code>app/pages/layout.tsx</code></li>
                    <li>A sample API route in <code>server/</code></li>
                    <li>A <code>nuke.config.ts</code> ready to customize</li>
                </ul>

                <h2>Start the dev server</h2>
                <CodeBlock language="bash" filename="terminal" code={`cd my-app\nnpm run dev`} />
                <p>
                    The dev server starts at <code>http://localhost:3000</code> by default.
                    If port 3000 is in use it auto-increments to 3001, 3002, etc.
                </p>

                <div className="doc-callout tip">
                    <span className="doc-callout-icon">✅</span>
                    <div className="doc-callout-body">
                        <strong>HMR is on by default</strong>
                        Hot Module Replacement is enabled in dev. Edit any file — the browser updates instantly without a full reload.
                    </div>
                </div>

                <h2>Add your first page</h2>
                <p>Create any <code>.tsx</code> file in <code>app/pages/</code>. The filename becomes the URL:</p>
                <CodeBlock filename="app/pages/about.tsx" code={`export default function About() {
    return (
        <main>
            <h1>About us</h1>
            <p>Built with NukeJS.</p>
        </main>
    )
}`} />
                <p>Visit <code>http://localhost:3000/about</code> — it's live, no config needed.</p>

                <h2>Install TypeScript types</h2>
                <p>NukeJS ships TypeScript types out of the box. If you need React types:</p>
                <CodeBlock language="bash" filename="terminal" code={`npm install -D @types/react`} />

                <h2>Upgrading</h2>
                <p>To upgrade NukeJS to the latest version, reinstall it from npm:</p>
                <CodeBlock language="bash" filename="terminal" code={`npm uninstall nukejs && npm i nukejs@latest`} />
                <p>Then restart your dev server.</p>
            </div>
        </article>
    )
}
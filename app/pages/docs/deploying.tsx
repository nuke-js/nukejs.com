import { useHtml } from "nukejs"
import CodeBlock from "../../components/docs/CodeBlock"

export default function DeployingPage() {
    const title = "Deploying"
    const subtitle = "Build once, deploy to Node.js, Vercel, or Cloudflare. Zero configuration needed — NukeJS detects the environment automatically."
    useHtml({ title })
    const prev = { href: "/docs/configuration", label: "Configuration" }
    const next = { href: "/docs/examples/tailwindcss", label: "Tailwind CSS" }
    return (
        <article className="doc-article">
            <header className="doc-article-header">
                <h1 className="doc-article-title">{title}</h1>
                {subtitle && <p className="doc-article-subtitle">{subtitle}</p>}
            </header>

            <div className="doc-body">
                <h2>Build for production</h2>
                <CodeBlock language="bash" filename="terminal" code={`npm run build`} />
                <p>This produces a <code>dist/</code> directory ready to run:</p>
                <CodeBlock language="bash" filename="dist/" code={`dist/
├── api/                    # Bundled API route handlers (.mjs)
├── pages/                  # Bundled SSR page handlers (.mjs)
├── static/
│   ├── __react.js          # React runtime
│   ├── __n.js              # NukeJS client runtime
│   ├── __client-component/ # "use client" component bundles
│   └── ...                 # Copied from app/public/
├── manifest.json           # Route dispatch table
└── index.mjs               # HTTP server entry point`} />

                <h2>Node.js</h2>
                <CodeBlock language="bash" filename="terminal" code={`node dist/index.mjs`} />
                <p>Set the port with the <code>PORT</code> env variable:</p>
                <CodeBlock language="bash" filename="terminal" code={`PORT=8080 ENVIRONMENT=production node dist/index.mjs`} />

                <h3>PM2 (process manager)</h3>
                <CodeBlock language="bash" filename="terminal" code={`npm install -g pm2
pm2 start dist/index.mjs --name nukejs-app
pm2 save && pm2 startup`} />

                <h2>Vercel</h2>
                <p>Import your GitHub repo in the Vercel dashboard — no additional configuration needed. NukeJS auto-detects the Vercel build environment and outputs to <code>.vercel/output/</code>.</p>
                <div className="doc-steps">
                    <div className="doc-step">
                        <span className="doc-step-num">1</span>
                        <div className="doc-step-body"><p>Push your project to GitHub</p></div>
                    </div>
                    <div className="doc-step">
                        <span className="doc-step-num">2</span>
                        <div className="doc-step-body"><p>Go to <a href="https://vercel.com/new" target="_blank">vercel.com/new</a> and import the repository</p></div>
                    </div>
                    <div className="doc-step">
                        <span className="doc-step-num">3</span>
                        <div className="doc-step-body"><p>Click Deploy — Vercel runs <code>npm run build</code> and deploys automatically</p></div>
                    </div>
                </div>

                <div className="doc-callout tip">
                    <span className="doc-callout-icon">✅</span>
                    <div className="doc-callout-body">
                        <strong>Public files are CDN-hosted on Vercel</strong>
                        Everything in <code>app/public/</code> lands on Vercel's CDN — served globally with zero latency and no function invocations.
                    </div>
                </div>

                <h2>Cloudflare</h2>
                <p>Import your GitHub repo in the Cloudflare dashboard — no additional configuration needed. NukeJS auto-detects the Cloudflare build environment and outputs to <code>.cloudflare/output/</code>.</p>

                <div className="doc-steps">
                    <div className="doc-step">
                        <span className="doc-step-num">1</span>
                        <div className="doc-step-body"><p>Push your project to GitHub</p></div>
                    </div>
                    <div className="doc-step">
                        <span className="doc-step-num">2</span>
                        <div className="doc-step-body"><p>Go to <a href="https://dash.cloudflare.com" target="_blank">dash.cloudflare.com</a>, open <strong>Workers &amp; Pages</strong> and connect your repository</p></div>
                    </div>
                    <div className="doc-step">
                        <span className="doc-step-num">3</span>
                        <div className="doc-step-body"><p>Click Deploy — Cloudflare runs <code>npm run build</code> and deploys automatically</p></div>
                    </div>
                </div>

                <p>The build output:</p>
                <CodeBlock language="bash" filename=".cloudflare/output/" code={`.cloudflare/output/
├── _worker.mjs     # Single ESM Worker (all routes bundled)
└── static/
    ├── __n.js                  # NukeJS client runtime
    ├── __client-component/     # "use client" component bundles
    └── ...                     # Copied from app/public/`} />

                <div className="doc-callout tip">
                    <span className="doc-callout-icon">✅</span>
                    <div className="doc-callout-body">
                        <strong>Public files are CDN-hosted on Cloudflare</strong>
                        Everything in <code>app/public/</code> lands on Cloudflare's global CDN — served with zero latency and no Worker invocations.
                    </div>
                </div>

                <div className="doc-callout info">
                    <span className="doc-callout-icon">ℹ️</span>
                    <div className="doc-callout-body">
                        <strong>Pages vs Workers</strong>
                        For <strong>Cloudflare Pages</strong>, set your build output directory to <code>.cloudflare/output</code> in the dashboard. For <strong>standalone Workers</strong> via <code>wrangler deploy</code>, static assets are inlined into the Worker bundle automatically — no extra step needed.
                    </div>
                </div>

                <h2>Environment variables</h2>
                <p>Set secrets in your hosting platform's dashboard, or use a <code>.env</code> file for Node deployments. Access them in server code via <code>process.env</code>:</p>
                <CodeBlock filename="server/db.ts" code={`const uri = process.env.DATABASE_URL
if (!uri) throw new Error('DATABASE_URL is required')`} />

                <div className="doc-callout danger">
                    <span className="doc-callout-icon">🚫</span>
                    <div className="doc-callout-body">
                        <strong>Never read secrets in client components</strong>
                        Environment variables accessed in <code>"use client"</code> files get bundled into the browser JavaScript and become public. Only read secrets in server components and API routes.
                    </div>
                </div>
            </div>
        </article>
    )
}
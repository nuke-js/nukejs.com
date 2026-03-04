import { useHtml } from "nukejs"
import CodeBlock from "../../components/docs/CodeBlock"

export default function ProjectStructurePage() {
    const title = "Project Structure"
    const subtitle = "How a NukeJS project is organized and what each directory does."
    useHtml({ title })
    const prev = { href: "/docs/installation", label: "Installation" }
    const next = { href: "/docs/routing", label: "Pages & Routing" }
    return (
        <article className="doc-article">
            <header className="doc-article-header">
                <h1 className="doc-article-title">{title}</h1>
                {subtitle && <p className="doc-article-subtitle">{subtitle}</p>}
            </header>

            <div className="doc-body">
                <h2>Directory layout</h2>
                <CodeBlock language="bash" filename="my-app/" code={`my-app/
├── app/
│   ├── pages/              # Page components → routes
│   │   ├── layout.tsx      # Root layout (wraps every page)
│   │   ├── index.tsx       # → /
│   │   ├── about.tsx       # → /about
│   │   └── blog/
│   │       ├── layout.tsx  # Blog-section layout
│   │       ├── index.tsx   # → /blog
│   │       └── [slug].tsx  # → /blog/:slug
│   ├── components/         # Shared components (not routed)
│   └── public/             # Static assets served at /
│       ├── favicon.ico     # → GET /favicon.ico
│       └── main.css        # → GET /main.css
├── server/                 # API route handlers
│   ├── users/
│   │   ├── index.ts        # → GET/POST /users
│   │   └── [id].ts         # → GET/PUT/DELETE /users/:id
│   └── auth.ts             # → /auth
├── middleware.ts           # (optional) Global middleware
├── nuke.config.ts          # (optional) Config overrides
└── package.json`} />

                <h2>app/pages/</h2>
                <p>
                    Every <code>.tsx</code> file here that exports a default React component becomes a URL route.
                    The file path relative to <code>pages/</code> (minus the extension) is the URL.
                    Files named <code>layout.tsx</code> are layouts, not routes.
                </p>

                <h2>app/components/</h2>
                <p>
                    Place shared components here. Files in this directory are never treated as routes —
                    only files directly inside <code>pages/</code> and its subdirectories are routed.
                </p>

                <h2>app/public/</h2>
                <p>
                    Any file placed here is served directly at its path. <code>app/public/logo.png</code> is
                    available at <code>/logo.png</code>. No import, no route file needed.
                    On Vercel, these files land on the CDN automatically.
                </p>

                <h2>server/</h2>
                <p>
                    API route handlers live here. Export named functions (<code>GET</code>, <code>POST</code>, etc.)
                    and NukeJS wires them up. The same file-path → URL mapping applies as for pages.
                </p>

                <h2>middleware.ts</h2>
                <p>
                    A single optional file at the project root. Its default export runs before every request —
                    before static files, API routes, and SSR. Use it for auth, logging, or header injection.
                </p>

                <h2>nuke.config.ts</h2>
                <p>
                    Optional configuration file. NukeJS works out of the box without it.
                    See the <a href="/docs/configuration">Configuration</a> page for all options.
                </p>

                <div className="doc-callout info">
                    <span className="doc-callout-icon">ℹ️</span>
                    <div className="doc-callout-body">
                        <strong>No src/ needed</strong>
                        NukeJS uses <code>app/</code> and <code>server/</code> as first-class directories.
                        There's no wrapping <code>src/</code> folder by convention.
                    </div>
                </div>
            </div>
        </article>
    )
}

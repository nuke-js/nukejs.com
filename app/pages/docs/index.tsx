import { useHtml } from "nukejs"
import CodeBlock from "../../components/docs/CodeBlock"

export default function DocsIndex() {
    const title = "Introduction"

    useHtml({ title })
    return (
        <article className="doc-article">
            <header className="doc-article-header">
                <h1 className="doc-article-title">{title}</h1>
            </header>

            <div className="doc-body">
                <h2>What is NukeJS?</h2>
                <p>
                    Most React frameworks ship a full JavaScript bundle to the browser for every page — even completely static ones.
                    NukeJS flips this model. Every page is rendered to HTML on the server. JavaScript only reaches the browser for
                    components you explicitly mark <code>"use client"</code>. Everything else ships zero JS.
                </p>
                <p>
                    The result is faster first loads, excellent SEO out of the box, and a full server-side runtime you can
                    use to talk directly to databases, read secrets, and run async code — no separate backend needed.
                </p>

                <div className="doc-cards">
                    <a className="doc-card" href="/docs/routing">
                        <span className="doc-card-icon">🛣️</span>
                        <div className="doc-card-title">File-Based Routing</div>
                        <p className="doc-card-desc">Drop a file in <code>app/pages/</code> and it becomes a route. Dynamic segments, catch-alls, and nested layouts included.</p>
                    </a>
                    <a className="doc-card" href="/docs/client-components">
                        <span className="doc-card-icon">⚛️</span>
                        <div className="doc-card-title">Partial Hydration</div>
                        <p className="doc-card-desc">Only <code>"use client"</code> components download JS. Server-only components ship zero JavaScript to the browser.</p>
                    </a>
                    <a className="doc-card" href="/docs/api-routes">
                        <span className="doc-card-icon">🔌</span>
                        <div className="doc-card-title">API Routes</div>
                        <p className="doc-card-desc">Export <code>GET</code>, <code>POST</code>, etc. from <code>server/</code> files and they become typed API endpoints instantly.</p>
                    </a>
                    <a className="doc-card" href="/docs/middleware">
                        <span className="doc-card-icon">🛡️</span>
                        <div className="doc-card-title">Middleware</div>
                        <p className="doc-card-desc">One <code>middleware.ts</code> intercepts every request. Perfect for auth, logging, CORS, and header injection.</p>
                    </a>
                    <a className="doc-card" href="/docs/deploying">
                        <span className="doc-card-icon">🚀</span>
                        <div className="doc-card-title">Deploy Anywhere</div>
                        <p className="doc-card-desc">One build command. Deploy to Node.js or Vercel — public files land on the CDN automatically.</p>
                    </a>
                    <a className="doc-card" href="/docs/head-management">
                        <span className="doc-card-icon">🧠</span>
                        <div className="doc-card-title">Head Management</div>
                        <p className="doc-card-desc"><code>useHtml()</code> controls titles, meta tags, Open Graph, and JSON-LD from any component.</p>
                    </a>
                    <a className="doc-card" href="/docs/use-request">
                        <span className="doc-card-icon">🔍</span>
                        <div className="doc-card-title">useRequest()</div>
                        <p className="doc-card-desc">Read URL params, query strings, and request headers from any server or client component — reactive on the client.</p>
                    </a>
                </div>

                <h2>The core idea</h2>
                <p>
                    A server component is just a React component that runs on the server. It can be <code>async</code>,
                    talk to a database, and read environment variables. Its output is HTML — no JS bundle.
                    A client component adds <code>"use client"</code> at the top and gets bundled for the browser.
                </p>
                <p>Mix them freely — server components can render client components as children and pass them data as props.</p>

                <h2>Quick start</h2>
                <p>Create a project and start the dev server:</p>
                <CodeBlock language="bash" filename="terminal" code={`npm create nuke@latest\ncd my-app\nnpm run dev`} />
                <p>Your app is running at <code>http://localhost:3000</code>. Open <code>app/pages/index.tsx</code> and start editing — changes appear instantly.</p>

                <h2>Try it in your browser</h2>
                <p>
                    Want to explore NukeJS without installing anything? Open the playground directly in StackBlitz:
                </p>
                <a
                    href="https://stackblitz.com/edit/nuke?file=app/pages/index.tsx"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-block', marginTop: '0.5rem' }}
                >
                    <img
                        src="https://developer.stackblitz.com/img/open_in_stackblitz.svg"
                        alt="Open in StackBlitz"
                        style={{ height: '36px', display: 'block' }}
                    />
                </a>
            </div>
        </article>
    )
}
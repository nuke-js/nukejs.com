import { useHtml } from "nukejs"
import CodeBlock from "../../components/docs/CodeBlock"

export default function ErrorHandlingPage() {
    const title = "Handling 404 & 500 Errors"
    const subtitle = "Create custom error pages for not-found routes and server failures — file-based, just like any other page."
    useHtml({ title })
    return (
        <article className="doc-article">
            <header className="doc-article-header">
                <h1 className="doc-article-title">{title}</h1>
                <p className="doc-article-subtitle">{subtitle}</p>
            </header>

            <div className="doc-body">

                {/* ── 404 ──────────────────────────────────────────── */}
                <h2>Custom 404 page</h2>
                <p>
                    Create <code>app/pages/404.tsx</code> and export a default component.
                    NukeJS renders this page whenever a request doesn't match any route.
                    The file works exactly like any other page — it can call <code>useHtml()</code>,
                    use layouts, and fetch data.
                </p>
                <CodeBlock filename="app/pages/404.tsx" code={`import { useHtml } from 'nukejs'
import { Link } from 'nukejs'

export default function NotFound() {
    useHtml({ title: '404 — Page Not Found' })

    return (
        <main style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <h1>404</h1>
            <p>The page you're looking for doesn't exist.</p>
            <Link href="/">Go back home</Link>
        </main>
    )
}`} />

                <div className="doc-callout info">
                    <span className="doc-callout-icon">ℹ️</span>
                    <div className="doc-callout-body">
                        <strong>Layouts wrap your 404 page too</strong>{" "}
                        Your root <code>layout.tsx</code> is applied to the 404 page just like any other page,
                        so your nav and footer appear automatically.
                    </div>
                </div>

                <h2>Not-found inside dynamic routes</h2>
                <p>
                    When a dynamic route fetches a resource that doesn't exist (e.g. a blog post by slug),
                    return a <code>null</code> render or a dedicated component rather than throwing.
                    NukeJS will still respond with a 200 unless you use the <code>useRequest()</code> hook
                    to set the status code explicitly:
                </p>
                <CodeBlock filename="app/pages/blog/[slug].tsx" code={`import { useHtml } from 'nukejs'
import { useRequest } from 'nukejs'

export default async function BlogPost({ slug }: { slug: string }) {
    const post = await fetchPost(slug)

    if (!post) {
        useHtml({ title: '404 — Post Not Found' })
        useRequest().status(404)         // ← set the HTTP status code

        return (
            <main style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <h1>Post not found</h1>
                <p>
                    <strong>{slug}</strong> doesn't exist or may have been removed.
                </p>
                <a href="/blog">← Back to blog</a>
            </main>
        )
    }

    useHtml({ title: post.title })
    return (
        <article>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
        </article>
    )
}`} />

                <h2>404 in API routes</h2>
                <p>
                    Inside <code>server/</code> handlers, send a 404 response with <code>res.json()</code>
                    or <code>res.status(404).end()</code>:
                </p>
                <CodeBlock filename="server/posts/[id].ts" code={`import type { ApiRequest, ApiResponse } from 'nukejs'

export async function GET(req: ApiRequest, res: ApiResponse) {
    const { id } = req.params as { id: string }
    const post = await db.getPost(id)

    if (!post) {
        res.json({ error: 'Post not found' }, 404)
        return
    }

    res.json(post)
}`} />

                {/* ── 500 ──────────────────────────────────────────── */}
                <h2>Custom 500 page</h2>
                <p>
                    Create <code>app/pages/500.tsx</code> to replace the default error page.
                    NukeJS renders it when an unhandled exception is thrown during server-side rendering.
                </p>
                <CodeBlock filename="app/pages/500.tsx" code={`import { useHtml } from 'nukejs'
import { Link } from 'nukejs'

export default function ServerError() {
    useHtml({ title: '500 — Server Error' })

    return (
        <main style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <h1>500</h1>
            <p>Something went wrong on our end. We're looking into it.</p>
            <Link href="/">Return to home</Link>
        </main>
    )
}`} />

                <h2>Catching errors inside a page</h2>
                <p>
                    For more control — such as distinguishing a failed API call from a rendering crash —
                    wrap async logic in a <code>try/catch</code> and render an inline error state instead
                    of letting the exception bubble up to the global 500 page:
                </p>
                <CodeBlock filename="app/pages/dashboard.tsx" code={`import { useHtml } from 'nukejs'
import { useRequest } from 'nukejs'

export default async function Dashboard() {
    useHtml({ title: 'Dashboard' })

    let data
    try {
        data = await fetchDashboardData()
    } catch (err) {
        useRequest().status(500)
        return (
            <main>
                <h1>Failed to load dashboard</h1>
                <p>Please try again in a moment.</p>
            </main>
        )
    }

    return (
        <main>
            <h1>Dashboard</h1>
            <Stats data={data} />
        </main>
    )
}`} />

                <h2>500 errors in API routes</h2>
                <p>
                    Wrap handler logic in <code>try/catch</code> and return a structured error response.
                    Avoid leaking stack traces or internal details to the client in production:
                </p>
                <CodeBlock filename="server/reports/index.ts" code={`import type { ApiRequest, ApiResponse } from 'nukejs'

export async function GET(req: ApiRequest, res: ApiResponse) {
    try {
        const report = await generateReport()
        res.json(report)
    } catch (err) {
        console.error('[GET /reports]', err)

        const message =
            process.env.ENVIRONMENT === 'production'
                ? 'Internal server error'
                : (err as Error).message

        res.json({ error: message }, 500)
    }
}`} />

                {/* ── Middleware approach ───────────────────────────── */}
                <h2>Centralised error handling with middleware</h2>
                <p>
                    <code>middleware.ts</code> runs before every request, making it the right place to
                    intercept unmatched routes and serve a consistent 404 response across both API and
                    page requests:
                </p>
                <CodeBlock filename="middleware.ts" code={`import type { IncomingMessage, ServerResponse } from 'http'

export default async function middleware(
    req: IncomingMessage,
    res: ServerResponse,
) {
    // Log every request with timing
    const start = Date.now()
    res.on('finish', () => {
        const ms = Date.now() - start
        const level = res.statusCode >= 500 ? 'ERROR' : res.statusCode >= 400 ? 'WARN' : 'INFO'
        console.log(\`[\${level}] \${req.method} \${req.url} \${res.statusCode} — \${ms}ms\`)
    })

    // Block /admin routes without a valid token
    if (req.url?.startsWith('/admin')) {
        const token = req.headers.authorization?.split(' ')[1]
        if (!isValidToken(token)) {
            res.statusCode = 401
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Unauthorized' }))
            return
        }
    }
    // Falls through to normal routing
}

function isValidToken(token: string | undefined): boolean {
    return token === process.env.ADMIN_TOKEN
}`} />

                <div className="doc-callout warning">
                    <span className="doc-callout-icon">⚠️</span>
                    <div className="doc-callout-body">
                        <strong>Middleware runs before the 404 page</strong>{" "}
                        If middleware calls <code>res.end()</code>, NukeJS stops immediately —
                        the custom 404 or 500 page is never rendered. Only return from middleware
                        without ending the response to let normal routing (and error pages) take over.
                    </div>
                </div>

                {/* ── Error page with layout ────────────────────────── */}
                <h2>Full example — branded error pages</h2>
                <p>Here's a production-ready pair of error pages that share a common layout:</p>
                <CodeBlock filename="app/pages/404.tsx" code={`import { useHtml } from 'nukejs'
import { Link } from 'nukejs'

export default function NotFound() {
    useHtml({
        title: '404 — Not Found',
        meta: [{ name: 'robots', content: 'noindex' }],
    })

    return (
        <section className="error-page">
            <span className="error-code">404</span>
            <h1>Page not found</h1>
            <p>
                The URL <code>{typeof window !== 'undefined' ? window.location.pathname : ''}</code>{' '}
                doesn't match any page on this site.
            </p>
            <div className="error-actions">
                <Link href="/" className="btn btn-primary">Go home</Link>
                <Link href="/docs" className="btn btn-secondary">Browse docs</Link>
            </div>
        </section>
    )
}`} />
                <CodeBlock filename="app/pages/500.tsx" code={`import { useHtml } from 'nukejs'
import { Link } from 'nukejs'

export default function ServerError() {
    useHtml({
        title: '500 — Server Error',
        meta: [{ name: 'robots', content: 'noindex' }],
    })

    return (
        <section className="error-page">
            <span className="error-code">500</span>
            <h1>Something went wrong</h1>
            <p>
                An unexpected error occurred. Our team has been notified.
                Try refreshing the page or come back later.
            </p>
            <div className="error-actions">
                <Link href="/" className="btn btn-primary">Go home</Link>
            </div>
        </section>
    )
}`} />

                <div className="doc-callout tip">
                    <span className="doc-callout-icon">✅</span>
                    <div className="doc-callout-body">
                        <strong>Add <code>noindex</code> to error pages</strong>{" "}
                        Both examples above include a <code>{'<meta name="robots" content="noindex">'}</code> tag
                        via <code>useHtml()</code>. This prevents search engines from indexing your error pages
                        and polluting your SEO profile.
                    </div>
                </div>

                {/* ── Summary table ────────────────────────────────── */}
                <h2>Quick reference</h2>
                <div className="doc-table-wrap">
                    <table className="doc-table">
                        <thead>
                            <tr>
                                <th>Scenario</th>
                                <th>Recommended approach</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>No route matched</td>
                                <td><code>app/pages/404.tsx</code></td>
                            </tr>
                            <tr>
                                <td>Dynamic route — resource missing</td>
                                <td><code>useRequest().status(404)</code> + inline JSX</td>
                            </tr>
                            <tr>
                                <td>API route — resource missing</td>
                                <td><code>res.json(&#123; error &#125;, 404)</code></td>
                            </tr>
                            <tr>
                                <td>Unhandled SSR exception</td>
                                <td><code>app/pages/500.tsx</code></td>
                            </tr>
                            <tr>
                                <td>Page with risky async logic</td>
                                <td><code>try/catch</code> + <code>useRequest().status(500)</code></td>
                            </tr>
                            <tr>
                                <td>API route — server failure</td>
                                <td><code>try/catch</code> + <code>res.json(&#123; error &#125;, 500)</code></td>
                            </tr>
                            <tr>
                                <td>Auth / access control</td>
                                <td><code>middleware.ts</code> + <code>res.statusCode = 401</code></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </article>
    )
}
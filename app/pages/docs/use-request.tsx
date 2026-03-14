import { useHtml } from "nukejs"
import CodeBlock from "../../components/docs/CodeBlock"

export default function UseRequestPage() {
    const title = "useRequest()"
    const subtitle = "Access URL params, query strings, and request headers from any component — server or client — with a single universal hook."
    useHtml({ title })
    return (
        <article className="doc-article">
            <header className="doc-article-header">
                <h1 className="doc-article-title">{title}</h1>
                <p className="doc-article-subtitle">{subtitle}</p>
            </header>

            <div className="doc-body">
                <h2>Overview</h2>
                <p>
                    <code>useRequest()</code> is a universal hook that exposes the current request's URL
                    parameters, query string, and headers to any React component — whether it runs on
                    the server (SSR) or in the browser as a client component. On the client it is
                    <strong> reactive</strong>: values update automatically on SPA navigation without a
                    full page reload.
                </p>

                <div className="doc-table-wrap">
                    <table className="doc-table">
                        <thead><tr><th>Environment</th><th>Data source</th></tr></thead>
                        <tbody>
                            <tr><td>SSR (server)</td><td>Request store populated by the SSR pipeline before rendering</td></tr>
                            <tr><td>Client (browser)</td><td><code>__n_data</code> JSON blob + <code>window.location</code>, reactive via <code>locationchange</code></td></tr>
                        </tbody>
                    </table>
                </div>

                <h2>Basic usage</h2>
                <p>
                    Import <code>useRequest</code> from <code>nukejs</code> and destructure the fields you need.
                    It works the same way in server components and <code>"use client"</code> components:
                </p>
                <CodeBlock filename="app/pages/blog/[slug].tsx" code={`import { useRequest } from 'nukejs'

export default async function BlogPost() {
    const { params, query, headers, pathname } = useRequest()

    const slug   = params.slug as string          // /blog/hello-world → 'hello-world'
    const lang   = (query.lang as string) ?? 'en' // ?lang=fr → 'fr'
    const locale = headers['accept-language']      // e.g. 'en-US,en;q=0.9'

    const post = await db.getPost(slug, lang)

    return (
        <article>
            <p>Reading in: {lang}</p>
            <h1>{post.title}</h1>
            <div>{post.body}</div>
        </article>
    )
}`} />

                <h2>Return value</h2>
                <p>
                    <code>useRequest()</code> returns a <code>RequestContext</code> object with the following fields:
                </p>
                <div className="doc-table-wrap">
                    <table className="doc-table">
                        <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <td>pathname</td>
                                <td>string</td>
                                <td>Pathname only, no query string. e.g. <code>'/blog/hello'</code></td>
                            </tr>
                            <tr>
                                <td>url</td>
                                <td>string</td>
                                <td>Full URL with query string. e.g. <code>'/blog/hello?lang=en'</code></td>
                            </tr>
                            <tr>
                                <td>params</td>
                                <td>Record&lt;string, string | string[]&gt;</td>
                                <td>Dynamic route segments matched by the file-system router. e.g. <code>{'{ slug: "hello" }'}</code></td>
                            </tr>
                            <tr>
                                <td>query</td>
                                <td>Record&lt;string, string | string[]&gt;</td>
                                <td>Parsed query string. Multi-value params become arrays. e.g. <code>{'{ tag: ["a", "b"] }'}</code></td>
                            </tr>
                            <tr>
                                <td>headers</td>
                                <td>Record&lt;string, string&gt;</td>
                                <td>Request headers. On the client, sensitive headers are stripped. See security note below.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2>Reading URL params</h2>
                <p>
                    Dynamic path segments defined with <code>[param]</code> in the filename are available
                    in <code>params</code>. Catch-all segments (<code>[...slug]</code>) produce arrays:
                </p>
                <CodeBlock filename="app/pages/shop/[category]/[id].tsx  →  /shop/electronics/42" code={`import { useRequest } from 'nukejs'

export default async function ProductPage() {
    const { params } = useRequest()

    const category = params.category as string // 'electronics'
    const id       = params.id as string       // '42'

    const product = await db.getProduct(category, id)
    return <h1>{product.name}</h1>
}`} />

                <CodeBlock filename="app/pages/docs/[...path].tsx  →  /docs/core/routing" code={`import { useRequest } from 'nukejs'

export default function DocsPage() {
    const { params } = useRequest()

    // Catch-all params are always arrays
    const segments = params.path as string[] // ['core', 'routing']
    const breadcrumb = segments.join(' › ')  // 'core › routing'

    return <nav>{breadcrumb}</nav>
}`} />

                <h2>Reading query strings</h2>
                <p>
                    Query string parameters are parsed and available in <code>query</code>. Repeated
                    keys become string arrays automatically:
                </p>
                <CodeBlock filename="app/pages/search.tsx  →  /search?q=nukejs&tag=react&tag=ssr" code={`import { useRequest } from 'nukejs'

export default async function SearchPage() {
    const { query } = useRequest()

    const q    = (query.q as string) ?? ''
    const tags = Array.isArray(query.tag)
        ? query.tag              // ['react', 'ssr']
        : query.tag ? [query.tag] : []

    const results = await db.search({ q, tags })

    return (
        <div>
            <h1>Results for "{q}"</h1>
            <p>Filtered by: {tags.join(', ')}</p>
            <ul>
                {results.map(r => <li key={r.id}>{r.title}</li>)}
            </ul>
        </div>
    )
}`} />

                <h2>Reading headers</h2>
                <p>
                    The full set of request headers is available server-side. On the client, a safe
                    subset is embedded in the page's <code>__n_data</code> blob. See the{" "}
                    <a href="#security">security note</a> below for which headers are stripped.
                </p>
                <CodeBlock filename="app/pages/index.tsx" code={`import { useRequest } from 'nukejs'

export default function HomePage() {
    const { headers } = useRequest()

    const lang      = headers['accept-language'] ?? 'en'  // e.g. 'fr-FR,fr;q=0.9'
    const userAgent = headers['user-agent'] ?? ''
    const isMobile  = /mobile/i.test(userAgent)

    return (
        <main>
            <p>Detected language: {lang.split(',')[0]}</p>
            {isMobile && <p>You are on a mobile device.</p>}
        </main>
    )
}`} />

                <h2>Using in client components</h2>
                <p>
                    <code>useRequest()</code> works inside <code>"use client"</code> components too. On the
                    client it reads from the <code>__n_data</code> blob and <code>window.location</code>,
                    and stays reactive across SPA navigation:
                </p>
                <CodeBlock filename="app/components/ActiveFilters.tsx" code={`"use client"
import { useRequest } from 'nukejs'

export default function ActiveFilters() {
    // Automatically re-renders when the URL changes (e.g. Link navigation)
    const { query, pathname } = useRequest()

    const sort   = (query.sort as string) ?? 'newest'
    const filter = (query.filter as string) ?? 'all'

    return (
        <div className="filters">
            <span>Path: {pathname}</span>
            <span>Sort: {sort}</span>
            <span>Filter: {filter}</span>
        </div>
    )
}`} />

                <div className="doc-callout tip">
                    <span className="doc-callout-icon">💡</span>
                    <div className="doc-callout-body">
                        <strong>Prefer <code>useRouter()</code> for the freshest pathname</strong>{" "}
                        On the client, <code>params</code> always reflects the <code>__n_data</code> blob
                        written at the time of the most recent SSR or navigation. For the most up-to-date
                        pathname, use <code>useRouter().path</code> instead.
                    </div>
                </div>

                <h2>Building custom hooks on top</h2>
                <p>
                    <code>useRequest()</code> is a great primitive for building your own domain-specific
                    hooks. Here are two practical examples:
                </p>

                <h3>useI18n — locale from query or Accept-Language header</h3>
                <CodeBlock filename="hooks/useI18n.ts" code={`import { useRequest } from 'nukejs'

const translations = {
    en: { welcome: 'Welcome', goodbye: 'Goodbye' },
    fr: { welcome: 'Bienvenue', goodbye: 'Au revoir' },
    de: { welcome: 'Willkommen', goodbye: 'Auf Wiedersehen' },
} as const

type Locale = keyof typeof translations

function parseLocale(header = ''): Locale {
    const tag = header.split(',')[0]?.split('-')[0]?.trim().toLowerCase()
    return (tag in translations ? tag : 'en') as Locale
}

export function useI18n() {
    const { query, headers } = useRequest()
    // ?lang=fr wins over the Accept-Language header
    const raw    = (query.lang as string) ?? parseLocale(headers['accept-language'])
    const locale = (raw in translations ? raw : 'en') as Locale
    return { t: translations[locale], locale }
}`} />
                <CodeBlock filename="app/pages/index.tsx" code={`import { useI18n } from '../../hooks/useI18n'

export default function HomePage() {
    const { t, locale } = useI18n()

    return (
        <main>
            <h1>{t.welcome}</h1>        {/* 'Bienvenue' for ?lang=fr */}
            <p>Active locale: {locale}</p>
        </main>
    )
}`} />

                <h3>usePagination — page & limit from query string</h3>
                <CodeBlock filename="hooks/usePagination.ts" code={`import { useRequest } from 'nukejs'

export function usePagination(defaultLimit = 20) {
    const { query } = useRequest()

    const page  = Math.max(1, parseInt(query.page  as string ?? '1',  10))
    const limit = Math.max(1, parseInt(query.limit as string ?? String(defaultLimit), 10))
    const skip  = (page - 1) * limit

    return { page, limit, skip }
}`} />
                <CodeBlock filename="app/pages/posts.tsx  →  /posts?page=3&limit=10" code={`import { usePagination } from '../../hooks/usePagination'

export default async function PostsPage() {
    const { page, limit, skip } = usePagination()

    const [posts, total] = await Promise.all([
        db.getPosts({ skip, limit }),
        db.countPosts(),
    ])

    const totalPages = Math.ceil(total / limit)

    return (
        <div>
            <ul>
                {posts.map(p => <li key={p.id}>{p.title}</li>)}
            </ul>
            <p>Page {page} of {totalPages}</p>
        </div>
    )
}`} />

                <h2 id="security">Security: headers on the client</h2>
                <p>
                    When NukeJS embeds headers in the <code>__n_data</code> blob, it strips the
                    following sensitive headers before serialising them into the HTML document.
                    This prevents credentials leaking into cached pages or analytics logs:
                </p>
                <div className="doc-table-wrap">
                    <table className="doc-table">
                        <thead><tr><th>Stripped header</th><th>Reason</th></tr></thead>
                        <tbody>
                            <tr><td><code>cookie</code></td><td>Session tokens — never expose to client HTML</td></tr>
                            <tr><td><code>authorization</code></td><td>Bearer tokens and basic auth credentials</td></tr>
                            <tr><td><code>proxy-authorization</code></td><td>Proxy credentials</td></tr>
                            <tr><td><code>set-cookie</code></td><td>Response cookies that should not be re-exposed</td></tr>
                            <tr><td><code>x-api-key</code></td><td>API keys passed as headers</td></tr>
                        </tbody>
                    </table>
                </div>
                <p>
                    Server components always receive the full set of headers including <code>cookie</code> and{" "}
                    <code>authorization</code> — stripping only applies to what is serialised into the
                    client-facing HTML page.
                </p>

                <div className="doc-callout info">
                    <span className="doc-callout-icon">ℹ️</span>
                    <div className="doc-callout-body">
                        <strong>Reading cookies server-side</strong>{" "}
                        To read cookies in a server component, access <code>headers['cookie']</code> directly
                        from <code>useRequest()</code>. The full string is available on the server and never
                        sent back to the browser via <code>__n_data</code>.
                    </div>
                </div>

                <CodeBlock filename="app/pages/dashboard.tsx" code={`import { useRequest } from 'nukejs'
import { parseSessionCookie } from '../../lib/auth'

export default async function DashboardPage() {
    // cookie is available server-side only — never exposed to the client
    const { headers } = useRequest()
    const session = parseSessionCookie(headers['cookie'] ?? '')

    if (!session) {
        // Redirect to login
        return null
    }

    const user = await db.getUser(session.userId)
    return <h1>Welcome, {user.name}</h1>
}`} />

                <h2>TypeScript: <code>RequestContext</code></h2>
                <p>The full type is exported from <code>nukejs</code> for use in your custom hooks and utilities:</p>
                <CodeBlock filename="hooks/useFeatureFlag.ts" code={`import { useRequest } from 'nukejs'
import type { RequestContext } from 'nukejs'

// Use the type directly in your own helpers
function getCountryFromContext(ctx: RequestContext): string {
    return (ctx.headers['cf-ipcountry'] ?? ctx.query.country ?? 'US') as string
}

export function useFeatureFlag(flag: string): boolean {
    const ctx = useRequest()
    const country = getCountryFromContext(ctx)

    // Enable feature for specific regions via query param override
    if (ctx.query['feature_' + flag] === '1') return true

    return FEATURE_FLAGS[flag]?.countries?.includes(country) ?? false
}`} />

                <div className="doc-callout tip">
                    <span className="doc-callout-icon">✅</span>
                    <div className="doc-callout-body">
                        <strong>Works without any provider</strong>{" "}
                        Unlike many routing hooks, <code>useRequest()</code> requires no context provider
                        or wrapper component. It reads directly from the NukeJS SSR store on the server
                        and from <code>__n_data</code> + <code>window.location</code> on the client.
                    </div>
                </div>
            </div>
        </article>
    )
}
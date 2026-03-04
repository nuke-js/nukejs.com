import { useHtml } from "nukejs"
import CodeBlock from "../../components/docs/CodeBlock"

export default function RoutingPage() {
    const title = "Pages & Routing"
    const subtitle = "NukeJS maps your file system directly to URL routes — no router config, no imports required."
    useHtml({ title })
    const prev = { href: "/docs/project-structure", label: "Project Structure" }
    const next = { href: "/docs/layouts", label: "Layouts" }
    return (
        <article className="doc-article">
            <header className="doc-article-header">
                <h1 className="doc-article-title">{title}</h1>
                {subtitle && <p className="doc-article-subtitle">{subtitle}</p>}
            </header>

            <div className="doc-body">
                <h2>File → URL mapping</h2>
                <p>Every <code>.tsx</code> file inside <code>app/pages/</code> that exports a default component becomes a route.</p>

                <div className="doc-table-wrap">
                    <table className="doc-table">
                        <thead><tr><th>File</th><th>URL</th></tr></thead>
                        <tbody>
                            <tr><td>app/pages/index.tsx</td><td>/</td></tr>
                            <tr><td>app/pages/about.tsx</td><td>/about</td></tr>
                            <tr><td>app/pages/blog/index.tsx</td><td>/blog</td></tr>
                            <tr><td>app/pages/blog/[slug].tsx</td><td>/blog/:slug</td></tr>
                            <tr><td>app/pages/docs/[...path].tsx</td><td>/docs/* (catch-all)</td></tr>
                            <tr><td>app/pages/files/[[...path]].tsx</td><td>/files or /files/* (optional catch-all)</td></tr>
                        </tbody>
                    </table>
                </div>

                <h2>Basic page</h2>
                <p>Pages can be <code>async</code> — async code runs on the server before the HTML is sent:</p>
                <CodeBlock filename="app/pages/index.tsx" code={`export default async function Home() {
    const posts = await db.getPosts() // runs on server, no JS sent to browser

    return (
        <main>
            <h1>Blog</h1>
            {posts.map(p => (
                <article key={p.id}>
                    <h2>{p.title}</h2>
                    <p>{p.excerpt}</p>
                </article>
            ))}
        </main>
    )
}`} />

                <h2>Dynamic routes</h2>
                <p>Wrap a segment in <code>[brackets]</code>. The segment name becomes a prop on the component:</p>
                <CodeBlock filename="app/pages/blog/[slug].tsx" code={`export default async function BlogPost({ slug }: { slug: string }) {
    const post = await fetchPost(slug)

    if (!post) {
        // handle 404 however you like
        return <h1>Post not found</h1>
    }

    return (
        <article>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
        </article>
    )
}`} />

                <h2>Catch-all routes</h2>
                <p>Use <code>[...param]</code> to match one or more path segments. The value is a <code>string[]</code>:</p>
                <CodeBlock filename="app/pages/docs/[...path].tsx" code={`export default function Docs({ path }: { path: string[] }) {
    // /docs/getting-started/installation → path = ['getting-started', 'installation']
    return <DocViewer segments={path} />
}`} />
                <p>Use <code>[[...param]]</code> (double brackets) to also match the route with no trailing segments.</p>

                <h2>Route specificity</h2>
                <p>When multiple files could match, the most specific one wins:</p>
                <CodeBlock language="bash" code={`/users/profile  →  pages/users/profile.tsx    (static — wins)
/users/42       →  pages/users/[id].tsx       (dynamic)
/users/a/b/c    →  pages/users/[...rest].tsx  (catch-all)`} />

                <div className="doc-callout info">
                    <span className="doc-callout-icon">ℹ️</span>
                    <div className="doc-callout-body">
                        <strong>layout.tsx is never a route</strong>
                        Files named <code>layout.tsx</code> are always treated as layout wrappers, never as routes.
                        Visiting <code>/blog/layout</code> will not match <code>app/pages/blog/layout.tsx</code>.
                    </div>
                </div>
            </div>
        </article>
    )
}

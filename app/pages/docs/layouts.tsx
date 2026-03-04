import { useHtml } from "nukejs"
import CodeBlock from "../../components/docs/CodeBlock"

export default function LayoutsPage() {
    const title = "Layouts"
    const subtitle = "Layouts wrap pages with shared UI. They nest automatically based on the directory structure."
    useHtml({ title })
    const prev = { href: "/docs/routing", label: "Pages & Routing" }
    const next = { href: "/docs/client-components", label: "Client Components" }
    return (
        <article className="doc-article">
            <header className="doc-article-header">
                <h1 className="doc-article-title">{title}</h1>
                {subtitle && <p className="doc-article-subtitle">{subtitle}</p>}
            </header>

            <div className="doc-body">
                <h2>Creating a layout</h2>
                <p>
                    Place a <code>layout.tsx</code> inside any directory under <code>app/pages/</code>.
                    It wraps every page in that directory and all subdirectories.
                    It receives a <code>children</code> prop that renders the current page.
                </p>
                <CodeBlock filename="app/pages/layout.tsx" code={`import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Nav />
            <main>{children}</main>
            <Footer />
        </>
    )
}`} />

                <h2>Nested layouts</h2>
                <p>Layouts compose automatically by directory depth. A page at <code>blog/[slug].tsx</code> gets wrapped by both the root layout and <code>blog/layout.tsx</code>:</p>
                <CodeBlock filename="app/pages/blog/layout.tsx" code={`export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="blog-grid">
            <aside>
                <BlogSidebar />
            </aside>
            <section>{children}</section>
        </div>
    )
}`} />
                <p>The full render tree for <code>/blog/hello-world</code> is:</p>
                <CodeBlock language="bash" code={`RootLayout        ← app/pages/layout.tsx
  └── BlogLayout  ← app/pages/blog/layout.tsx
        └── BlogPost  ← app/pages/blog/[slug].tsx`} />

                <h2>Title templates</h2>
                <p>Layouts can compose page titles using <code>useHtml()</code>. Pass a function that receives the page's title and returns the final string:</p>
                <CodeBlock filename="app/pages/layout.tsx" code={`import { useHtml } from 'nukejs'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    useHtml({ title: (prev) => \`\${prev} | Acme Corp\` })
    return <>{children}</>
}`} />
                <CodeBlock filename="app/pages/about.tsx" code={`import { useHtml } from 'nukejs'

export default function About() {
    useHtml({ title: 'About Us' })
    // Final <title>: "About Us | Acme Corp"
    return <h1>About</h1>
}`} />
                <p>The page title is the base value. Layout functions wrap it outward, from innermost to outermost layout.</p>

                <div className="doc-callout tip">
                    <span className="doc-callout-icon">✅</span>
                    <div className="doc-callout-body">
                        <strong>Layouts can also be async</strong>
                        Just like pages, layouts can be async server components. Useful for fetching user session data, feature flags, or anything you need across all pages in a section.
                    </div>
                </div>
            </div>
        </article>
    )
}

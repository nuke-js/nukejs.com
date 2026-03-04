import { useHtml } from "nukejs"
import DocSidebar from "../../components/docs/DocSidebar"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    useHtml({
        title: (t) => `${t} - Docs`,
        link: [
            { rel: "stylesheet", href: "/atom-one-dark.min.css" },
        ]
    })
    return (
        <div className="doc-root">
            <DocSidebar />
            <main className="doc-main">
                {children}
            </main>
        </div>
    )
}

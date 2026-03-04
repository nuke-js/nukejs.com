import { useHtml } from "nukejs"
import Nav from "../components/Nav"
import Footer from "../components/Footer"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "../consts"

export default function Layout({ children }: { children: React.ReactNode }) {
    useHtml({
        title: (title) => `${title} - ${SITE_NAME}`,
        meta: [
            // Core
            { name: "description", content: SITE_DESCRIPTION },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { name: "robots", content: "index, follow" },
            { name: "author", content: SITE_NAME },
            { charset: "utf-8" },

            // Open Graph
            { property: "og:type", content: "website" },
            { property: "og:site_name", content: SITE_NAME },
            { property: "og:url", content: SITE_URL },
            { property: "og:title", content: `${SITE_NAME} — React. Weaponized.` },
            { property: "og:description", content: SITE_DESCRIPTION },
            { property: "og:image", content: `${SITE_URL}/web-app-manifest-512x512.png` },
            { property: "og:image:width", content: "512" },
            { property: "og:image:height", content: "512" },
            { property: "og:image:alt", content: `${SITE_NAME} logo` },

            // Twitter / X Card
            { name: "twitter:card", content: "summary" },
            { name: "twitter:title", content: `${SITE_NAME} — React. Weaponized.` },
            { name: "twitter:description", content: SITE_DESCRIPTION },
            { name: "twitter:image", content: `${SITE_URL}/web-app-manifest-512x512.png` },
        ],
        link: [
            { rel: "canonical", href: SITE_URL },
            { rel: "shortcut icon", href: "/favicon.ico" },
            { rel: "icon", href: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
            { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
            { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
            { rel: "manifest", href: "/site.webmanifest" },
            { rel: "stylesheet", href: "/main.css" },
        ],
    })
    return <>
        <Nav />
        {children}
        <Footer />
    </>
}

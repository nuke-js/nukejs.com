import { useHtml } from "nukejs"
import CodeBlock from "../../components/docs/CodeBlock"

export default function I18nPage() {
    const title = "Internationalisation (i18n)"
    const subtitle = "Add multi-language support with locale-based routing, a tiny useI18n() hook, and plain JSON translation files — no third-party library required."
    useHtml({ title })
    return (
        <article className="doc-article">
            <header className="doc-article-header">
                <h1 className="doc-article-title">{title}</h1>
                <p className="doc-article-subtitle">{subtitle}</p>
            </header>

            <div className="doc-body">

                {/* ── How it works ─────────────────────────────────── */}
                <h2>How it works</h2>
                <p>
                    NukeJS has no built-in i18n API. Instead, internationalisation is wired up
                    with three pieces that each do one job:
                </p>
                <p>
                    A <code>[locale]</code> dynamic segment in <code>app/pages/</code> makes the
                    language part of the URL (<code>/en/about</code>, <code>/fr/about</code>).
                    A <code>useI18n()</code> hook reads that segment via <code>useRequest()</code>
                    and returns the matching JSON translations. Middleware detects the browser's
                    preferred language and redirects bare requests to the right locale prefix.
                    The whole setup is server-only — no runtime i18n overhead reaches the browser.
                </p>

                {/* ── Project structure ────────────────────────────── */}
                <h2>Project structure</h2>
                <p>Add a <code>locales/</code> folder for JSON files and a <code>lib/</code> folder for the hook. Locale-aware pages live under <code>app/pages/[locale]/</code>:</p>
                <CodeBlock language="bash" code={`my-app/
├── app/
│   ├── components/
│   │   └── LangSwitcher.tsx     # "use client" switcher component
│   └── pages/
│       └── [locale]/
│           ├── index.tsx        # → /en  or  /fr
│           └── about.tsx        # → /en/about  or  /fr/about
├── lib/
│   └── useI18n.ts               # locale hook
├── locales/
│   ├── en.json                  # English strings (source of truth)
│   └── fr.json                  # French strings  (must match en.json shape)
└── middleware.ts                # auto-redirect / → detected locale`} />

                {/* ── Translation files ────────────────────────────── */}
                <h2>Translation files</h2>
                <p>
                    Every locale file shares the exact same shape. <code>en.json</code> is the
                    source of truth — TypeScript infers the <code>Translations</code> type from it,
                    so a missing or misspelled key in any other locale file is a compile error.
                </p>
                <CodeBlock filename="locales/en.json" language="json" code={`{
  "meta": { "lang": "en", "dir": "ltr" },

  "welcome":     "Welcome to NukeJS",
  "hello":       "Hello, World!",
  "greeting":    "Good to see you",
  "description": "A minimal, opinionated full-stack React framework.",
  "tagline":     "Server-render everything. Hydrate only what moves.",

  "nav": {
    "home":  "Home",
    "about": "About",
    "blog":  "Blog",
    "docs":  "Docs"
  },

  "actions": {
    "getStarted": "Get started",
    "readDocs":   "Read the docs",
    "switchLang": "Switch language",
    "learnMore":  "Learn more"
  },

  "home": {
    "headline":    "React. Weaponized.",
    "subheadline": "Zero JS by default — ship only what the user actually needs."
  },

  "about": {
    "title": "About",
    "body":  "NukeJS ships zero JavaScript by default. Every page is server-rendered HTML. Only components marked 'use client' ever touch the browser bundle."
  },

  "errors": {
    "notFound":    "Page not found",
    "serverError": "Something went wrong"
  }
}`} />

                <CodeBlock filename="locales/fr.json" language="json" code={`{
  "meta": { "lang": "fr", "dir": "ltr" },

  "welcome":     "Bienvenue sur NukeJS",
  "hello":       "Bonjour, le monde !",
  "greeting":    "Ravi de vous voir",
  "description": "Un framework React full-stack minimal et opinionné.",
  "tagline":     "Tout est rendu côté serveur. Seul ce qui bouge est hydraté.",

  "nav": {
    "home":  "Accueil",
    "about": "À propos",
    "blog":  "Blog",
    "docs":  "Documentation"
  },

  "actions": {
    "getStarted": "Commencer",
    "readDocs":   "Lire la documentation",
    "switchLang": "Changer de langue",
    "learnMore":  "En savoir plus"
  },

  "home": {
    "headline":    "React. Militarisé.",
    "subheadline": "Zéro JS par défaut — n'envoyez que ce dont l'utilisateur a besoin."
  },

  "about": {
    "title": "À propos",
    "body":  "NukeJS n'envoie aucun JavaScript par défaut. Chaque page est rendue en HTML côté serveur. Seuls les composants marqués « use client » sont inclus dans le bundle navigateur."
  },

  "errors": {
    "notFound":    "Page introuvable",
    "serverError": "Une erreur est survenue"
  }
}`} />

                {/* ── useI18n hook ─────────────────────────────────── */}
                <h2>The <code>useI18n()</code> hook</h2>
                <p>
                    Create <code>lib/useI18n.ts</code>. The hook reads the <code>[locale]</code> route
                    segment via <code>useRequest()</code>, resolves it to a supported locale, and returns
                    the matching translation object alongside the resolved locale string.
                    Because <code>useRequest()</code> is server-only, the entire lookup happens at render
                    time — zero bytes reach the browser.
                </p>
                <CodeBlock filename="lib/useI18n.ts" code={`import { useRequest } from "nukejs"
import en from "../locales/en.json"
import fr from "../locales/fr.json"

// ─── Types ────────────────────────────────────────────────────────────

const translations = { en, fr } as const

export type Locale       = keyof typeof translations
export type Translations = typeof en   // fr must match this shape exactly

// ─── Locale resolver ──────────────────────────────────────────────────

function resolveLocale(param: string | string[] | undefined): Locale {
    if (!param) return "en"
    const tag = (Array.isArray(param) ? param[0] : param)
        .trim()
        .toLowerCase() as Locale
    return tag in translations ? tag : "en"
}

// ─── Hook ─────────────────────────────────────────────────────────────

export function useI18n(): { t: Translations; locale: Locale } {
    const { params } = useRequest()
    const locale = resolveLocale(params.locale as string | undefined)
    return { t: translations[locale], locale }
}`} />

                <div className="doc-callout info">
                    <span className="doc-callout-icon">ℹ️</span>
                    <div className="doc-callout-body">
                        <strong>Type safety is automatic</strong>{" "}
                        TypeScript infers <code>Translations</code> from <code>en.json</code>.
                        If <code>fr.json</code> is missing a key or has a different structure,
                        the build fails before anything ships.
                    </div>
                </div>

                {/* ── Locale-based routing ─────────────────────────── */}
                <h2>Locale-based routing</h2>
                <p>
                    Place pages inside <code>app/pages/[locale]/</code>. The dynamic segment is
                    passed as a prop and <code>useI18n()</code> picks it up automatically through
                    <code>useRequest()</code> — no prop drilling required.
                    The same file handles every locale: <code>/en/about</code> and <code>/fr/about</code>
                    both render <code>app/pages/[locale]/about.tsx</code>.
                </p>
                <CodeBlock filename="app/pages/[locale]/index.tsx" code={`import { useHtml } from "nukejs"
import { useI18n } from "../../lib/useI18n"
import LangSwitcher from "../../components/LangSwitcher"

export default function Home() {
    const { t, locale } = useI18n()

    useHtml({
        title: t.welcome,
        htmlAttrs: { lang: t.meta.lang, dir: t.meta.dir },
    })

    return (
        <main>
            <h1>{t.hello}</h1>
            <p>{t.greeting}</p>

            <p>{t.home.headline}</p>
            <p>{t.home.subheadline}</p>

            <nav>
                <a href={\`/\${locale}\`}>{t.nav.home}</a>
                <a href={\`/\${locale}/about\`}>{t.nav.about}</a>
            </nav>

            <LangSwitcher current={locale} />
        </main>
    )
}`} />

                <CodeBlock filename="app/pages/[locale]/about.tsx" code={`import { useHtml } from "nukejs"
import { useI18n } from "../../lib/useI18n"

export default function About() {
    const { t } = useI18n()

    useHtml({
        title: t.about.title,
        htmlAttrs: { lang: t.meta.lang, dir: t.meta.dir },
    })

    return (
        <main>
            <h1>{t.about.title}</h1>
            <p>{t.about.body}</p>
            <a href="./about">{t.actions.learnMore}</a>
        </main>
    )
}`} />

                <div className="doc-callout tip">
                    <span className="doc-callout-icon">✅</span>
                    <div className="doc-callout-body">
                        <strong>Set <code>lang</code> and <code>dir</code> on every page</strong>{" "}
                        Passing <code>{'htmlAttrs: { lang: t.meta.lang, dir: t.meta.dir }'}</code> through
                        {" "}<code>useHtml()</code> writes the correct attributes to the{" "}
                        <code>{"<html>"}</code> tag on every server render. Screen readers, browser
                        translation prompts, and search engines all rely on this.
                    </div>
                </div>

                {/* ── Language switcher ────────────────────────────── */}
                <h2>Language switcher</h2>
                <p>
                    The switcher is a client component so it can react to clicks without a full page reload.
                    It replaces only the locale segment in the current URL, preserving the rest of the path,
                    then calls <code>router.push()</code> for a client-side transition:
                </p>
                <CodeBlock filename="app/components/LangSwitcher.tsx" code={`"use client"
import { useRouter } from "nukejs"
import type { Locale } from "../lib/useI18n"

const LOCALES: { code: Locale; label: string }[] = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
]

export default function LangSwitcher({ current }: { current: Locale }) {
    const router = useRouter()

    function switchTo(next: Locale) {
        // /en/about  →  /fr/about
        const newPath = window.location.pathname.replace(
            /^\\/[a-z]{2}/,
            \`/\${next}\`,
        )
        router.push(newPath)
    }

    return (
        <div>
            {LOCALES.map(({ code, label }) => (
                <button
                    key={code}
                    onClick={() => switchTo(code)}
                    disabled={code === current}
                    aria-current={code === current ? "true" : undefined}
                    aria-label={\`Switch to \${label}\`}
                >
                    {label}
                </button>
            ))}
        </div>
    )
}`} />

                {/* ── Middleware redirect ───────────────────────────── */}
                <h2>Redirecting to the detected locale</h2>
                <p>
                    Use <code>middleware.ts</code> to redirect any request without a locale prefix.
                    The <code>Accept-Language</code> header tells you which language the browser prefers,
                    so users land on the right locale automatically without any cookie or session:
                </p>
                <CodeBlock filename="middleware.ts" code={`import type { IncomingMessage, ServerResponse } from "http"
import type { Locale } from "./lib/useI18n"

const SUPPORTED: Locale[] = ["en", "fr"]
const DEFAULT_LOCALE: Locale = "en"

function detectLocale(req: IncomingMessage): Locale {
    // Accept-Language: fr-FR,fr;q=0.9,en;q=0.8
    const accept = req.headers["accept-language"] ?? ""
    const preferred = accept.split(",")[0].split("-")[0].toLowerCase() as Locale
    return SUPPORTED.includes(preferred) ? preferred : DEFAULT_LOCALE
}

export default async function middleware(
    req: IncomingMessage,
    res: ServerResponse,
) {
    const url = req.url ?? "/"

    // Skip static assets, client bundles, and API routes
    if (url.startsWith("/__") || url.startsWith("/api") || url.includes(".")) {
        return
    }

    // Already has a supported locale prefix — let routing handle it
    const hasLocale = SUPPORTED.some(
        l => url === \`/\${l}\` || url.startsWith(\`/\${l}/\`),
    )
    if (hasLocale) return

    // Redirect to the browser's preferred locale
    const locale = detectLocale(req)
    res.statusCode = 302
    res.setHeader("Location", \`/\${locale}\${url === "/" ? "" : url}\`)
    res.end()
}`} />

                <div className="doc-callout warning">
                    <span className="doc-callout-icon">⚠️</span>
                    <div className="doc-callout-body">
                        <strong>The redirect fires before the 404 page</strong>{" "}
                        Middleware runs before every request. If it calls <code>res.end()</code>,
                        NukeJS stops immediately — the page router never runs. Always guard with{" "}
                        <code>url.includes(".")</code> to avoid intercepting static file requests.
                    </div>
                </div>

                {/* ── i18n in API routes ───────────────────────────── */}
                <h2>Translations in API routes</h2>
                <p>
                    Server-side handlers in <code>server/</code> don't use the hook. Import the locale
                    files directly and select the right one from <code>req.params</code>:
                </p>
                <CodeBlock filename="server/[locale]/greet.ts" code={`import type { ApiRequest, ApiResponse } from "nukejs"
import en from "../../locales/en.json"
import fr from "../../locales/fr.json"

const translations = { en, fr } as const
type Locale = keyof typeof translations

export async function GET(req: ApiRequest, res: ApiResponse) {
    const raw = req.params.locale as string
    const locale: Locale = raw in translations ? (raw as Locale) : "en"
    const t = translations[locale]

    res.json({
        locale,
        message: t.greeting,
        direction: t.meta.dir,
    })
}`} />

                <p><code>GET /en/greet</code> responds with:</p>
                <CodeBlock language="json" code={`{ "locale": "en", "message": "Good to see you", "direction": "ltr" }`} />

                <p><code>GET /fr/greet</code> responds with:</p>
                <CodeBlock language="json" code={`{ "locale": "fr", "message": "Ravi de vous voir", "direction": "ltr" }`} />

                {/* ── Adding a new locale ──────────────────────────── */}
                <h2>Adding a new locale</h2>
                <p>
                    Adding a third language takes four steps and no new dependencies:
                </p>
                <CodeBlock language="bash" code={`# 1. Copy en.json and translate every value
cp locales/en.json locales/de.json`} />
                <CodeBlock filename="lib/useI18n.ts" code={`import de from "../locales/de.json"

const translations = { en, fr, de } as const  // add de here`} />
                <CodeBlock filename="middleware.ts" code={`const SUPPORTED: Locale[] = ["en", "fr", "de"]  // add de here`} />
                <CodeBlock filename="app/components/LangSwitcher.tsx" code={`const LOCALES = [
    { code: "en", label: "English"  },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch"  },  // add de here
]`} />

                <div className="doc-callout info">
                    <span className="doc-callout-icon">ℹ️</span>
                    <div className="doc-callout-body">
                        <strong>TypeScript catches missing keys immediately</strong>{" "}
                        If <code>de.json</code> is missing a key that exists in <code>en.json</code>,
                        the assignment <code>{'const translations = { en, fr, de } as const'}</code> will
                        produce a type error before the build finishes.
                    </div>
                </div>

                {/* ── Quick reference ──────────────────────────────── */}
                <h2>Quick reference</h2>
                <div className="doc-table-wrap">
                    <table className="doc-table">
                        <thead>
                            <tr>
                                <th>File</th>
                                <th>Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>locales/en.json</code></td>
                                <td>English strings — source of truth for TypeScript types</td>
                            </tr>
                            <tr>
                                <td><code>locales/fr.json</code></td>
                                <td>French strings — must match <code>en.json</code> shape exactly</td>
                            </tr>
                            <tr>
                                <td><code>lib/useI18n.ts</code></td>
                                <td>Hook — reads <code>[locale]</code> param, returns <code>{'{ t, locale }'}</code></td>
                            </tr>
                            <tr>
                                <td><code>app/pages/[locale]/</code></td>
                                <td>All locale-aware pages live here (<code>/en/*</code>, <code>/fr/*</code>)</td>
                            </tr>
                            <tr>
                                <td><code>app/components/LangSwitcher.tsx</code></td>
                                <td>Client component — swaps locale prefix, navigates client-side</td>
                            </tr>
                            <tr>
                                <td><code>middleware.ts</code></td>
                                <td>Reads <code>Accept-Language</code>, redirects <code>/</code> to detected locale</td>
                            </tr>
                            <tr>
                                <td><code>useHtml({'({ htmlAttrs: { lang, dir } })'})</code></td>
                                <td>Writes correct <code>lang</code> and <code>dir</code> to <code>{"<html>"}</code> on every page</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </article>
    )
}
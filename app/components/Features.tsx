export default function Features() {
    return <div className="section">
        <div>
            <p className="eyebrow">Features</p>
            <h2 className="section-h">What NukeJS gives you</h2>
            <p className="section-sub">Everything you need to build and ship a React app — no configuration required.</p>
        </div>

        <div className="feat-grid">
            {/* Zero dependencies — hero card, full width */}
            <div className="feat-card">
                <span className="feat-icon">🪶</span>
                <div className="feat-title">
                    Zero Dependencies
                    <span className="feat-badge">0 deps</span>
                </div>
                <p className="feat-desc">NukeJS ships with no runtime dependencies — not a single one. No supply-chain surprises, no bloat, no version conflicts. Just your code and Node.</p>
            </div>

            <div className="feat-card">
                <span className="feat-icon">🚀</span>
                <div className="feat-title">Server-Side Rendering</div>
                <p className="feat-desc">Pages are rendered on the server on every request, or at build time. Fast first loads, great for SEO, fully configurable per route.</p>
            </div>

            <div className="feat-card">
                <span className="feat-icon">🛣️</span>
                <div className="feat-title">File-Based Routing</div>
                <p className="feat-desc">Drop a file into <code style={{
                    fontSize: '0.75em',
                    color: 'var(--accent)'
                }}>app/pages/</code> and it becomes a route automatically. Dynamic segments, nested layouts, API routes — all in your file tree.</p>
            </div>

            <div className="feat-card">
                <span className="feat-icon">🔌</span>
                <div className="feat-title">API Routes</div>
                <p className="feat-desc">Write backend handlers alongside your frontend. Files in <code style={{
                    fontSize: '0.75em',
                    color: 'var(--accent)'
                }}>server/</code> become serverless functions, automatically.</p>
            </div>

            <div className="feat-card">
                <span className="feat-icon">⚡</span>
                <div className="feat-title">Hot Module Replacement</div>
                <p className="feat-desc">Edit a component and see it update instantly in the browser — no full refresh, no lost state. Your dev loop stays fast.</p>
            </div>

            <div className="feat-card">
                <span className="feat-icon">🔗</span>
                <div className="feat-title">Middleware</div>
                <p className="feat-desc">Run logic before any route — auth checks, redirects, logging, request enrichment. Chain as many middlewares as you need, globally or per route.</p>
            </div>

            <div className="feat-card">
                <span className="feat-icon">⚛️</span>
                <div className="feat-title">Full React Support</div>
                <p className="feat-desc">Every React feature works — hooks, context, suspense, concurrent mode. Bring your own component library, state manager, and styles.</p>
            </div>

            <div className="feat-card">
                <span className="feat-icon">📦</span>
                <div className="feat-title">TypeScript, out of the box</div>
                <p className="feat-desc">Zero config TypeScript support. Full type inference for routes, props, and API responses. No tsconfig wrestling required.</p>
            </div>
        </div>
    </div>
}
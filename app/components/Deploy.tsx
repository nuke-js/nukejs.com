export default function Deploy() {
    return <div className="deploy-strip">
        <div className="deploy-inner">
            <div className="deploy-text">
                <p className="eyebrow">Deployment</p>
                <h3>Deploy anywhere you run JavaScript.</h3>
                <p>NukeJS builds to a standard Node.js server or a Vercel-compatible output. One codebase, any host.</p>
            </div>
            <div className="deploy-targets">
                <div className="deploy-card">
                    <div className="deploy-logo">▲</div>
                    <div className="deploy-name">Vercel</div>
                    <div className="deploy-note">Zero config</div>
                </div>
                <div className="deploy-card">
                    <div className="deploy-logo" style={{
                        fontSize: '1.3rem',
                        color: '#68a063'
                    }}>⬡</div>
                    <div className="deploy-name">Node.js</div>
                    <div className="deploy-note">Self-host anywhere</div>
                </div>
            </div>
        </div>
    </div>
}
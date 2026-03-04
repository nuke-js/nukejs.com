import { Link } from "nukejs"
import { GITHUB_URL } from "../consts"

export default function Footer() {
    return <footer>
        <Link href="/"><div className="footer-logo">nuke<span>js</span></div></Link>
        <ul className="footer-links">
            <li><Link href="/docs">Docs</Link></li>
            <li><a href={GITHUB_URL} target="_blank">GitHub</a></li>
        </ul>
        <span className="footer-copy">MIT License © 2026 NukeJS</span>
    </footer>
}
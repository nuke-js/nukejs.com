import { Link } from "nukejs";
import { GITHUB_URL, VERSION } from "../consts";

export default function Nav() {
    return <nav>
        <span>
            <Link href="/"><span className="logo">nuke<span>js</span></span></Link>
            <span className="btn-outline-primary" style={{ marginLeft: '4px' }}>v{VERSION}</span>
        </span>
        <ul className="nav-links">
            <li><Link href="/docs">Docs</Link></li>
            {/* <li><a href="#">Examples</a></li> */}
            <li><a href={GITHUB_URL} target="_blank">GitHub</a></li>
            {/* <li><a href="#" className="nav-cta">Get Started</a></li> */}
        </ul>
    </nav>
}
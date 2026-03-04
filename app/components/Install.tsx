"use client"

import { useState } from "react"

export default function Install() {

    const [copied, setCopied] = useState(false)

    function copy() {
        navigator.clipboard?.writeText('npm create nuke@latest')
        setCopied(true)
    }

    return <div className="install" onClick={() => copy()}>
        <span>$ npm create nuke@latest</span>
        <span className="hint">{copied ? "Copied!" : "click to copy"}</span>
    </div>
}
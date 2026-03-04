import hljs from 'highlight.js/lib/core'
import ts from 'highlight.js/lib/languages/typescript'
import js from 'highlight.js/lib/languages/javascript'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'

hljs.registerLanguage('typescript', ts)
hljs.registerLanguage('javascript', js)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('xml', xml)

interface CodeBlockProps {
    code: string
    language?: 'typescript' | 'javascript' | 'bash' | 'css' | 'json' | 'xml'
    filename?: string
}

export default function CodeBlock({ code, language = 'typescript', filename }: CodeBlockProps) {
    const highlighted = hljs.highlight(code.trim(), { language }).value

    return (
        <div className="doc-code-block">
            {filename && (
                <div className="doc-code-header">
                    <span className="doc-code-filename">{filename}</span>
                    <span className="doc-code-lang">{language}</span>
                </div>
            )}
            <div
                className="doc-code-body"
                dangerouslySetInnerHTML={{ __html: `<pre><code class="hljs language-${language}">${highlighted}</code></pre>` }}
            />
        </div>
    )
}

// Using ES6 import syntax
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

// Then register the languages you need
hljs.registerLanguage('javascript', javascript);

const code = `import { ReactNode } from "react";
import { useHtml } from "nukejs";

export default function Layout({ children }: { children: ReactNode }) {
    useHtml({
        title: (t) => { return \`Nukejs - \${t}\` },
        script: [{ defer: true, src: "/tailwindcss" }],
        link: [{
            rel: "stylesheet",
            href: "/main.css"
        }]
    })
    return <div className="flex">
        <div className="flex m-auto">{children}</div>
    </div>
}
`

export default function () {
    return <div dangerouslySetInnerHTML={{
        __html: hljs.highlight(
            code,
            { language: 'javascript' }
        ).value
    }}></div>
}
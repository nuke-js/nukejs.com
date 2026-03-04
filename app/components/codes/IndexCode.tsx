// Using ES6 import syntax
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

// Then register the languages you need
hljs.registerLanguage('javascript', javascript);

const code = `import { useHtml } from "nukejs";
export default async function Index() {
    const title = "Full-stack JS Framework"
    useHtml({
        title,
        htmlAttrs: {
            lang: "en"
        },
        meta: [{ 
            name: "description", 
            content: "React. Weaponized."
        }]
    })
    return <>
                <h1>{title}</h1>
           </>
}`

export default function () {
    return <div dangerouslySetInnerHTML={{
        __html: hljs.highlight(
            code,
            { language: 'javascript' }
        ).value
    }}></div>
}
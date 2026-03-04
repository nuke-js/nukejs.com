// Using ES6 import syntax
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

// Then register the languages you need
hljs.registerLanguage('javascript', javascript);

const code = `export async function GET(req: any, res: any) {
        res.json({time: Date.now()});
        res.end()
    }`

export default function () {
    return <div dangerouslySetInnerHTML={{
        __html: hljs.highlight(
            code,
            { language: 'javascript' }
        ).value
    }}></div>
}
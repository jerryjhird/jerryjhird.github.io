function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function renderMarkdown(md) {
    const codeBlocks = [];
    const inlineCodes = [];
    const syntaxHighlighting = localStorage.getItem("mdtml.experimental.SyntaxHighlighting") === "true";

    md = md.replace(/^```([^\n]*)\n([\s\S]*?)\n```/gm, (_, lang, code) => {
        const token = `%%CODEBLOCK_${codeBlocks.length}%%`;

        const languageClass = lang.trim()
            ? `language-${lang.trim()}`
            : "";

        const codeContent = syntaxHighlighting ? code.trim() : code;

        codeBlocks.push(
            `<pre class="bg-gray-800 p-3 rounded overflow-x-auto"><code class="${languageClass}">${escapeHTML(codeContent)}</code></pre>`
        );

        return token;
    });

    md = md.replace(/`([^`]+)`/g, (_, code) => {
        const token = `%%INLINECODE_${inlineCodes.length}%%`;
        inlineCodes.push(
            `<code class="bg-gray-700 px-1 rounded">${escapeHTML(code)}</code>`
        );
        return token;
    });

    const lines = md.split("\n");
    let html = "";
    let inUL = false;
    let inOL = false;
    let inBlockquote = false;

    function closeLists() {
        if (inUL) { html += "</ul>"; inUL = false; }
        if (inOL) { html += "</ol>"; inOL = false; }
    }

    function closeBlockquote() {
        if (inBlockquote) { html += "</blockquote>"; inBlockquote = false; }
    }

    for (let line of lines) {

        // horizomtal rule
        if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
            closeLists();
            closeBlockquote();
            html += '<hr class="border-gray-600 my-4">';
            continue;
        }

        // headers
        const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
        if (headerMatch) {
            closeLists();
            closeBlockquote();
            const level = headerMatch[1].length;
            html += `<h${level} class="font-bold text-${4 - level + 1}xl">${headerMatch[2]}</h${level}>`;
            continue;
        }

        // blockquote
        if (/^>\s?/.test(line)) {
            closeLists();
            if (!inBlockquote) {
                html += "<blockquote class='border-l-4 border-gray-500 pl-4 italic'>";
                inBlockquote = true;
            }
            html += line.replace(/^>\s?/, "");
            continue;
        } else {
            closeBlockquote();
        }

        // unordered list
        const ulMatch = line.match(/^\s*[-*]\s+(.*)$/);
        if (ulMatch) {
            closeBlockquote();
            if (!inUL) {
                closeLists();
                html += "<ul class='list-disc ml-6'>";
                inUL = true;
            }
            html += `<li>${ulMatch[1]}</li>`;
            continue;
        }

        // ordered list
        const olMatch = line.match(/^\s*\d+\.\s+(.*)$/);
        if (olMatch) {
            closeBlockquote();
            if (!inOL) {
                closeLists();
                html += "<ol class='list-decimal ml-6'>";
                inOL = true;
            }
            html += `<li>${olMatch[1]}</li>`;
            continue;
        }

        // paragraph break
        if (line.trim() === "") {
            closeLists();
            closeBlockquote();
            html += "";
            continue;
        }

        // paragraph line
        closeLists();
        closeBlockquote();
        html += `<p>${line}</p>`;
    }

    closeLists();
    closeBlockquote();

    html = html.replace( // images
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="my-2">'
    );

    html = html.replace( // links
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-blue-400 hover:underline">$1</a>'
    );

    html = html.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); // bold
    html = html.replace(/\*(.+?)\*/g, "<i>$1</i>"); // italic
    html = html.replace(/~~(.+?)~~/g, "<del>$1</del>"); // strikethrough

    inlineCodes.forEach((code, i) => { // inline code
        html = html.replace(`%%INLINECODE_${i}%%`, code);
    });

    codeBlocks.forEach((block, i) => { // code blocks
        html = html.replace(`%%CODEBLOCK_${i}%%`, block);
    });

    document.getElementById("markdown-container").innerHTML = html;

    if (localStorage.getItem("mdtml.experimental.SyntaxHighlighting") === "true") {
        EnableSyntaxHighlighting();
    }
}

function EnableSyntaxHighlighting() {
    if (!document.querySelector("#markdown-container pre code")) return; // if no code blocks
    window.hljs.highlightAll();
}
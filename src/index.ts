import * as md from "./util/markdown"

// Event listener to start the whole shebang
document.addEventListener('DOMContentLoaded', function (_) {
    let elems = md.findAllMarkdownSections()
    elems = md.generateMarkdown(elems)
    md.replaceContentsWithMarkdown(elems)
})
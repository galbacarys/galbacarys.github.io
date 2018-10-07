import { Converter } from 'showdown';

let converter = new Converter()

class MarkdownSection {
    elemId: string
    text: string
    generatedHtml!: string
    targetClass: string

    constructor(elem: string, text: string, targetClass: string) {
        this.elemId = elem
        this.text = text.trim() // do some cleanup as the text comes in
        this.targetClass = targetClass
    }

    generateMarkdown() {
        this.generatedHtml = converter.makeHtml(this.text)
        console.log('generated markdown:')
        console.log(this.generatedHtml)
    }

    replace() {
        let elem = document.getElementById(this.elemId)
        if(!elem) { console.error('Looks like element ID ' + this.elemId + ' was not found. This is likely a bug.')}
        else {
            elem.innerHTML = this.generatedHtml
            elem.classList.remove(this.targetClass)
        }
    }
}

let classCounter = 0

/**
 * Generate a simple element id for each element containing Markdown.
 * 
 * This should dramatically simplify the building of HTML pages, since we can
 * simply concat each markdown document into its own div
 */
function generateRandomElemId(): string {
    classCounter += 1
    return 'md-' + String(classCounter)
}

/**
 * Create MarkdownSection objects for each section of Markdown text in the doc.
 * @param className the name of the class we're looking for. Optional.
 */
export function findAllMarkdownSections(className?: string): MarkdownSection[] {
    if (!className) { className = 'hidden-pregen' } // a convention set in styles.css
    let ret: MarkdownSection[] = []
    let elems = document.getElementsByClassName(className)
    for(let i = 0; i < elems.length; i++) {
        let el = elems.item(i)
        if(el) {
            let newClassName = generateRandomElemId()
            el.id = newClassName
            ret.push(new MarkdownSection(newClassName, el.innerHTML, className))
        }
        else {
            console.error('Looks like we got a spurious element lookup; id ' + String(i))
        }
    }
    return ret
}

/**
 * Generate Markdown for all sections in the document
 * @param elementList The list of MarkdownSections for this page
 */
export function generateMarkdown(elementList: MarkdownSection[]): MarkdownSection[] {
    return elementList.map(v => { v.generateMarkdown(); return v})
}

/**
 * Generate markdown for all page sections
 * @param elementList the list of MarkdownSectiosn for this page
 */
export function replaceContentsWithMarkdown(elementList: MarkdownSection[]) {
    elementList.forEach(ms => ms.replace())
}


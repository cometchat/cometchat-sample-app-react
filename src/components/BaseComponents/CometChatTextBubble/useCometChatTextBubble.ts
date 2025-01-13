import { CometChatTextFormatter } from "../../../formatters/CometChatFormatters/CometChatTextFormatter";
export const useCometChatTextBubble = (props: { textFormatters: Array<CometChatTextFormatter> }) => {
    const {
        textFormatters,
    } = props;

    /*
        This function is used to update the message element with the updated text.
        It accepts html element and a required message string and updates the component by appending that string.
    */
    const pasteHtml = (textElement: HTMLElement, text: string) => {
        try {
            let el = document.createElement("div");
            el.innerHTML = text;
            let frag = document.createDocumentFragment();
            const clonedNodes = Array.from(el.childNodes);
            clonedNodes.forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const span = document.createElement("span");
                    span.style.whiteSpace = "pre-wrap";
                    span.textContent = node.textContent ?? "";
                    frag.appendChild(span);
                }
                else if (node instanceof HTMLElement) {
                    frag.appendChild(node);
                }
            });
            textElement.textContent = "";
            textElement.appendChild(frag);

        } catch (error) {
            console.error(error);
        }
    };







    return {
        pasteHtml,
    }
}

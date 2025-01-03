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
            let frag = document.createDocumentFragment(),
                node,
                lastNode;
            while ((node = el.firstChild)) {
                if (node instanceof HTMLElement) {
                    if (textFormatters && textFormatters.length) {
                        for (let i = 0; i < textFormatters.length; i++) {
                            node = textFormatters[i].registerEventListeners(
                                node,
                                node.classList
                            );
                        }
                    }
                    frag.appendChild(node);
                }
                lastNode = frag.appendChild(node);
            }
            textElement!.textContent = "";

            textElement.appendChild(frag);
        } catch (error) {
            console.log(error);
        }
    }

    return {
        pasteHtml,
    }
}

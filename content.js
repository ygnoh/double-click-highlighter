const CLS = "__double-click-highlighter__";

chrome.runtime.onMessage.addListener(msg => {
    if (msg.name !== "loaded") {
        return;
    }

    document.addEventListener("dblclick", e => {
        const text = window.getSelection().toString().trim();
        const specialCharOrEmpty = /(?:\W|^$)/.test(text);

        if (specialCharOrEmpty) {
            return;
        }

        removeHighlight();
        highlight();
        selectTarget();

        function highlight() {
            // todo using cache improve performance
            Array.from(document.getElementsByTagName("span")).forEach(span => {
                for (const node of span.childNodes) {
                    const {nodeType, nodeValue} = node;

                    if (nodeType !== Node.TEXT_NODE ||
                        !new RegExp(`[^\\w\\s]*\\b${text}\\b[^\\w\\s]*`).test(nodeValue)) {
                        continue;
                    }

                    // todo what if it has many texts?
                    const idx = nodeValue.indexOf(text);

                    node.nodeValue = nodeValue.replace(text, "");

                    const restNode = node.splitText(idx);

                    span.insertBefore(createColored(), restNode);
                }
            });
        }

        function createColored() {
            const colored = document.createElement("span");

            colored.className = CLS;
            colored.style.backgroundColor = "yellow";
            colored.textContent = text;

            return colored;
        }

        function selectTarget() {
            const [node] = e.target.getElementsByClassName(CLS);
            const range = document.createRange();

            range.selectNode(node);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    });

    document.addEventListener("keydown", e => {
        if (e.key !== "Escape") {
            return;
        }

        window.getSelection().removeAllRanges();
        removeHighlight();
    });
});

function removeHighlight() {
    Array.from(document.getElementsByClassName(CLS)).forEach(el => {
        el.outerHTML = el.textContent;
    });
}


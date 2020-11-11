const CLS = "__double-click-highlighter__";

chrome.runtime.onMessage.addListener(msg => {
    if (msg.name !== "loaded") {
        return;
    }

    document.addEventListener("dblclick", highlight);

    document.addEventListener("keydown", e => {
        if (e.key !== "Escape") {
            return;
        }

        highlight(e);
    });

    function highlight(e) {
        const text = window.getSelection().toString();
        const specialChar = /\W/.test(text);

        if (specialChar) {
            return;
        }

        restoreElements();

        if (!text.trim()) {
            // esc
            return;
        }

        color();
        restoreSelection();

        function color() {
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

        function restoreSelection() {
            const [node] = e.target.getElementsByClassName(CLS);
            const range = document.createRange();

            range.selectNode(node);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    }
});

function restoreElements() {
    Array.from(document.getElementsByClassName(CLS)).forEach(el => {
        el.outerHTML = el.textContent;
    });
}


const CLS = "__double-click-highlighter__";

chrome.runtime.onMessage.addListener(msg => {
    if (msg.name !== "loaded") {
        return;
    }

    const spans = Array.from(document.getElementsByTagName("span"));

    document.addEventListener("dblclick", highlight);

    document.addEventListener("keydown", e => {
        if (e.key !== "Escape") {
            return;
        }

        highlight();
    });

    function highlight() {
        const text = window.getSelection().toString();
        const specialChar = /\W/.test(text);

        if (specialChar) {
            return;
        }

        restore();

        if (!text.trim()) {
            // esc
            return;
        }

        color();

        function color() {
            spans.forEach(span => {
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
    }
});

function restore() {
    Array.from(document.getElementsByClassName(CLS)).forEach(el => {
        el.outerHTML = el.textContent;
    });
}


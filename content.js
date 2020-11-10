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
                const {textContent} = span;

                if (!new RegExp(`[^\\w\\s]*\\b${text}\\b[^\\w\\s]*`).test(textContent)) {
                    return;
                }

                // todo what about using appendChild?
                span.innerHTML = textContent.replaceAll(
                    text,
                    `<span class="${CLS}" style="background-color: yellow;">${text}</span>`
                );
            });
        }
    }

    function restore() {
        Array.from(document.getElementsByClassName(CLS)).forEach(el => {
            el.outerHTML = el.textContent;
        });
    }
});

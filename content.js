const CLS = "__auto-highlight__";

chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.name !== "loaded") {
        return;
    }

    document.addEventListener("dblclick", replace);

    document.addEventListener("keydown", e => {
        if (e.key !== "Escape") {
            return;
        }

        replace();
    });

    function replace() {
        const text = window.getSelection().toString();

        if (!/\w/.test(text)) {
            return;
        }

        Array.from(document.getElementsByTagName("span")).forEach(el => {
            el.innerHTML = el.textContent.replaceAll(
                new RegExp(text, "g"),
                `<span class=${CLS} style="background-color: yellow;">${text}</span>`
            );
        });
    }
});

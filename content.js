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

        if (/\W/.test(text)) {
            return;
        }

        Array.from(document.getElementsByClassName(CLS)).forEach(el => {
            el.outerHTML = el.textContent;
        });

        Array.from(document.getElementsByTagName("span")).forEach(el => {
            if (!el.textContent.includes(text)) {
                return;
            }

            el.innerHTML = el.textContent.replaceAll(
                text,
                `<span class="${CLS}" style="background-color: yellow;">${text}</span>`
            );
        });
    }
});

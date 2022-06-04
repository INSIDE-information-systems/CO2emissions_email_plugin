document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('[data-locale]').forEach(elem => {
        elem.innerHTML = browser.i18n.getMessage(elem.dataset.locale)
    });
});
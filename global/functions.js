/**
 * Renvoie la longueur en octets d'une chaine de caractères
 * @param {String} str
 * @returns {Number}
 */
export function lengthInUtf8Bytes(str) {
    return (new TextEncoder().encode(str)).length;
}

/**
 * Renvoie un nombre formaté (octets, ko, Mo ...)
 * @param {Number} bytes
 * @param {Boolean} tooltip Afficher ou non une tooltip en HTML
 * @param {Number} decimals Nombre de chiffres après la virgule
 * @returns {String}
 */
export function formatBytes(bytes, tooltip = true, decimals = 2) {
    if (bytes === 0) return tooltip ? "0 <div class='tooltip tooltip-left'>o<span class='tooltiptext tooltiptext-left'>octet</span></div>" : "0 octet";
    if (bytes < 2) return parseFloat(bytes.toFixed(decimals)).toString().replace(".", ",") + tooltip ? " <div class='tooltip tooltip-left'>o<span class='tooltiptext tooltiptext-left'>octet</span></div>" : " octet";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [tooltip ? "<div class='tooltip tooltip-left'>o<span class='tooltiptext tooltiptext-left'>octets</span></div>" : "octets", 'ko', 'Mo', 'Go'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]).replace(".", ",");
}

/**
 * Renvoie un nombre formaté (g, kg, t ...)
 * @param {Number} size
 * @param {Number} decimals Nombre de chiffres après la virgule
 * @returns {String}
 */
export function formatGrammes(size, decimals = 1) {
    if (0.1 > size >= 0.001) return parseFloat(size.toFixed(Math.abs(Math.floor(Math.log10(size))))).toString().replace(".", ",") + " g";
    if (size < 2) return parseFloat(size.toFixed(decimals)).toString().replace(".", ",") + " g";

    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['g', 'kg', 't', 'Gg', 'Tg'];

    const i = Math.floor(Math.log(size) / Math.log(k));

    return (parseFloat((size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]).replace(".", ",");
}

/**
 * Renvoie un nombre formaté (m, km ...)
 * @param {Number} distance
 * @param {Number} decimals Nombre de chiffres après la virgule
 * @returns {String}
 */
export function formatDistance(distance, decimals = 1) {
    if (0.1 > distance >= 0.001) return parseFloat(distance.toFixed(Math.abs(Math.floor(Math.log10(distance))))).toString().replace(".", ",") + " m";
    if (distance < 2) return parseFloat(distance.toFixed(decimals)).toString().replace(".", ",") + " m";

    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['m', 'km', 'Mm', 'Gm', 'Tm'];

    const i = Math.floor(Math.log(distance) / Math.log(k));

    return (parseFloat((distance / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]).replace(".", ",");
}

/**
 * Renvoie un nombre formaté (min, h ...)
 * @param {Number} time
 * @param {Number} decimals Nombre de chiffres après la virgule
 * @returns {String}
 */
export function formatTime(time, decimals = 1) {
    if (0.1 > time >= 0.001) return parseFloat(time.toFixed(Math.abs(Math.floor(Math.log10(time))))).toString().replace(".", ",") + " min";
    if (time < 2) return parseFloat(time.toFixed(decimals)).toString().replace(".", ",") + " min";

    if (time < 1440) { // base 60
        const k = 60;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['min', 'h'];

        const i = Math.floor(Math.log(time) / Math.log(k));

        return (parseFloat((time / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]).replace(".", ",");
    }

    if (time >= 1440) { // base 24
        time = time / (60 * 24);
        return parseFloat(time.toFixed(decimals)).toString().replace(".", ",") + " j";
    }
}

/**
 * Affiche une erreur, utilisé dans les Promises
 * @param error
 */
export function onError(error) {
    console.log(`Error: ${error}`);
}

export const MO = 1048576;
/**
 * Ajoute la fonction format() (comme Python) dans JS
 * @returns {String}
 */
String.prototype.format = function () {
    var a = this;
    for (var k in arguments) a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
    return a
}

/**
 * Affiche une erreur, utilisé dans les Promises
 * @param error 
 */
function onError(error) {
    console.log(`Error: ${error}`);
}




/**
 * Renvoie la longueur en octets d'une chaine de caractères
 * @param {String} str 
 * @returns {Number}
 */
function lengthInUtf8Bytes(str) {
    return (new TextEncoder().encode(str)).length;
}

/**
 * Renvoie un nombre formaté (octets, ko, Mo ...)
 * @param {Number} bytes 
 * @param {bool} tooltip Afficher ou non une tooltip en HTML
 * @param {Number} decimals Nombre de chiffres après la virgule
 * @returns {String}
 */
function formatBytes(bytes, tooltip = true, decimals = 2) {
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
function formatGrammes(size, decimals = 1) {
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
function formatDistance(distance, decimals = 1) {
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
function formatTime(time, decimals = 1) {
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


const HEADER_SIZE = 800;
// Pour 1 Mo
const CO2 = 13; // en g/Mo
const CO2u = 6; // en g/Mo

const OIL = 3.34; // en g CO2e/g de pétrole
const CAR = 0.192; // en g CO2e/m
const TGV = 1.73e-3; // en g CO2e/m
const BULB = 0.0599 / 60; // en g CO2e/(W.min) (électricité)
const BULBW = 40; // en W
const BREATHING = 1.131; // en g CO2/min
const MO = 1048576;

let recipientsCount, totalSize, co2, petrole, voiture, tgv, ampoule, respiration; // variables globales

/**
     * Calcule l'impact d'un mail
     * @param {Object} tabInfo Information sur les onglets
     */
 async function calculate(tabInfo) {
    // Récupération des informations sur le mail
    var data = await messenger.compose.getComposeDetails(tabInfo[0].id);
    var attachments = await messenger.compose.listAttachments(tabInfo[0].id);

    // Rangement de chaque information dans une variable et calcul des différentes tailles en octets
    let messageBodySize = lengthInUtf8Bytes(data.isPlainText ? data.plainTextBody : data.body);
    let to = data.to;
    let cc = data.cc;
    let bcc = data.bcc;
    let subject = data.subject;
    recipientsCount = to.length + cc.length + bcc.length;
    let headerSize = HEADER_SIZE + lengthInUtf8Bytes(to.join(",") + cc.join(",") + subject);
    let attachmentsSize = attachments.reduce((acc, val) => acc + val.size, 0);
    totalSize = headerSize + messageBodySize + attachmentsSize;

    // Affichage des différentes tailles calculées
    document.getElementById("header-size").innerHTML = formatBytes(headerSize);
    document.getElementById("body-size").innerHTML = formatBytes(messageBodySize)
    document.getElementById("attachments-size").innerHTML = formatBytes(attachmentsSize);
    document.getElementById("size").innerHTML = formatBytes(totalSize);

    // Calcul des différentes équivalences
    co2 = recipientsCount === 0 ? totalSize * (CO2 + CO2u) / MO : totalSize * (CO2 + recipientsCount * CO2u) / MO;
    petrole = co2 / OIL;
    voiture = co2 / CAR;
    tgv = co2 / TGV;
    ampoule = co2 / (BULBW * BULB);
    respiration = co2 / BREATHING;

    // Affichage des équivalences
    document.getElementById("co2").innerHTML = formatGrammes(co2) + (recipientsCount === 0 ? "/<div class='tooltip tooltip-left'>dest.<span class='tooltiptext tooltiptext-left'>destinataire</span></div>" : "");
    document.getElementById("oil").innerHTML = formatGrammes(petrole) + (recipientsCount === 0 ? "/<div class='tooltip tooltip-left'>dest.<span class='tooltiptext tooltiptext-left'>destinataire</span></div>" : "");
    document.getElementById("car").innerHTML = formatDistance(voiture) + (recipientsCount === 0 ? "/<div class='tooltip tooltip-left'>dest.<span class='tooltiptext tooltiptext-left'>destinataire</span></div>" : "");
    document.getElementById("tgv").innerHTML = formatDistance(tgv) + (recipientsCount === 0 ? "/<div class='tooltip tooltip-left'>dest.<span class='tooltiptext tooltiptext-left'>destinataire</span></div>" : "");
    document.getElementById("bulbw").insertAdjacentHTML('beforeend', BULBW + " W");
    document.getElementById("bulb").innerHTML = formatTime(ampoule) + (recipientsCount === 0 ? "/<div class='tooltip tooltip-left'>dest.<span class='tooltiptext tooltiptext-left'>destinataire</span></div>" : "");
    document.getElementById("breathing").innerHTML = formatTime(respiration) + (recipientsCount === 0 ? "/<div class='tooltip tooltip-left'>dest.<span class='tooltiptext tooltiptext-left'>destinataire</span></div>" : "");

    // Paramétrage des boutons pour ajouter / supprimer la signature
    document.getElementById("addEqui").onclick = () => {addEquivalences(tabInfo[0].id)};
    document.getElementById("removeEqui").onclick = () => {removeEquivalences(tabInfo[0].id)};
}


const signature = "{0}D'après l'extension {1}, l'envoi de courriel de {2} à {3} destinataire{4} entraîne l'émission indirecte " +
"de {5} CO{6}e. Cela correspond à la consommation de {7} de pétrole, au parcours de {8} en voiture ou de {9} en TGV," +
"à l'utilisation d'une ampoule de {10} W pendant {11}, ou encore à la respiration d'un humain pendant {12}.{13}" +
"Source : base carbone® de l'ADEME (2021), ADEME (2011), Zhang et al. (2011).{14}"

/**
 * Ajoute une signature au mail
 * @param {Number} tab Identifiant de l'onglet du mail
 */
async function addEquivalences(tab) {
    // Récupération des infos du mail
    let details = await browser.compose.getComposeDetails(tab);

    if (details.isPlainText) { // Si message en plain text
        // Récupération texte du mail
        let body = details.plainTextBody;
        details.body = null;
    
        // Modification du texte
        body += signature.format(
            "\n\n", "Estimez votre CO₂ (https://addons.thunderbird.net/fr/thunderbird/addon/estimez-votre-co2/)",
            formatBytes(totalSize, false), recipientsCount == 0 ? 1 : recipientsCount, recipientsCount <= 1 ? "" : "s",
            formatGrammes(co2), "₂", formatGrammes(petrole), formatDistance(voiture),
            formatDistance(tgv), BULBW, formatTime(ampoule), formatTime(respiration), "\n", "");

        // Renvoi à l'éditeur
        details.plainTextBody = body;
        browser.compose.setComposeDetails(tab, details);
    } else { // Si message en HTML
        // Récupération texte du mail
        let body = details.body;
        details.plainTextBody = null;

        // Modification du texte
        body += signature.format(
            "<p><small>", "<a href=\"https://addons.thunderbird.net/fr/thunderbird/addon/estimez-votre-co2/\">Estimez votre CO<sub>2</sub></a>",
            formatBytes(totalSize, false), recipientsCount == 0 ? 1 : recipientsCount, recipientsCount <= 1 ? "" : "s",
            formatGrammes(co2), "<sub>2</sub>", formatGrammes(petrole), formatDistance(voiture), formatDistance(tgv), BULBW,
            formatTime(ampoule), formatTime(respiration), "<br>", "</small></p>");

        // Renvoi à l'éditeur
        details.body = body;
        browser.compose.setComposeDetails(tab, details);
    }
}


/**
 * Supprime une signature au mail
 * @param {Number} tab Identifiant de l'onglet du mail
 */
async function removeEquivalences(tab){
    // Récupération des infos du mail
    let details = await browser.compose.getComposeDetails(tab)
    if (details.isPlainText) { // Si message en plain text
        // Récupération texte du mail
        let body = details.plainTextBody;
        details.body = null;
        
        // Recherche du texte ajouté
        let indexStart = body.indexOf("\n\nD'après l'extension Estimez votre CO₂");
        if (indexStart == -1) return;

        let indexEnd = body.indexOf("Zhang et al. (2011).", indexStart) + 20;

        // Modification du texte
        let text = body.substring(indexStart, indexEnd);
        
        // Renvoi à l'éditeur
        details.plainTextBody = body.replace(text, '');
        browser.compose.setComposeDetails(tab, details);
    } else { // Si message en HTML
        // Récupération texte du mail
        let body = details.body;
        details.plainTextBody = null;

        // Recherche du texte ajouté
        let indexStart = body.indexOf("<p><small>D'après l'extension");
        if (indexStart == -1) return;
        let indexEnd = body.indexOf("(2011).</small></p>", indexStart) + 19;

        // Modification du texte
        let text = body.substring(indexStart, indexEnd);

        // Renvoi à l'éditeur
        details.body = body.replace(text, '');
        browser.compose.setComposeDetails(tab, details);
    }
}




// Lorsque le document est chargé
document.addEventListener("DOMContentLoaded", function () {
    // Lancement de la promesse pour obtenir les tabs
    browser.tabs.query({currentWindow: true})
        .then(calculate)
        .catch(onError);
});
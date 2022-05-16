import { formatBytes, formatDistance, formatGrammes, formatTime, lengthInUtf8Bytes, onError } from "../global/functions.js";

/**
 * Ajoute la fonction format() (comme Python) dans JS
 * @returns {String}
 */
String.prototype.format = function() {
    var a = this;
    for (var k in arguments) a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
    return a
}

const HEADER_SIZE = 800;
const MO = 1048576;

let recipientsCount, totalSize, co2, petrole, voiture, tgv, ampoule, respiration, BULBW; // variables globales

/**
 * Calcule l'impact d'un mail
 * @param {Object} tabInfo Information sur les onglets
 */
async function calculate(tabInfo) {
    // Récupération des valeurs des préférences si définies ; valeurs par défaut sinon
    var preferencesValues = await browser.storage.local.get(["CO2", "CO2u", "OIL", "CAR", "TGV", "BULB", "BULBW", "BREATHING"]);
    var CO2 = preferencesValues.CO2 ? parseFloat(preferencesValues.CO2) : 13; // en g/Mo
    var CO2u = preferencesValues.CO2u ? parseFloat(preferencesValues.CO2u) : 6; // en g/Mo
    var OIL = preferencesValues.OIL ? parseFloat(preferencesValues.OIL) : 3.34; // en g CO2e/g de pétrole
    var CAR = preferencesValues.CAR ? parseFloat(preferencesValues.CAR) : 0.192; // en g CO2e/m
    var TGV = preferencesValues.TGV ? parseFloat(preferencesValues.TGV) : 1.73e-3; // en g CO2e/m
    var BULB = preferencesValues.BULB ? parseFloat(preferencesValues.BULB) : 0.0599 / 60; // en g CO2e/(W.min) (électricité)
    BULBW = preferencesValues.BULBW ? parseFloat(preferencesValues.BULBW) : 40; // en W
    var BREATHING = preferencesValues.BREATHING ? parseFloat(preferencesValues.BREATHING) : 1.131; // en g CO2/min

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
    document.getElementById("addEqui").onclick = () => { addEquivalences(tabInfo[0].id) };
    document.getElementById("removeEqui").onclick = () => { removeEquivalences(tabInfo[0].id) };
    document.getElementById("openRecommendations").onclick = () => { openRecommendations() };

    // Affichage avertissement en cas de pièce jointe équivalente à 1 Mo
    var needsAttachmentWarning = recipientsCount === 0 ? (attachmentsSize / MO >= 1) : (attachmentsSize * recipientsCount / MO >= 1); // si pièce jointe grosse et/ou envoyée à trop de destinataires
    if (needsAttachmentWarning) {
        document.getElementById("attachmentWarning").innerHTML = '<img src="../images/warning-icon-red.png" alt="Warning icon" title="Warning" height="14px" /><span class="tooltiptext tooltiptext-left" style="width: 130px; margin-top: -25px;"><small>Pensez aux clés USB ou aux <a href="https://alt.framasoft.org/fr/framadrop">applications d\'envoi de fichiers</a> !</small></span>';
    }

    // Affichage avertissement en cas d'un grand nombre de destinataires
    var needsRecipientsWarning = recipientsCount >= 10; // si nombre de destinataires important
    if (needsRecipientsWarning) {
        document.getElementById("recipientsWarning").innerHTML = '<img src="../images/warning-icon-red.png" alt="Warning icon" title="Warning" height="14px" /><span class="tooltiptext tooltiptext-left" style="width: 190px; margin-top: -14px;"><small>Est-il nécessaire d\'envoyer ce courriel à autant d\'adresses ?</small></span>';
    }

    // Bouton des préférences
    document.getElementById("preferencesLink").onclick = () => { openPreferences() };
}


const signature = "{0}D'après l'extension {1}, l'envoi de courriel de {2} à {3} destinataire{4} entraîne l'émission indirecte " +
    "de {5} CO{6}e. Cela correspond à la consommation de {7} de pétrole, au parcours de {8} en voiture ou de {9} en TGV, " +
    "à l'utilisation d'une ampoule de {10} W pendant {11}, ou encore à la respiration d'un humain pendant {12}.{13}" +
    "Sources : base carbone® de l'ADEME (2017 à 2020), ADEME (2011), Zhang et al. (2011).{14}"

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
            formatBytes(totalSize, false), recipientsCount === 0 ? 1 : recipientsCount, recipientsCount <= 1 ? "" : "s",
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
            formatBytes(totalSize, false), recipientsCount === 0 ? 1 : recipientsCount, recipientsCount <= 1 ? "" : "s",
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
async function removeEquivalences(tab) {
    // Récupération des infos du mail
    let details = await browser.compose.getComposeDetails(tab)
    if (details.isPlainText) { // Si message en plain text
        // Récupération texte du mail
        let body = details.plainTextBody;
        details.body = null;

        // Recherche du texte ajouté
        let indexStart = body.indexOf("\n\nD'après l'extension Estimez votre CO₂");
        if (indexStart === -1) return;

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
        if (indexStart === -1) return;
        let indexEnd = body.indexOf("(2011).</small></p>", indexStart) + 19;

        // Modification du texte
        let text = body.substring(indexStart, indexEnd);

        // Renvoi à l'éditeur
        details.body = body.replace(text, '');
        browser.compose.setComposeDetails(tab, details);
    }
}

/**
 * Ouvre un onglet redirigeant vers des préconisations pour réduire son impact informatique
 */
function openRecommendations() {
    browser.tabs.create({
        url: "https://librairie.ademe.fr/cadic/4932/guide-pratique-face-cachee-numerique.pdf?modal=false"
    }).then(tab => {
        browser.windows.update(tab.windowId, {
            focused: true
        });
    });
}

/**
 * Ouvre l'onglet des préférences
 */
function openPreferences() {
    browser.tabs.create({
        url: "preferences/preferences.html"
    }).then(tab => {
        browser.windows.update(tab.windowId, {
            focused: true
        });
    });
}




// Lorsque le document est chargé
document.addEventListener("DOMContentLoaded", function() {
    // Lancement de la promesse pour obtenir les tabs
    browser.tabs.query({ currentWindow: true })
        .then(calculate)
        .catch(onError);
});
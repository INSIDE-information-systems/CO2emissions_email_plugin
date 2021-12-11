function docReady(fn) {
    document.addEventListener("DOMContentLoaded", fn);
}

docReady(function () {
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

    let tab;

    let recipientsCount, totalSize, co2, petrole, voiture, tgv, ampoule, respiration; // variables globales

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    function lengthInUtf8Bytes(str) {
        return (new TextEncoder().encode(str)).length;
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 <div class='tooltip tooltip-left'>o<span class='tooltiptext tooltiptext-left'>octet</span></div>";
        if (bytes < 2) return parseFloat(bytes.toFixed(decimals)).toString().replace(".", ",") + " <div class='tooltip tooltip-left'>o<span class='tooltiptext tooltiptext-left'>octet</span></div>";

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["<div class='tooltip tooltip-left'>o<span class='tooltiptext tooltiptext-left'>octets</span></div>", 'ko', 'Mo', 'Go'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return (parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]).replace(".", ",");
    }

    function formatGrammes(size, decimals = 1) {
        if (0.1 > size >= 0.001) return parseFloat(size.toFixed(Math.abs(Math.floor(Math.log10(size))))).toString().replace(".", ",") + " g";
        if (size < 2) return parseFloat(size.toFixed(decimals)).toString().replace(".", ",") + " g";

        const k = 1000;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['g', 'kg', 't', 'Gg', 'Tg'];

        const i = Math.floor(Math.log(size) / Math.log(k));

        return (parseFloat((size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]).replace(".", ",");
    }

    function formatDistance(distance, decimals = 1) {
        if (0.1 > distance >= 0.001) return parseFloat(distance.toFixed(Math.abs(Math.floor(Math.log10(distance))))).toString().replace(".", ",") + " m";
        if (distance < 2) return parseFloat(distance.toFixed(decimals)).toString().replace(".", ",") + " m";

        const k = 1000;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['m', 'km', 'Mm', 'Gm', 'Tm'];

        const i = Math.floor(Math.log(distance) / Math.log(k));

        return (parseFloat((distance / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]).replace(".", ",");
    }
    
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

    let gettingCurrent = browser.tabs.query({currentWindow: true});

    async function calculate(tabInfo) {
        tab = tabInfo;

        document.getElementById("demo").onclick = () => {addEquivalences(tabInfo[0].id)};

        var data = await messenger.compose.getComposeDetails(tabInfo[0].id);
        var attachments = await messenger.compose.listAttachments(tabInfo[0].id);

        let messageBodySize = lengthInUtf8Bytes(data.isPlainText ? data.plainTextBody : data.body);
        let to = data.to;
        let cc = data.cc;
        let bcc = data.bcc;
        let subject = data.subject;
        recipientsCount = to.length + cc.length + bcc.length;
        let headerSize = HEADER_SIZE + lengthInUtf8Bytes(to.join(",") + cc.join(",") + subject);
        let attachmentsSize = attachments.reduce((acc, val) => acc + val.size, 0);

        document.getElementById("header-size").innerHTML = formatBytes(headerSize);
        document.getElementById("body-size").innerHTML = formatBytes(messageBodySize)
        document.getElementById("attachments-size").innerHTML = formatBytes(attachmentsSize);

        totalSize = headerSize + messageBodySize + attachmentsSize;
        co2 = recipientsCount === 0 ? totalSize * (CO2 + CO2u) / MO : totalSize * (CO2 + recipientsCount * CO2u) / MO;
        petrole = co2 / OIL;
        voiture = co2 / CAR;
        tgv = co2 / TGV;
        ampoule = co2 / (BULBW * BULB);
        respiration = co2 / BREATHING;

        document.getElementById("size").innerHTML = formatBytes(totalSize);
        document.getElementById("co2").innerHTML = formatGrammes(co2) + (recipientsCount === 0 ? "/<div class='tooltip tooltip-left'>dest.<span class='tooltiptext tooltiptext-left'>destinataire</span></div>" : "");
        document.getElementById("oil").innerHTML = formatGrammes(petrole) + (recipientsCount === 0 ? "/<div class='tooltip tooltip-left'>dest.<span class='tooltiptext tooltiptext-left'>destinataire</span></div>" : "");
        document.getElementById("car").innerHTML = formatDistance(voiture) + (recipientsCount === 0 ? "/<div class='tooltip tooltip-left'>dest.<span class='tooltiptext tooltiptext-left'>destinataire</span></div>" : "");
        document.getElementById("tgv").innerHTML = formatDistance(tgv) + (recipientsCount === 0 ? "/<div class='tooltip tooltip-left'>dest.<span class='tooltiptext tooltiptext-left'>destinataire</span></div>" : "");
        document.getElementById("bulbw").insertAdjacentHTML('beforeend', BULBW + " W");
        document.getElementById("bulb").innerHTML = formatTime(ampoule) + (recipientsCount === 0 ? "/<div class='tooltip tooltip-left'>dest.<span class='tooltiptext tooltiptext-left'>destinataire</span></div>" : "");
        document.getElementById("breathing").innerHTML = formatTime(respiration) + (recipientsCount === 0 ? "/<div class='tooltip tooltip-left'>dest.<span class='tooltiptext tooltiptext-left'>destinataire</span></div>" : "");
    }

    gettingCurrent.then(calculate, onError);

    function addEquivalences(tab) {
        // Get the existing message.
        browser.compose.getComposeDetails(tab).then(details => {
            if (details.isPlainText) {
                // The message is being composed in plain text mode.
                let body = details.plainTextBody;
                details.body = null;
            
                // Make direct modifications to the message text, and send it back to the editor.
                body += "\n\nD'après l'extension Estimez votre CO₂ (https://addons.thunderbird.net/fr/thunderbird/addon/estimez-votre-co2/), l'envoi de ce courriel de " + formatBytes(totalSize) + " à " + recipientsCount + (recipientsCount===0 || recipientsCount===1 ? " destinataire" : " destinataires") + " entraîne l'émission indirecte de " + formatGrammes(co2) + " CO₂e. Cela correspond à la consommation de " + formatGrammes(petrole) + " de pétrole, au parcours de " + formatDistance(voiture) + " en voiture ou de " + formatDistance(tgv) + " en TGV, à l'utilisation d'une ampoule de " + BULBW + " W pendant " + formatTime(ampoule) + ", ou encore à la respiration d'un humain pendant " + formatTime(respiration) + ".\nSources : base carbone® de l'ADEME (2021), ADEME (2011), Zhang et al. (2011).";

                details.plainTextBody = body;
                browser.compose.setComposeDetails(tab, details);
            } else {
                // The message is being composed in HTML mode.
                let body = details.body;
                details.plainTextBody = null;
                
                // Make direct modifications to the message text, and send it back to the editor.
                body += "<br><br><small>D'après l'extension <a href=\"https://addons.thunderbird.net/fr/thunderbird/addon/estimez-votre-co2/\">Estimez votre CO<sub>2</sub></a>, l'envoi de ce courriel de " + formatBytes(totalSize) + " à " + (recipientsCount===0 ? 1 : recipientsCount) + (recipientsCount===0 || recipientsCount===1 ? " destinataire" : " destinataires") + " entraîne l'émission indirecte de " + formatGrammes(co2) + " CO<sub>2</sub>e. Cela correspond à la consommation de " + formatGrammes(petrole) + " de pétrole, au parcours de " + formatDistance(voiture) + " en voiture ou de " + formatDistance(tgv) + " en TGV, à l'utilisation d'une ampoule de " + BULBW + " W pendant " + formatTime(ampoule) + ", ou encore à la respiration d'un humain pendant " + formatTime(respiration) + ".<br>Sources : base carbone® de l'ADEME (2021), ADEME (2011), Zhang et al. (2011).</small>";
            
                details.body = body;
                browser.compose.setComposeDetails(tab, details);
            }
        });
    }
});
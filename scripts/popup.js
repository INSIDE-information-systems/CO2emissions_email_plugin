function docReady(fn) {
    document.addEventListener("DOMContentLoaded", fn);
}

docReady(function () {
    const HEADER_SIZE = 800;
    // Pour 1 Mo
    const CO2 = 19;
    const OIL = 6;
    const CAR = 182;
    const BULB = 25; // en min/Mo
    const MO = 1048576;

    let tab;

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

    function formatGrammes(size, decimals = 2) {
        if (size < 2) return parseFloat(size.toFixed(decimals)).toString().replace(".", ",") + " g";

        const k = 1000;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['g', 'kg', 't'];

        const i = Math.floor(Math.log(size) / Math.log(k));

        return (parseFloat((size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]).replace(".", ",");
    }

    function formatDistance(distance, decimals = 2) {
        if (distance < 2) return parseFloat(distance.toFixed(decimals)).toString().replace(".", ",") + " m";

        const k = 1000;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['m', 'km'];

        const i = Math.floor(Math.log(distance) / Math.log(k));

        return (parseFloat((distance / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]).replace(".", ",");
    }
    
    function formatTime(time, decimals = 2) {
        if (time < 2) return parseFloat(time.toFixed(decimals)).toString().replace(".", ",") + " min";

        const k = 60;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['min', 'h'];

        const i = Math.floor(Math.log(time) / Math.log(k));

        return (parseFloat((time / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]).replace(".", ",");
    }

    let gettingCurrent = browser.tabs.query({currentWindow: true});

    async function calculate(tabInfo) {
        tab = tabInfo;

        // console.log(tabInfo);
        var data = await messenger.compose.getComposeDetails(tabInfo[0].id);
        var attachments = await messenger.compose.listAttachments(tabInfo[0].id);

        let messageBodySize = lengthInUtf8Bytes(data.isPlainText ? data.plainTextBody : data.body);
        let to = data.to;
        let cc = data.cc;
        let bcc = data.bcc;
        let subject = data.subject;
        let recipentsCount = to.length + cc.length + bcc.length;
        let headerSize = HEADER_SIZE + lengthInUtf8Bytes(to.join(",") + cc.join(",") + subject);
        let attachmentsSize = attachments.reduce((acc, val) => acc + val.size, 0);

        document.getElementById("header-size").innerHTML = formatBytes(headerSize);
        document.getElementById("body-size").innerHTML = formatBytes(messageBodySize)
        document.getElementById("attachments-size").innerHTML = formatBytes(attachmentsSize);

        let totalSize = headerSize + messageBodySize + attachmentsSize;
        let sizeTimesRecipents = recipentsCount === 0 ? totalSize : totalSize * recipentsCount;
        let co2 = (sizeTimesRecipents * CO2) / MO;
        let petrole = (sizeTimesRecipents * OIL) / MO;
        let voiture = (sizeTimesRecipents * CAR) / MO;
        let ampoule = (sizeTimesRecipents * BULB) / MO;

        document.getElementById("size").innerHTML = formatBytes(totalSize);
        document.getElementById("co2").innerHTML = formatGrammes(co2) + (recipentsCount === 0 ? "/<div class='tooltip tooltip-left'>dest.<span class='tooltiptext tooltiptext-left'>destinataire</span></div>" : "");
        document.getElementById("oil").innerHTML = formatGrammes(petrole) + (recipentsCount === 0 ? "/<div class='tooltip tooltip-left'>dest.<span class='tooltiptext tooltiptext-left'>destinataire</span></div>" : "");
        document.getElementById("car").innerHTML = formatDistance(voiture) + (recipentsCount === 0 ? "/<div class='tooltip tooltip-left'>dest.<span class='tooltiptext tooltiptext-left'>destinataire</span></div>" : "");
        document.getElementById("bulb").innerHTML = formatTime(ampoule) + (recipentsCount === 0 ? "/<div class='tooltip tooltip-left'>dest.<span class='tooltiptext tooltiptext-left'>destinataire</span></div>" : "");
    }

    gettingCurrent.then(calculate, onError);

    // Bouton ajout signature
    // document.getElementById("addTo").addEventListener('click', e => { })
});
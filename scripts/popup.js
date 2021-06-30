function docReady(fn) {
    document.addEventListener("DOMContentLoaded", fn);
}

docReady(function () {
    const HEADER_SIZE = 800;
    // Pour 1 Mo
    const CO2 = 20;
    const OIL = 6;
    const CAR = 150;
    const MO = 1048576;

    let tab;

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    function lengthInUtf8Bytes(str) {
        return (new TextEncoder().encode(str)).length;
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 octet";
        if (bytes < 2) return bytes.toFixed(decimals) + ' octet';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['octets', 'ko', 'Mo', 'Go'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function formatGrammes(size, decimals = 2) {
        if (size < 2) return size.toFixed(decimals) + " g";

        const k = 1000;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['g', 'kg', 't'];

        const i = Math.floor(Math.log(size) / Math.log(k));

        return parseFloat((size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    let gettingCurrent = browser.tabs.query({currentWindow: true});

    async function calculate(tabInfo) {
        tab = tabInfo;

        // console.log(tabInfo);
        var data = await messenger.compose.getComposeDetails(tabInfo[0].id);
        var attachments = await messenger.compose.listAttachments(tabInfo[0].id);

        let messageBodySize = lengthInUtf8Bytes(data.body);
        let to = data.to;
        let cc = data.cc;
        let bcc = data.bcc;
        let subject = data.subject;
        let recipentsCount = to.length + cc.length + bcc.length;
        let headerSize = HEADER_SIZE + lengthInUtf8Bytes(to.join(",") + cc.join(",") + bcc.join(",") + subject);
        let attachmentsSize = attachments.reduce((acc, val) => acc + val.size, 0);

        document.getElementById("header-size").innerText = formatBytes(headerSize);
        document.getElementById("body-size").innerText = formatBytes(messageBodySize)
        document.getElementById("attachments-size").innerText = formatBytes(attachmentsSize);

        let totalSize = headerSize + messageBodySize + attachmentsSize;
        let sizeTimesRecipents = document.getElementById("check_values").checked ? totalSize * recipentsCount : totalSize;
        let co2 = (sizeTimesRecipents * CO2) / MO;
        let petrole = (sizeTimesRecipents * OIL) / MO;
        let voiture = (sizeTimesRecipents * CAR) / MO;

        document.getElementById("size").innerText = formatBytes(totalSize);
        document.getElementById("co2").innerText = formatGrammes(co2);
        document.getElementById("oil").innerText = formatGrammes(petrole);
        document.getElementById("car").innerText = voiture.toFixed(0) + " km";
    }

    gettingCurrent.then(calculate, onError);

    document.getElementById("check_values").addEventListener('change', () => {
        calculate(tab);
    });
});
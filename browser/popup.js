import { formatDistance, formatGrammes, formatTime, MO } from "../global/functions.js";

async function* listMessages(folder) {
    let page = await messenger.messages.list(folder);
    for (let message of page.messages) {
        yield message;
    }

    while (page.id) {
        page = await messenger.messages.continueList(page.id);
        for (let message of page.messages) {
            yield message;
        }
    }
}


let data = { accounts: [] };
let CO2, CO2u, OIL, CAR, TGV, BULB, BULBW, BREATHING;


function display() {
    // Obtention de la période sélectionnée
    const input_periodes = document.getElementsByName("periode");
    let periode;
    for (const input of input_periodes) {
        if (input.checked) periode = input.value;
    }

    let periode_title;
    switch (periode) {
        case "week":
            periode_title = "Analyse des 7 derniers jours";
            break;
        case "month":
            periode_title = "Analyse des 30 derniers jours";
            break;
        case "year":
            periode_title = "Analyse de l'année en cours";
            break;
        case "forever":
            periode_title = "Analyse depuis toujours";
            break;
    }

    // Obtention des mails sélectionnés
    const input_mails = document.getElementsByName("mails");
    let mails;
    for (const input of input_mails) {
        if (input.checked) mails = input.value;
    }

    let mails_title;
    switch (mails) {
        case "sent":
            mails_title = "les mails envoyés";
            break;
        case "received":
            mails_title = "les mails reçus";
            break;
        case "all":
            mails_title = "tous les mails";
            break;
    }

    document.getElementById("data_title").innerText = `${periode_title} sur ${mails_title}`;

    // Obtention de l'adresse sélectionnée
    const address = document.getElementById("address").value;
    let co2 = 0.0;
    console.log(data);
    data.accounts.forEach(account => {
        if (address === "all" || address === account.name)
            co2 += account.co2[mails][periode];
    });

    const petrole = co2 / OIL;
    const voiture = co2 / CAR;
    const tgv = co2 / TGV;
    const ampoule = co2 / (BULBW * BULB);
    const respiration = co2 / BREATHING;


    document.getElementById("co2").innerHTML = formatGrammes(co2);
    document.getElementById("oil").innerHTML = formatGrammes(petrole);
    document.getElementById("car").innerHTML = formatDistance(voiture);
    document.getElementById("tgv").innerHTML = formatDistance(tgv);
    document.getElementById("bulb").innerHTML = formatTime(ampoule);
    document.getElementById("breathing").innerHTML = formatTime(respiration);
}

async function calculate() {
    let preferencesValues = await browser.storage.local.get(["CO2", "CO2u", "OIL", "CAR", "TGV", "BULB", "BULBW", "BREATHING"]);
    CO2 = preferencesValues.CO2 ? parseFloat(preferencesValues.CO2) : 13; // en g/Mo
    CO2u = preferencesValues.CO2u ? parseFloat(preferencesValues.CO2u) : 6; // en g/Mo
    OIL = preferencesValues.OIL ? parseFloat(preferencesValues.OIL) : 3.34; // en g CO2e/g de pétrole
    CAR = preferencesValues.CAR ? parseFloat(preferencesValues.CAR) : 0.192; // en g CO2e/m
    TGV = preferencesValues.TGV ? parseFloat(preferencesValues.TGV) : 1.73e-3; // en g CO2e/m
    BULB = preferencesValues.BULB ? parseFloat(preferencesValues.BULB) : 0.0599 / 60; // en g CO2e/(W.min) (électricité)
    BULBW = preferencesValues.BULBW ? parseFloat(preferencesValues.BULBW) : 40; // en W
    document.getElementById("bulbw").insertAdjacentHTML('beforeend', BULBW + " W");
    BREATHING = preferencesValues.BREATHING ? parseFloat(preferencesValues.BREATHING) : 1.131; // en g CO2/min


    const accounts = await messenger.accounts.list();

    let now = new Date();
    let firstJanuary = new Date(now.getFullYear() + '-01-01T00:00:00');

    now = now.getTime();
    firstJanuary = now - firstJanuary.getTime();

    let diff, recipientsCount, co2value;

    for (const account of accounts) {
        let co2 = {
            sent: {
                week: 0,
                month: 0,
                year: 0,
                forever: 0
            },
            received: {
                week: 0,
                month: 0,
                year: 0,
                forever: 0
            }
        }
        for (const folder of account.folders) {
            const messages = listMessages(folder);
            if (folder.type === "sent") {
                for await (const message of messages) {
                    diff = now - message.date;
                    recipientsCount = message.recipients.length + message.ccList.length + message.bccList.length;
                    co2value = recipientsCount === 0 ? message.size * (CO2 + CO2u) / MO : message.size * (CO2 + recipientsCount * CO2u) / MO;

                    if (diff <= 604800000) { // 7 jours
                        co2.sent.week += co2value
                        co2.sent.month += co2value;
                    } else if (diff <= 2592000000) { // 30 jours
                        co2.sent.month += co2value;
                    }
                    if (diff <= firstJanuary) { // Année en cours
                        co2.sent.year += co2value;
                    }

                    co2.sent.forever += co2value;
                }
            } else {
                for await (const message of messages) {
                    diff = now - message.date;
                    recipientsCount = message.recipients.length + message.ccList.length + message.bccList.length;
                    co2value = recipientsCount === 0 ? message.size * (CO2 + CO2u) / MO : message.size * (CO2 + recipientsCount * CO2u) / MO;

                    if (diff <= 604800000) { // 7 jours
                        co2.received.week += co2value;
                        co2.received.month += co2value;
                    } else if (diff <= 2592000000) { // 30 jours
                        co2.received.month += co2value;
                    }
                    if (diff <= firstJanuary) { // Année en cours
                        co2.received.year += co2value;
                    }

                    co2.received.forever += co2value;
                }
            }
        }

        co2.all = {
            week: co2.sent.week + co2.received.week,
            month: co2.sent.month + co2.received.month,
            year: co2.sent.year + co2.received.year,
            forever: co2.sent.forever + co2.received.forever
        }
        data.accounts.push({
            name: account.name,
            co2: co2
        });
    }
    display();

    const inputs = document.getElementsByTagName("input")
    for (const input of inputs) {
        input.removeAttribute("disabled");
        input.addEventListener("change", display);
    }

    const select = document.getElementById("address");
    for (const account of accounts) {
        if (account.type !== "none") {
            const opt = document.createElement('option');
            opt.value = account.name;
            opt.innerText = account.name;
            select.appendChild(opt);
        }

    }
    document.getElementById("loading").hidden = true;
    document.getElementById("loader").hidden = true;
    select.removeAttribute("disabled");
    select.addEventListener("change", display)
}

// Lorsque le document est chargé
document.addEventListener("DOMContentLoaded", function() {
    calculate();
});
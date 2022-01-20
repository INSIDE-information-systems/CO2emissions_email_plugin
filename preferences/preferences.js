// Valeurs
function saveOptionsValues(e) {
    e.preventDefault();
    browser.storage.local.set({
        CO2: document.querySelector("#CO2").value,
        CO2u: document.querySelector("#CO2u").value,
        OIL: document.querySelector("#OIL").value,
        CAR: document.querySelector("#CAR").value,
        TGV: document.querySelector("#TGV").value,
        BULB: document.querySelector("#BULB").value,
        BULBW: document.querySelector("#BULBW").value,
        BREATHING: document.querySelector("#BREATHING").value
    });
}

function restoreOptionsValues() {

    function setCurrentChoice(result) {
        document.querySelector("#CO2").value = result.CO2 || document.getElementById("defaultCO2").innerHTML;
        document.querySelector("#CO2u").value = result.CO2u || document.getElementById("defaultCO2u").innerHTML;
        document.querySelector("#OIL").value = result.OIL || document.getElementById("defaultOIL").innerHTML;
        document.querySelector("#CAR").value = result.CAR || document.getElementById("defaultCAR").innerHTML;
        document.querySelector("#TGV").value = result.TGV || document.getElementById("defaultTGV").innerHTML;
        document.querySelector("#BULB").value = result.BULB || document.getElementById("defaultBULB").innerHTML;
        document.querySelector("#BULBW").value = result.BULBW || document.getElementById("defaultBULBW").innerHTML;
        document.querySelector("#BREATHING").value = result.BREATHING || document.getElementById("defaultBREATHING").innerHTML;
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let getting = browser.storage.local.get(["CO2", "CO2u", "OIL", "CAR", "TGV", "BULB", "BULBW", "BREATHING"]);
    getting.then(setCurrentChoice, onError);
}

function setDefaultOptionsValues() {
    document.querySelector("#CO2").value = document.getElementById("defaultCO2").innerHTML;
    document.querySelector("#CO2u").value = document.getElementById("defaultCO2u").innerHTML;
    document.querySelector("#OIL").value = document.getElementById("defaultOIL").innerHTML;
    document.querySelector("#CAR").value = document.getElementById("defaultCAR").innerHTML;
    document.querySelector("#TGV").value = document.getElementById("defaultTGV").innerHTML;
    document.querySelector("#BULB").value = document.getElementById("defaultBULB").innerHTML;
    document.querySelector("#BULBW").value = document.getElementById("defaultBULBW").innerHTML;
    document.querySelector("#BREATHING").value = document.getElementById("defaultBREATHING").innerHTML;
}

document.addEventListener("DOMContentLoaded", restoreOptionsValues);
document.querySelector("#valuesForm").addEventListener("submit", saveOptionsValues);
document.getElementById("defaultButton").onclick = () => { setDefaultOptionsValues() };
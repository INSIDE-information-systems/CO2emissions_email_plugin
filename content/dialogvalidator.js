function onLoad() {
    var infos = window.arguments[0].infos;
    document.getElementById("label-size-value").value = infos.sizes.size.toFixed(1) + " " + infos.extension.size;
    document.getElementById("label-co2-value").value = infos.sizes.gCO2.toFixed(0) + " " + infos.extensionValidator.gCO2;
    document.getElementById("label-oil-value").value = infos.sizes.gOil.toFixed(0) + " " + infos.extensionValidator.gOil;
    document.getElementById("label-wh-value").value = infos.sizes.wh.toFixed(0);
    document.getElementById("label-car-value").value = infos.sizes.mCar.toFixed(3) + " " + infos.extensionValidator.mCar;
    document.getElementById("label-bulb-value").value = infos.sizes.tBulb.toFixed(0) + " " + infos.extensionValidator.tBulb;
}

function doOK() {
    window.arguments[0].isConfirm = true;
    return true;
}

function doCancel() {
    window.arguments[0].isConfirm = false;
    return true;
}

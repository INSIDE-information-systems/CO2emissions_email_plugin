var AFBGlobals = {
  prefs: Components.classes["@mozilla.org/preferences-service;1"]
    .getService(Components.interfaces.nsIPrefService)
    .getBranch("extensions.estimate-your-CO2."),

  chromes: {
    preferences: "chrome://sqlitemanager/content/preferences.xul",
  },
  sizes: null,
  autosignature: null,
  observedPrefs: [
    "valueWh", "valueOil", "valueCO2",
    "valueCar", "valueBulb", "autosignature",
  ],

  // The size provide inside the prefs are in Mo 
  // and we need the size in Octet, thats why the division by 1 000 000
  init() {
    this.prefs.addObserver("", this, false);
    this.sizes = {
      wh: this.prefs.getIntPref('valueWh') / 1000000,
      gOil: this.prefs.getIntPref('valueOil') / 1000000,
      gCO2: this.prefs.getIntPref('valueCO2') / 1000000,
      mCar: this.prefs.getIntPref('valueCar') / 1000000,
      tBulb: this.prefs.getIntPref('valueBulb') / 1000000
    }
    this.autosignature = this.prefs.getBoolPref('autosignature');
  },
  observe(subject, topic, data) {
    if (topic != "nsPref:changed") {
      return;
    }

    switch (data) {
      case "valueWh":
        this.sizes.wh = this.prefs.getIntPref("valueWh") / 1000000;
        break;
      case "valueOil":
        this.sizes.gOil = this.prefs.getIntPref("valueOil") / 1000000;
        break;

      case "valueCO2":
        this.sizes.gCO2 = this.prefs.getIntPref("valueCO2") / 1000000;
        break;

      case "valueCar":
        this.sizes.mCar = this.prefs.getIntPref("valueCar") / 1000000;
        break;

      case "valueBulb":
        this.sizes.tBulb = this.prefs.getIntPref("valueBulb") / 1000000;
        break;
      case "autosignature":
        this.autosignature = this.prefs.getBoolPref("autosignature");
        break;
    }
  },


  cm_btnShowDashBoard() {
    mail3Pane = Components.classes["@mozilla.org/appshell/window-mediator;1"]
      .getService(Components.interfaces.nsIWindowMediator)
      .getMostRecentWindow("mail:3pane");
    var tabmail = mail3Pane.document.getElementById("tabmail");
    tabmail.openTab("chromeTab", {
      chromePage: "chrome://estimate-your-CO2/content/dashboard/dashboard.html"
    });
  },

  calc_conso(datasize) {
    var extension = {
      size: "Octets",
      wh: "Wh",
      gOil: "g de pétrole",
      gCO2: "g de CO2",
      mCar: "mètres parcourue en voiture",
      tBulb: "ms"
    };

    var extensionValidator = {
      gOil: "g",
      gCO2: "g",
      mCar: "mètres ",
      tBulb: "ms"
    };
    AFBGlobals.init();
    var sizes = {
      size: datasize,
      wh: datasize * AFBGlobals.sizes.wh,
      gOil: datasize * AFBGlobals.sizes.gOil,
      gCO2: datasize * AFBGlobals.sizes.gCO2,
      mCar: datasize * AFBGlobals.sizes.mCar,
      tBulb: datasize * AFBGlobals.sizes.tBulb
    }

    if (sizes.size > 1024) {
      sizes.size /= 1024;
      extension.size = "Ko";
      if (sizes.size > 1024) {
        sizes.size /= 1024;
        extension.size = "Mo";
      }
    }
    if (sizes.tBulb > 1000) {
      sizes.tBulb /= 1000;
      extension.tBulb = "sec";
      extensionValidator.tBulb = "secondes";
      if (sizes.tBulb > 60) {
        sizes.tBulb /= 60
        extension.tBulb = "min";
        extensionValidator.tBulb = "minutes";
        if (sizes.tBulb > 60) {
          sizes.tBulb /= 60;
          extension.tBulb = "h";
          extensionValidator.tBulb = "heures";
        }
      }
    }
    if (sizes.mCar > 1000) {
      sizes.mCar /= 1000;
      extension.mCar = "kilomètres parcourue en voiture"
      extensionValidator.mCar = "kilomètres";
    }

    return {
      sizes,
      extension, 
      extensionValidator
    }
  }
};
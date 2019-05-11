var data = getDataFromDB();
var timeFormat = "YYYY-MM-DD"
var avgsize;

function getDataFromDB() {
  AFBGlobals.init();
  var statement = afbDb.getAll();
  var statementDay = afbDb.getInterval('day');
  var statementWeek = afbDb.getInterval('week');
  var statementMonth = afbDb.getInterval('month');
  var statementYear = afbDb.getInterval('year');
  var infos = {
    labels: [],
    sizes: [],
    cars: [],
    bulbs: []
  }

  var infosInterval = {
    day: {},
    week: {},
    month: {},
    year: {}
  }

  statementDay.executeAsync({
    handleResult: function (aResultSet) {
      var row = aResultSet.getNextRow();
      var size = row.getResultByName('size');
      infosInterval.day = AFBGlobals.calc_conso(size);
      var pSize = document.getElementById('day-value');
      pSize.innerHTML =
        "<span style='color:green;font-weight: bold;'>Aujourd'hui</span>,\
         vous avez envoyé un total de <span style='font-weight: bold;'>" + infosInterval.day.sizes.size.toFixed(1) + " " + infosInterval.day.extension.size + "</span>" +
        " de données, équivalant à la consommation de <span style='font-weight: bold;'>" + infosInterval.day.sizes.gOil.toFixed(0) + " " + infosInterval.day.extension.gOil + "</span>" +
        ", ou <span style='font-weight: bold;'>" + infosInterval.day.sizes.wh.toFixed(0) + " " + infosInterval.day.extension.wh + "</span>" +
        ", l'émission de <span style='font-weight: bold;'>" + infosInterval.day.sizes.gCO2.toFixed(0) + " " + infosInterval.day.extension.gCO2 + "</span>" +
        ", une distance de <span style='font-weight: bold;'>" + 
          (infosInterval.day.extension.mCar === "mètres parcourue en voiture" ? infosInterval.day.sizes.mCar.toFixed(0) : infosInterval.day.sizes.mCar.toFixed(1)) + 
        " " + infosInterval.day.extension.mCar + "</span>" +
        " et une ampoule de <span style='font-weight: bold;'>10W</span> allumée pendant <span style='font-weight: bold;'>" +
        infosInterval.day.sizes.tBulb.toFixed(0) + infosInterval.day.extension.tBulb + "</span>.";
    },
    handleError: function (aError) {
      console.error("Error: " + aError.message);
    },

    handleCompletion: function (aReason) {
      if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED)
        console.error("Query canceled or aborted!");
    }
  });

  statementWeek.executeAsync({
    handleResult: function (aResultSet) {
      var row = aResultSet.getNextRow();
      var size = row.getResultByName('size');
      infosInterval.week = AFBGlobals.calc_conso(size);
      var pSize = document.getElementById('week-value');
      pSize.innerHTML =
        "<span style='color:green;font-weight: bold;'>Le cumul hebdomadaire</span>\
        est de <span style='font-weight: bold;'>" + infosInterval.week.sizes.size.toFixed(1) + " " + infosInterval.week.extension.size + "</span>" +
        ", équivalant à la consommation de <span style='font-weight: bold;'>" + infosInterval.week.sizes.gOil.toFixed(0) + " " + infosInterval.week.extension.gOil + "</span>" +
        ", ou <span style='font-weight: bold;'>" + infosInterval.week.sizes.wh.toFixed(0) + " " + infosInterval.week.extension.wh + "</span>" +
        ", l'émission de <span style='font-weight: bold;'>" + infosInterval.week.sizes.gCO2.toFixed(0) + " " + infosInterval.week.extension.gCO2 + "</span>" +
        ", une distance de <span style='font-weight: bold;'>" + 
          (infosInterval.week.extension.mCar === "mètres parcourue en voiture" ? infosInterval.week.sizes.mCar.toFixed(0) : infosInterval.week.sizes.mCar.toFixed(1)) + 
        " " + infosInterval.week.extension.mCar + "</span>" +
        " et une ampoule de <span style='font-weight: bold;'>10W</span> allumée pendant <span style='font-weight: bold;'>" +
        infosInterval.week.sizes.tBulb.toFixed(0) + " " + infosInterval.week.extension.tBulb + "</span>.";
    },
    handleError: function (aError) {
      console.error("Error: " + aError.message);
    },

    handleCompletion: function (aReason) {
      if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED)
        console.error("Query canceled or aborted!");
    }
  });

  statementMonth.executeAsync({
    handleResult: function (aResultSet) {
      var row = aResultSet.getNextRow();
      var size = row.getResultByName('size');
      infosInterval.month = AFBGlobals.calc_conso(size);
      var pSize = document.getElementById('month-value');
      pSize.innerHTML =
        "<span style='color:green;font-weight: bold;'>Le cumul mensuel</span> \
        est de <span style='font-weight: bold;'>" + infosInterval.month.sizes.size.toFixed(1) + " " + infosInterval.month.extension.size + "</span>" +
        ", équivalant à la consommation de <span style='font-weight: bold;'>" + infosInterval.month.sizes.gOil.toFixed(0) + " " + infosInterval.month.extension.gOil + "</span>" +
        ", ou <span style='font-weight: bold;'>" + infosInterval.month.sizes.wh.toFixed(0) + " " + infosInterval.month.extension.wh + "</span>" +
        ", l'émission de <span style='font-weight: bold;'>" + infosInterval.month.sizes.gCO2.toFixed(0) + " " + infosInterval.month.extension.gCO2 + "</span>" +
        ", une distance de <span style='font-weight: bold;'>" + 
          (infosInterval.month.extension.mCar === "mètres parcourue en voiture" ? infosInterval.month.sizes.mCar.toFixed(0) : infosInterval.month.sizes.mCar.toFixed(1)) + 
        " " + infosInterval.month.extension.mCar + "</span>" +
        " et une ampoule de <span style='font-weight: bold;'>10W</span> allumée pendant <span style='font-weight: bold;'>" +
        infosInterval.month.sizes.tBulb.toFixed(0) + " " + infosInterval.month.extension.tBulb + "</span>.";
    },
    handleError: function (aError) {
      console.error("Error: " + aError.message);
    },

    handleCompletion: function (aReason) {
      if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED)
        console.error("Query canceled or aborted!");
    }
  });

  statementYear.executeAsync({
    handleResult: function (aResultSet) {
      var row = aResultSet.getNextRow();
      var size = row.getResultByName('size');
      infosInterval.year = AFBGlobals.calc_conso(size);
      var pSize = document.getElementById('year-value');
      pSize.innerHTML =
        "<span style='color:green;font-weight: bold;'>Le cumul annuel</span> est de \
          est de <span style='font-weight: bold;'>" + infosInterval.year.sizes.size.toFixed(1) + " " + infosInterval.year.extension.size + "</span>" +

        ", équivalant à la consommation de <span style='font-weight: bold;'>" + infosInterval.year.sizes.gOil.toFixed(0) + " " + infosInterval.year.extension.gOil + "</span>" +
        ", ou <span style='font-weight: bold;'>" + infosInterval.year.sizes.wh.toFixed(0) + " " + infosInterval.year.extension.wh + "</span>" +
        ", l'émission de <span style='font-weight: bold;'>" + infosInterval.year.sizes.gCO2.toFixed(0) + " " + infosInterval.year.extension.gCO2 + "</span>" +
        ", une distance de <span style='font-weight: bold;'>" + 
          (infosInterval.year.extension.mCar === "mètres parcourue en voiture" ? infosInterval.year.sizes.mCar.toFixed(0) : infosInterval.year.sizes.mCar.toFixed(1)) + 
        " " + infosInterval.year.extension.mCar + "</span>" +
        " et une ampoule de <span style='font-weight: bold;'>10W</span> allumée pendant <span style='font-weight: bold;'>" +
        infosInterval.year.sizes.tBulb.toFixed(0) + " " + infosInterval.year.extension.tBulb + "</span>.";
    },
    handleError: function (aError) {
      console.error("Error: " + aError.message);
    },

    handleCompletion: function (aReason) {
      if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED)
        console.error("Query canceled or aborted!");
    }
  });

  statement.executeAsync({
    handleResult: function (aResultSet) {
      var row = aResultSet.getNextRow();
      var sizeday = row.getResultByName('sizeday');
      var sizeweek = row.getResultByName('sizeweek');
      var sizemonth = row.getResultByName('sizemonth');
      var sizeyear = row.getResultByName('sizeyear');
      setupDatatable(sizeday, sizeweek, sizemonth, sizeyear);
    },

    handleError: function (aError) {
      console.error("Error: " + aError.message);
    },

    handleCompletion: function (aReason) {
      if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED)
        console.error("Query canceled or aborted!");
    }
  });
}

function firstRowAndColRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  if (col === 0 && row === 0) {
    return;
  } else {
    td.style.fontWeight = 'bold';
    td.style.background = '#c9daf8';
    if (col === 0) {
      td.style.color = 'green';
    } else {
      td.style.color = 'black';
    }
  }
}

function rowsAndColsRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
  td.style.fontWeight = 'bold';
  if (row % 2 === 0) {
    td.style.background = '#efefef';
  } else {
    td.style.background = '#d9d9d9';
  }
}

function setupDatatable(sizeday, sizeweek, sizemonth, sizeyear) {
  globalDay = AFBGlobals.calc_conso(sizeday);
  globalWeek = AFBGlobals.calc_conso(sizeweek);
  globalMonth = AFBGlobals.calc_conso(sizemonth);
  globalYear = AFBGlobals.calc_conso(sizeyear);


  var data = [
    ['', 'Total de données\nenvoyées en Mo', 'Consommation de\npétrole en kg', 'Watt/heure', 'Emissions de CO2 en kg', ' Distance parcourue\nen voiture en km', ' Ampoule de 10 W :\nnombre d\'heures'],
    ['Aujourd\'hui',
      (sizeday / (1024 * 1024)).toFixed(1),
      globalDay.extensionValidator.gOil == "g" ? (globalDay.sizes.gOil / 1000).toFixed(3) : globalDay.sizes.gOil.toFixed(3),
      globalDay.sizes.wh.toFixed(0),
      globalDay.extensionValidator.gCO2 == "g" ? (globalDay.sizes.gCO2 / 1000).toFixed(3) : globalDay.sizes.gCO2.toFixed(3),
      globalDay.extensionValidator.mCar == "mètres" ? (globalDay.sizes.mCar / 1000).toFixed(3) : globalDay.sizes.mCar.toFixed(3),
      globalDay.extensionValidator.tBulb == "min" ? (globalDay.sizes.tBulb / 60).toFixed(3) : globalDay.sizes.tBulb.toFixed(0)
    ],
    ['Cette semaine',
      (sizeweek / (1024 * 1024)).toFixed(1),
      globalWeek.extensionValidator.gOil == "g" ? (globalWeek.sizes.gOil / 1000).toFixed(3) : globalWeek.sizes.gOil.toFixed(3),
      globalWeek.sizes.wh.toFixed(0),
      globalWeek.extensionValidator.gCO2 == "g" ? (globalWeek.sizes.gCO2 / 1000).toFixed(3) : globalWeek.sizes.gCO2.toFixed(3),
      globalWeek.extensionValidator.mCar === "mètres" ? (globalWeek.sizes.mCar / 1000).toFixed(3) : globalWeek.sizes.mCar.toFixed(3),
      globalWeek.extensionValidator.tBulb == "min" ? (globalWeek.sizes.tBulb / 60).toFixed(3) : globalWeek.sizes.tBulb.toFixed(0)
    ],
    ['Ce mois-ci',
      (sizemonth / (1024 * 1024)).toFixed(1),
      globalMonth.extensionValidator.gOil == "g" ? (globalMonth.sizes.gOil / 1000).toFixed(3) : globalMonth.sizes.gOil.toFixed(3),
      globalMonth.sizes.wh.toFixed(0),
      globalMonth.extensionValidator.gCO2 == "g" ? (globalMonth.sizes.gCO2 / 1000).toFixed(3) : globalMonth.sizes.gCO2.toFixed(3),
      globalMonth.extensionValidator.mCar === "mètres" ? (globalMonth.sizes.mCar / 1000).toFixed(3) : globalMonth.sizes.mCar.toFixed(3),
      globalMonth.extensionValidator.tBulb == "min" ? (globalMonth.sizes.tBulb / 60).toFixed(3) : globalMonth.sizes.tBulb.toFixed(0)
    ],
    ['Cette année',
      (sizeyear / (1024 * 1024)).toFixed(1),
      globalYear.extensionValidator.gOil == "g" ? (globalYear.sizes.gOil / 1000).toFixed(3) : globalYear.sizes.gOil.toFixed(3),
      globalYear.sizes.wh.toFixed(0),
      globalYear.extensionValidator.gCO2 == "g" ? (globalYear.sizes.gCO2 / 1000).toFixed(3) : globalYear.sizes.gCO2.toFixed(3),
      globalYear.extensionValidator.mCar === "mètres" ? (globalYear.sizes.mCar / 1000).toFixed(3) : globalYear.sizes.mCar.toFixed(3),
      globalYear.extensionValidator.tBulb == "min" ? (globalYear.sizes.tBulb / 60).toFixed(3) : globalYear.sizes.tBulb.toFixed(0)
    ]
  ];


  var container = document.getElementById('grid');
  if (!globalYear.sizes || globalYear.sizes.size === 0) {
    container = document.getElementById('content-body');
    container.innerHTML = "Envoyer un mail avec <span style='color:green;font-weight: bold;'>Estimate Your CO2</span> afin d'avoir accès au dashboard"
  } else {
    container.innerHTML = ""
    var hot = new Handsontable(container, {
      data: data,
      licenseKey: "non-commercial-and-evaluation",
      readOnly: true,
      cells: function (row, col) {
        var cellProperties = {};
        var data = this.instance.getData();

        if (row === 0 || data[row] && data[row][col] === 'readOnly') {
          cellProperties.readOnly = true; // make cell read-only if it is first row or the text reads 'readOnly'
        }
        if (row === 0) {
          cellProperties.renderer = firstRowAndColRenderer; // uses function directly
        } else {
          cellProperties.renderer = rowsAndColsRenderer;
          //   cellProperties.renderer = "negativeValueRenderer"; // uses lookup map
        }
        if (col === 0) {
          cellProperties.renderer = firstRowAndColRenderer; // uses function directly
        }
        return cellProperties;
      }
    });
  }
}
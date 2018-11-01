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
        " de données, équivalant à la consommation de <span style='font-weight: bold;'>" + infosInterval.day.sizes.gOil.toFixed(0) + infosInterval.day.extension.gOil + "</span>" +
        " , ou <span style='font-weight: bold;'>" + infosInterval.day.sizes.wh.toFixed(0) + " " + infosInterval.day.extension.wh + " </span>" +
        ", l'émission de <span style='font-weight: bold;'>" + infosInterval.day.sizes.gCO2.toFixed(0) + infosInterval.day.extension.gCO2 + "</span>" +
        ", une distance de <span style='font-weight: bold;'>" + infosInterval.day.sizes.mCar.toFixed(0) + " " + infosInterval.day.extension.mCar + "</span>" +
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
        "<span style='color:green;font-weight: bold;'>Le cumul hebdomadaire</span> est de \
         <span style='font-weight: bold;'>" + infosInterval.week.sizes.gOil.toFixed(0) + infosInterval.week.extension.gOil + "</span>" +
        " , ou <span style='font-weight: bold;'>" + infosInterval.week.sizes.wh.toFixed(0) + " " + infosInterval.week.extension.wh + " </span>" +
        ", l'émission de <span style='font-weight: bold;'>" + infosInterval.week.sizes.gCO2.toFixed(0) + infosInterval.week.extension.gCO2 + "</span>" +
        ", une distance de <span style='font-weight: bold;'>" + infosInterval.week.sizes.mCar.toFixed(0) + " " + infosInterval.week.extension.mCar + "</span>" +
        " et une ampoule de <span style='font-weight: bold;'>10W</span> allumée pendant <span style='font-weight: bold;'>" +
        infosInterval.week.sizes.tBulb.toFixed(0) + infosInterval.week.extension.tBulb + "</span>.";
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
        "<span style='color:green;font-weight: bold;'>Le cumul mensuel</span> est de \
         <span style='font-weight: bold;'>" + infosInterval.month.sizes.gOil.toFixed(0) + infosInterval.month.extension.gOil + "</span>" +
        " , ou <span style='font-weight: bold;'>" + infosInterval.month.sizes.wh.toFixed(0) + " " + infosInterval.month.extension.wh + " </span>" +
        ", l'émission de <span style='font-weight: bold;'>" + infosInterval.month.sizes.gCO2.toFixed(0) + infosInterval.month.extension.gCO2 + "</span>" +
        ", une distance de <span style='font-weight: bold;'>" + infosInterval.month.sizes.mCar.toFixed(0) + " " + infosInterval.month.extension.mCar + "</span>" +
        " et une ampoule de <span style='font-weight: bold;'>10W</span> allumée pendant <span style='font-weight: bold;'>" +
        infosInterval.month.sizes.tBulb.toFixed(0) + infosInterval.month.extension.tBulb + "</span>.";
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
         <span style='font-weight: bold;'>" + infosInterval.year.sizes.gOil.toFixed(0) + infosInterval.year.extension.gOil + "</span>" +
        " , ou <span style='font-weight: bold;'>" + infosInterval.year.sizes.wh.toFixed(0) + " " + infosInterval.year.extension.wh + " </span>" +
        ", l'émission de <span style='font-weight: bold;'>" + infosInterval.year.sizes.gCO2.toFixed(0) + infosInterval.year.extension.gCO2 + "</span>" +
        ", une distance de <span style='font-weight: bold;'>" + infosInterval.year.sizes.mCar.toFixed(0) + " " + infosInterval.year.extension.mCar + "</span>" +
        " et une ampoule de <span style='font-weight: bold;'>10W</span> allumée pendant <span style='font-weight: bold;'>" +
        infosInterval.year.sizes.tBulb.toFixed(0) + infosInterval.year.extension.tBulb + "</span>.";
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
      var iteration = 0;
      var globalSize = [];
      for (var row = aResultSet.getNextRow(); row; row = aResultSet.getNextRow(), iteration++) {
        infos.labels.push(moment(row.getResultByName("senddate")).format(timeFormat));
        size = row.getResultByName("size")
        globalSize.push(size / 1000000);
        infos.sizes.push((size / 1000000).toFixed(1));
        infos.cars.push(((size * AFBGlobals.sizes.mCar) / 1000).toFixed(1));
        infos.bulbs.push(((size * AFBGlobals.sizes.tBulb) / (1000 * 60 * 60)).toFixed(0));
      }
      infos.labels = infos.labels.reduce(function (a, b) {
        if (a.slice(-1)[0] !== b) a.push(b);
        return a;
      }, []);
      setupChart(infos);
      globalSum(globalSize);
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


function globalSum(data) {
  var pCar = document.getElementById('car-value');
  var pBulb = document.getElementById('bulb-value');
  var size = data.reduce(function (pv, cv) {
    return pv + cv;
  }, 0);
  var car = ((size * 1000000) * AFBGlobals.sizes.mCar) / 1000;
  var bulb = (((size * 1000000) * AFBGlobals.sizes.tBulb) / (1000 * 60 * 60));
  pCar.innerHTML = car.toFixed(1) + " Km";
  pBulb.innerHTML = bulb.toFixed(0) + " H";
}

function setupChart(data) {
  var ctx = document.getElementById('chart').getContext('2d');

  var chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Distance parcouru en voiture en Km",
          backgroundColor: 'rgb(38, 65, 174)',
          borderColor: 'rgb(23, 2, 78)',
          data: data.cars
        },
        {
          label: "Taille en Mo",
          backgroundColor: 'rgb(0, 124, 33)',
          borderColor: 'rgb(0, 85, 22)',
          data: data.sizes,
        },
        {
          label: "Durée d'une ampoule 10Wh en heure",
          backgroundColor: 'rgb(255, 211, 65)',
          borderColor: 'rgb(114, 109, 0)',
          data: data.bulbs
        },

      ]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: "Impact global des mails envoyés"
      },
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true
        }]
      }
    }
  });
}
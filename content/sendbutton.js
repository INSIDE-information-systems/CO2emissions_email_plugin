(function () {

  Components.utils.import("resource://gre/modules/Services.jsm")

  var afbCalculator = {
    insertText: function (text) {
      var editorElement = window.parent.document.getElementById("content-frame");
      if (editorElement.editortype === "htmlmail") {
        var htmlEditor = editorElement.getHTMLEditor(editorElement.contentWindow);
        htmlEditor.beginTransaction();
        htmlEditor.endOfDocument();
        htmlEditor.insertHTML(text);
        htmlEditor.endTransaction();
      } else {
        var textEditor = editorElement.getEditor(editorElement.contentWindow).QueryInterface(Components.interfaces.nsIPlaintextEditor);
        textEditor.beginTransaction();
        textEditor.endOfDocument();
        textEditor.insertText(text);
        textEditor.endTransaction();
      }
    },

    count_string(str) {
      var count = 0;
      for (var i = 0; i < str.length; i++) {
        if (escape(str.charAt(i)).length < 4) {
          count++;
        } else {
          count += 2;
        }
      }
      return count;
    },
    
    getNumberOfRecipients() {
      gMsgCompose.expandMailingLists();
      var aMsgCompFields = gMsgCompose.compFields;
      Recipients2CompFields(aMsgCompFields)
      var recipientCount = 0;
      for (let type of ["to", "cc", "bcc"]) {
        let recipients = aMsgCompFields.splitRecipients(aMsgCompFields[type], false, {});
        recipientCount += recipients.length;
      }
      CompFields2Recipients(aMsgCompFields);

      return recipientCount;
    },

    form_datasize(sizes, extension) {
      var textformat = "<span style='font-style: italic;font-weight: bold;'>Le plugin <span style='color:green;'>Estimate_your_CO2</span> a calculé que l'envoi de cet email de "
      + sizes.size.toFixed(1) + " " + extension.size + " équivaut à :</span><br>";
      
      textformat += "- la consommation de <span style='font-weight: bold;'>" + sizes.gOil.toFixed(0) + " " + extension.gOil
      + "</span> , ou <span style='font-weight: bold;'>" + sizes.wh.toFixed(0) + extension.wh + "</span><br>";
      
      textformat += "- l'émission de <span style='font-weight: bold;'>" + sizes.gCO2.toFixed(0) + " "+ extension.gCO2 + "</span><br>";
      textformat += "- une distance de <span style='font-weight: bold;'>" + sizes.mCar.toFixed(0) + " " + extension.mCar + "</span><br>";
      textformat += "- une ampoule de 10W allumée pendant <span style='font-weight: bold;'>" + sizes.tBulb.toFixed(0) + extension.tBulb + ".</span><br>";
      textformat += "<span style='font-style: italic; color:grey; font-size:85%;'>Installez vous aussi <span style='color:green;'>Estimate_your_CO2</span> pour Thunderbird pour évaluer l'impact environnemental de vos envois mail. <br>\
      Plus d'info sur <a href='https://www.afbiodiversite.fr/estimate_your_CO2'>https://www.afbiodiversite.fr/estimate_your_CO2</a></span>";
      return textformat;
    },


    getSizeOfEmail: function () {
      var editor = window.gMsgCompose.editor;

      var email = editor.outputToString('text/plain', editor.eNone);
      var subject = gMsgSubjectElement.value;
      var numberRecipients = this.getNumberOfRecipients();

      var size = this.count_string(email);
      size += this.count_string(subject);
      size += gAttachmentsSize;
      size *= numberRecipients;
      return size;
    }
  }

  var controller = {
    commands: {
      cmd_sendAndAfb: {
        isEnabled: function () {
          return defaultController.isCommandEnabled("cmd_sendNow");
        },
        doCommand: function () {
          var size = afbCalculator.getSizeOfEmail();
          var infos = AFBGlobals.calc_conso(size);

          if (AFBGlobals.autosignature) {
            afbCalculator.insertText(afbCalculator.form_datasize(infos.sizes, infos.extension));
          }
          afbDb.add(size);
          defaultController.doCommand("cmd_sendNow");
        }
      },

      cmd_confirmAfb: {
        isEnabled: function () {
          return defaultController.isCommandEnabled("cmd_sendNow");
        },
        doCommand: function () {
          var params = {};
          var infos = AFBGlobals.calc_conso(afbCalculator.getSizeOfEmail());
          params.infos = infos;
          params.isConfirm = null;
          window.openDialog(
            "chrome://estimate-your-CO2/content/dialogvalidator.xul",
            "confirm-dialog", "modal, centerscreen", params).focus();

          if (params.isConfirm) {
            controller.commands.cmd_sendAndAfb.doCommand();
          }
        }
      },
    },

    supportsCommand: function (aCommand) {
      return (aCommand in this.commands);
    },

    isCommandEnabled: function (aCommand) {
      if (!this.supportsCommand(aCommand))
        return false;
      return this.commands[aCommand].isEnabled();
    },

    doCommand: function (aCommand) {
      if (!this.supportsCommand(aCommand))
        return;
      var cmd = this.commands[aCommand];
      if (!cmd.isEnabled())
        return;
      cmd.doCommand();
    },

    onEvent: function (event) {},
  };

  var oldUpdateSendCommands = updateSendCommands;
  updateSendCommands = function () {
    oldUpdateSendCommands();
    goUpdateCommand("cmd_sendAndAfb");
    goUpdateCommand("cmd_confirmAfb");
  };

  window.addEventListener("load", function () {
    afbDb.createTable();
    top.controllers.appendController(controller);
  });

})();
/**
 * Affiche une erreur, utilisé dans les Promises
 * @param error 
 */
function onError(error) {
    console.log(`Error: ${error}`);
}

let reminders = []; // Liste de recommandations
for (let i = 1; i <= 12; i++) {
    reminders.push(browser.i18n.getMessage(`reminder${i}`));
}

/**
 * Envoie une notification de préconisation
 */
function regularReminder() {
    var today = new Date();
    if (today.getDate() === 7 || today.getDate() === 21) { // rappel deux fois par mois
        let promise = browser.storage.local.get("friendlyReminderDate"); // pour voir si la notification a déjà été envoyée aujourd'hui
        promise.then((promise) => {
            if (today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() !== promise.friendlyReminderDate) { // si la date n'existe pas déjà, c'est-à-dire que l'utilisateur ne s'est déjà connecté aujourd'hui
                browser.storage.local.set({
                    friendlyReminderDate: today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
                });

                title = browser.i18n.getMessage("reminderTitle"); // titre de la notification

                var reminderChoice = Math.floor(Math.random() * reminders.length); // entier au hasard entre 0 et le nombre de reminders - 1
                content = reminders[reminderChoice]; // recommandation au hasard

                var notificationId = "friendlyReminder";
                browser.notifications.create(notificationId, { // création de la notification
                    "type": "basic",
                    "title": title,
                    "message": content
                });

                browser.notifications.onClicked.addListener(function() { // rendre la notification cliquable pour ouvrir les recommandations
                    openRecommendations();
                });
            }
        }, onError);
    }
}

/**
 * Ouvre un onglet redirigeant vers des préconisations pour réduire son impact informatique
 */
function openRecommendations() {
    browser.tabs.create({
        url: "https://librairie.ademe.fr/cadic/2351/guide-pratique-face-cachee-numerique.pdf?modal=false"
    });
}




// Lorsque le document est chargé
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(regularReminder, 5000); // attend 5 secondes avant d'exécuter regularReminder()
});
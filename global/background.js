/**
 * Affiche une erreur, utilisé dans les Promises
 * @param error 
 */
function onError(error) {
    console.log(`Error: ${error}`);
}

const reminders = [ // Liste de recommandations
    "N'oubliez pas de supprimer régulièrement vos courriels, notamment ceux contenant des pièces jointes.",
    "Pensez à utiliser des clés USB ou des outils de dépôt de gros fichiers au lieu de les transmettre par courriel.",
    "Évitez de remplacer vos équipements numériques sur un coup de tête ou suite à une offre promotionnelle.",
    "Privilégiez la réparation au remplacement en cas de panne.",
    "Privilégiez le don ou l'échange au remplacement.",
    "Pensez à éteindre les appareils si vous ne les utilisez pas au lieu de les mettre en veille.",
    "Limitez le nombre de destinataires lors de l'envoi de courriels.",
    "Imprimez seulement ce qui est utile et lorsque c'est nécessaire.",
    "Ne conservez pas vos anciens appareils électroniques ; rapportez-les chez un revendeur.",
    "Désinscrivez-vous des listes de diffusion qui ne vous intéressent plus.",
    "Ne conservez en ligne et sur vos équipements que ce qui vous est utile.",
    "Optimisez la taille des fichiers que vous transmettez en s'aidant des fichiers compressés et en basse définition."
];

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

                title = "Estimez votre CO₂ — Rappel amical bimensuel"; // titre de la notification

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
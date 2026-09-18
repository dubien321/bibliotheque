document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('adherentForm');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const adherentId = params.get('id');

    if (!adherentId) {
        afficherErreur('ID adhérent manquant dans l\'URL.');
        return;
    }

    chargerAdherent(adherentId);
    form.addEventListener('submit', soumettreFormulaire);
});

async function chargerAdherent(id) {
    try {
        const adherent = await AdherentsAPI.getById(id);
        document.getElementById('nom_adherent').value = adherent.nom_adherent || '';
        document.getElementById('contact').value = adherent.contact || '';
    } catch (error) {
        afficherErreur('Impossible de charger l\'adhérent : ' + error.message);
    }
}

async function soumettreFormulaire(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const params = new URLSearchParams(window.location.search);
    const adherentId = params.get('id');

    const payload = {
        nom_adherent: form.nom_adherent.value.trim(),
        contact: form.contact.value.trim()
    };

    try {
        await AdherentsAPI.update(adherentId, payload);
        afficherMessage('Adhérent modifié avec succès !');
        setTimeout(() => window.location.href = '/pages/adherents/adherent.html', 700);
    } catch (error) {
        afficherErreur(error.message);
    }
}

function afficherErreur(message) {
    const errorDiv = document.getElementById('formError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function afficherMessage(message) {
    const errorDiv = document.getElementById('formError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.style.color = '#16794a';
}

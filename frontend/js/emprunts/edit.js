document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('empruntForm');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const empruntId = params.get('id');

    if (!empruntId) {
        afficherErreur('ID de l\'emprunt manquant dans l\'URL.');
        return;
    }

    chargerEmprunt(empruntId);
    form.addEventListener('submit', soumettreFormulaire);
});

async function chargerEmprunt(id) {
    try {
        const emprunt = await EmpruntsAPI.getById(id);
        document.getElementById('date_retour_reelle').value = emprunt.date_retour_reelle || '';
        document.getElementById('statut').value = emprunt.statut || 'en_cours';
    } catch (error) {
        afficherErreur('Impossible de charger l\'emprunt : ' + error.message);
    }
}

async function soumettreFormulaire(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const params = new URLSearchParams(window.location.search);
    const empruntId = params.get('id');

    const payload = {
        date_retour_reelle: form.date_retour_reelle.value || null,
        statut: form.statut.value
    };

    try {
        await EmpruntsAPI.update(empruntId, payload);
        afficherMessage('Emprunt mis à jour avec succès !');
        setTimeout(() => window.location.href = '/pages/emprunts/emprunt.html', 700);
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

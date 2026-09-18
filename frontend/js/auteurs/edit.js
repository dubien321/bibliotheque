document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('auteurForm');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const auteurId = params.get('id');

    if (!auteurId) {
        afficherErreur('ID auteur manquant dans l\'URL.');
        return;
    }

    chargerAuteur(auteurId);
    form.addEventListener('submit', soumettreFormulaire);
});

async function chargerAuteur(id) {
    try {
        const auteur = await AuteursAPI.getById(id);
        document.getElementById('nom').value = auteur.nom || '';
        document.getElementById('nationalite').value = auteur.nationalite || '';
    } catch (error) {
        afficherErreur('Impossible de charger l\'auteur : ' + error.message);
    }
}

async function soumettreFormulaire(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const params = new URLSearchParams(window.location.search);
    const auteurId = params.get('id');
    const payload = {
        nom: form.nom.value.trim(),
        nationalite: form.nationalite.value.trim()
    };

    try {
        await AuteursAPI.update(auteurId, payload);
        afficherMessage('Auteur modifié avec succès !');
        setTimeout(() => window.location.href = '/pages/auteurs/auteur.html', 700);
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

let modeEdition = false;
let auteurId = null;

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    auteurId = params.get('id');
    modeEdition = !!auteurId;

    if (modeEdition) {
        document.getElementById('formTitle').textContent = 'Modifier l\'Auteur';
        document.getElementById('formSubtitle').textContent = 'Mettre à jour les informations';
        await chargerauteur(auteurId);
    }

    const auteurForm = document.getElementById('auteurForm');
    if (!auteurForm) return;

    auteurForm.addEventListener('submit', soumettre);
});

async function chargerauteur(id) {
    try {
        const auteur = await AuteursAPI.getById(id);
        if (!auteur) return afficherErreur('Auteur introuvable');

        document.getElementById('nom').value = auteur.nom || '';
        document.getElementById('nationalite').value = auteur.nationalite || '';
    } catch (error) {
        afficherErreur('Impossible de charger l\'auteur : ' + error.message);
    }
}

async function soumettre(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = document.getElementById('submitBtn');

    const data = {
        nom: form.nom.value.trim(),
        nationalite: form.nationalite.value.trim(),
    };

    if (!data.nom || !data.nationalite) {
        return afficherErreur('Tous les champs sont obligatoires.');
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';

    try {
        if (modeEdition) {
            await AuteursAPI.update(auteurId, data);
            afficherMessage('Auteur modifié avec succès !');
        } else {
            await AuteursAPI.create(data);
            afficherMessage('Auteur créé avec succès !', "success");
        }
        setTimeout(() => window.location.href = '/pages/auteurs/auteur.html', 800);
    } catch (error) {
        afficherErreur(error.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Enregistrer';
    }
}

function afficherErreur(message) {
    const div = document.getElementById('formError');
    div.textContent = message;
    div.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function afficherMessage(message, type = 'success') {
    const messageDiv = document.getElementById('formError');
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    messageDiv.style.color = type === 'success' ? '#16794a' : '#b42318';
}
let modeEdition = false;
let livreId = null;

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    livreId = params.get('id');
    modeEdition = !!livreId;

    await chargerAuteurs();

    if (modeEdition) {
        await chargerLivre(livreId);
        document.getElementById('formTitle').textContent = 'Modifier le livre';
        document.getElementById('formSubtitle').textContent = 'Mettre à jour les informations';
    }

    document.getElementById('livreForm').addEventListener('submit', soumettreFormulaire);
});

async function chargerAuteurs() {
    try {
        const auteurs = await AuteursAPI.getAll();
        const select = document.getElementById('id_auteur');
        auteurs.forEach(auteur => {
            const option = document.createElement('option');
            option.value = auteur.id_auteur;
            option.textContent = auteur.nom;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur chargement auteurs :', error);
    }
}

async function chargerLivre(id) {
    try {
        const livre = await LivresAPI.getById(id);
        document.getElementById('titre').value = livre.titre || '';
        document.getElementById('id_auteur').value = livre.id_auteur || '';
        document.getElementById('date_publication').value = livre.date_publication || '';
    } catch (error) {
        afficherErreur('Impossible de charger le livre : ' + error.message);
    }
}

async function soumettreFormulaire(event) {
    event.preventDefault();
    const form = event.target;
    const errorDiv = document.getElementById('formError');
    errorDiv.style.display = 'none';

    const data = {
        titre: form.titre.value.trim(),
        id_auteur: parseInt(form.id_auteur.value),
        date_publication: form.date_publication.value ? parseInt(form.date_publication.value) : null,
    };

    try {
        if (modeEdition) {
            await LivresAPI.update(livreId, data);
            afficherMessage('Livre modifié avec succès !');
        } else {
            await LivresAPI.create(data);
            afficherMessage('Livre créé avec succès !');
        }
        setTimeout(() => window.location.href = '/pages/livres/livre.html', 1000);
    } catch (error) {
        afficherErreur(error.message);
        console.log('erreur', error);
    }
}

function afficherErreur(message) {
    const errorDiv = document.getElementById('formError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function afficherMessage(message, type = 'success') {
    const messageDiv = document.getElementById('formError');
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    messageDiv.style.color = type === 'success' ? '#16794a' : '#b42318';
}

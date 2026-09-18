let modeEdition = false;
let adherentId = null;

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    adherentId = params.get('id');
    modeEdition = !!adherentId;

    if (modeEdition) {
        document.getElementById('formTitle').textContent = 'Modifier l\'adhérent';
        document.getElementById('formSubtitle').textContent = 'Mettre à jour les informations';
        await chargerAdherent(adherentId);
    }

    document.getElementById('entityForm').addEventListener('submit', soumettre);
});

async function chargerAdherent(id) {
    try {
        const adherent = await AdherentsAPI.getById(id);
        if (!adherent) return afficherErreur('Adhérent introuvable');

        document.getElementById('nom_adherent').value = adherent.nom_adherent || '';
        document.getElementById('contact').value = adherent.contact || '';
    } catch (error) {
        afficherErreur('Impossible de charger l\'adhérent : ' + error.message);
    }
}

async function soumettre(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = document.getElementById('submitBtn');

    const data = {
        nom_adherent: form.nom_adherent.value.trim(),
        contact: form.contact.value.trim(),
    };

    if (!data.nom_adherent || !data.contact) {
        return afficherErreur('Tous les champs sont obligatoires.');
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';

    try {
        if (modeEdition) {
            await AdherentsAPI.update(adherentId, data);
            afficherMessage('Adhérent modifié avec succès !');
        } else {
            await AdherentsAPI.create(data);
            afficherMessage('Adhérent créé avec succès !', "success");
        }
        setTimeout(() => window.location.href = '/pages/adherents/adherent.html', 800);
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
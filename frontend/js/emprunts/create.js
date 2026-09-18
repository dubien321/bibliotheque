document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('empruntForm');
    if (!form) return;

    await chargerLivres();
    await chargerAdherents();

    const dateEmprunt = document.getElementById('date_emprunt');
    if (dateEmprunt && !dateEmprunt.value) {
        dateEmprunt.value = new Date().toISOString().slice(0, 10);
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const payload = {
            id_livre: Number(form.id_livre.value),
            id_adherent: Number(form.id_adherent.value),
            date_emprunt: form.date_emprunt.value || new Date().toISOString().slice(0, 10),
            date_retour_prevue: form.date_retour_prevue.value
        };

        try {
            await EmpruntsAPI.create(payload);
            afficherMessage('Emprunt créé avec succès !');
            setTimeout(() => window.location.href = '/pages/emprunts/emprunt.html', 800);
        } catch (error) {
            afficherErreur(error.message);
        }
    });
});

async function chargerLivres() {
    const select = document.getElementById('id_livre');
    if (!select) return;

    try {
        const livres = await LivresAPI.getAll();
        livres.forEach((livre) => {
            const option = document.createElement('option');
            option.value = livre.id_livre;
            option.textContent = `${livre.titre} (${livre.auteur_nom || 'Auteur inconnu'})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des livres', error);
    }
}

async function chargerAdherents() {
    const select = document.getElementById('id_adherent');
    if (!select) return;

    try {
        const adherents = await AdherentsAPI.getAll();
        adherents.forEach((adherent) => {
            const option = document.createElement('option');
            option.value = adherent.id_adherent;
            option.textContent = adherent.nom_adherent;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des adhérents', error);
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
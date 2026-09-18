function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function afficherMessage(message, type = 'success') {
    const existing = document.getElementById('toast-message');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toast-message';
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    chargerAuteurs();
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => chargerAuteurs(e.target.value));
    }
});

async function chargerAuteurs(search = '') {
    const tbody = document.getElementById('tableAuteur');
    if (!tbody) return;

    try {
        tbody.innerHTML = '<tr><td colspan="5" class="loading">Chargement...</td></tr>';
        const auteurs = await AuteursAPI.getAll(search);

        if (!auteurs || auteurs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">Aucun auteur trouvé.</td></tr>';
            return;
        }

        tbody.innerHTML = auteurs.map(auteur => `
            <tr>
                <td><strong>${escapeHtml(auteur.nom)}</strong></td>
                <td>${escapeHtml(auteur.nationalite || '—')}</td>
                <td style="text-align: right;">
                    <a href="/pages/auteurs/view.html?id=${auteur.id_auteur}" class="btn btn-secondary" title="Voir">
                        <i class="fas fa-eye"></i>
                    </a>
                    <a href="/pages/auteurs/edit.html?id=${auteur.id_auteur}" class="btn btn-secondary" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </a>
                    <button class="btn btn-danger" onclick="supprimerAuteur(${auteur.id_auteur})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="5" class="loading" style="color: #ef4444;">Erreur : ${error.message}</td></tr>`;
    }
}

async function supprimerAuteur(id) {
    if (!confirm('Voulez-vous vraiment supprimer ce auteur ?')) return;
    try {
        await AuteursAPI.delete(id);
        afficherMessage('Auteur supprimé avec succès !');
        chargerAuteurs();
    } catch (error) {
        afficherMessage(error.message, 'error');
    }
};

function ouvrirFormulaireAuteur(){
    
}
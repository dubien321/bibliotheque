// js/livre.js
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
    chargerLivres();
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => chargerLivres(e.target.value));
    }
});

async function chargerLivres(search = '') {
    const tbody = document.getElementById('tableLivres');
    if (!tbody) return;

    try {
        tbody.innerHTML = '<tr><td colspan="5" class="loading">Chargement...</td></tr>';
        const livres = await LivresAPI.getAll(search);

        if (!livres || livres.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">Aucun livre trouvé.</td></tr>';
            return;
        }

        tbody.innerHTML = livres.map(livre => `
            <tr>
                <td><strong>${escapeHtml(livre.titre)}</strong></td>
                <td>${escapeHtml(livre.auteur_nom || '—')}</td>
                <td>${livre.date_publication || '—'}</td>
                <td>
                    <span class="badge badge-${livre.statut === 'disponible' ? 'disponible' : 'emprunte'}">
                        ${livre.statut === 'disponible' ? 'Disponible' : 'Emprunté'}
                    </span>
                </td>
                <td style="text-align: right;">
                    <a href="/pages/livres/view.html?id=${livre.id_livre}" class="btn btn-secondary" title="Voir">
                        <i class="fas fa-eye"></i>
                    </a>
                    <a href="/pages/livres/edit.html?id=${livre.id_livre}" class="btn btn-secondary" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </a>
                    <button class="btn btn-danger" onclick="supprimerLivre(${livre.id_livre})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="5" class="loading" style="color: #ef4444;">Erreur : ${error.message}</td></tr>`;
    }
}

async function supprimerLivre(id) {
    if (!confirm('Voulez-vous vraiment supprimer ce livre ?')) return;
    try {
        await LivresAPI.delete(id);
        afficherMessage('Livre supprimé avec succès !');
        chargerLivres();
    } catch (error) {
        afficherMessage(error.message, 'error');
    }
}
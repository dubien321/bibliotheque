// js/livre-view.js
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        document.getElementById('detailContent').innerHTML = 
            '<div class="loading" style="color: #ef4444;">ID du livre manquant dans l\'URL.</div>';
        return;
    }

    try {
        const livre = await LivresAPI.getById(id);
        afficherDetails(livre);
    } catch (error) {
        document.getElementById('detailContent').innerHTML = 
            `<div class="loading" style="color: #ef4444;">Erreur : ${error.message}</div>`;
    }
});

function afficherDetails(livre) {
    document.getElementById('titreLivre').textContent = livre.titre;
    document.getElementById('btnEdit').href = `/pages/livres/edit.html?id=${livre.id_livre}`;

    const badgeClass = livre.statut === 'disponible' ? 'disponible' : 'emprunte';
    const badgeLabel = livre.statut === 'disponible' ? 'Disponible' : 'Emprunté';

    document.getElementById('detailContent').innerHTML = `
        <div class="detail-grid">
            <div class="detail-item">
                <span class="detail-label">Titre</span>
                <span class="detail-value">${escapeHtml(livre.titre)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Auteur</span>
                <span class="detail-value">${escapeHtml(livre.auteur_nom || '—')}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Année de publication</span>
                <span class="detail-value">${livre.date_publication || '—'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Statut</span>
                <span class="badge badge-${badgeClass}">${badgeLabel}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">ID</span>
                <span class="detail-value">#${livre.id_livre}</span>
            </div>
        </div>
    `;
}
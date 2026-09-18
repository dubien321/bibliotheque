document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        document.getElementById('detailContent').innerHTML =
            '<div class="loading" style="color: #ef4444;">ID de l\'emprunt manquant dans l\'URL.</div>';
        return;
    }

    try {
        const emprunt = await EmpruntsAPI.getById(id);
        afficherDetails(emprunt);
    } catch (error) {
        document.getElementById('detailContent').innerHTML =
            `<div class="loading" style="color: #ef4444;">Erreur : ${escapeHtml(error.message)}</div>`;
    }
});

function afficherDetails(emprunt) {
    document.getElementById('titreEmprunt').textContent = `Emprunt #${emprunt.id_emprunt}`;
    document.getElementById('btnEdit').href = `/pages/emprunts/edit.html?id=${emprunt.id_emprunt}`;

    const statut = emprunt.statut || 'en_cours';
    const libelleStatut = {
        en_cours: 'En cours',
        retard: 'Retard',
        rendu: 'Rendu'
    }[statut] || statut;

    document.getElementById('detailContent').innerHTML = `
        <div class="detail-grid">
            <div class="detail-item">
                <span class="detail-label">Livre</span>
                <span class="detail-value">${escapeHtml(emprunt.titre_livre || '—')}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Adhérent</span>
                <span class="detail-value">${escapeHtml(emprunt.nom_adherent || '—')}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Date d'emprunt</span>
                <span class="detail-value">${emprunt.date_emprunt ? new Date(emprunt.date_emprunt).toLocaleDateString('fr-FR') : '—'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Date de retour prévue</span>
                <span class="detail-value">${emprunt.date_retour_prevue ? new Date(emprunt.date_retour_prevue).toLocaleDateString('fr-FR') : '—'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Date de retour réelle</span>
                <span class="detail-value">${emprunt.date_retour_reelle ? new Date(emprunt.date_retour_reelle).toLocaleDateString('fr-FR') : '—'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Statut</span>
                <span class="badge badge-${statut === 'rendu' ? 'disponible' : statut === 'retard' ? 'emprunte' : 'disponible'}">${libelleStatut}</span>
            </div>
        </div>
    `;
}

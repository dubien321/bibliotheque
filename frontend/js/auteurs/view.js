document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        document.getElementById('detailContent').innerHTML =
            '<div class="loading" style="color: #ef4444;">ID de l\'auteur manquant dans l\'URL.</div>';
        return;
    }

    try {
        const auteur = await AuteursAPI.getById(id);
        afficherDetails(auteur);
    } catch (error) {
        document.getElementById('detailContent').innerHTML =
            `<div class="loading" style="color: #ef4444;">Erreur : ${escapeHtml(error.message)}</div>`;
    }
});

function afficherDetails(auteur) {
    document.getElementById('titreAuteur').textContent = auteur.nom;
    document.getElementById('btnEdit').href = `/pages/auteurs/edit.html?id=${auteur.id_auteur}`;

    document.getElementById('detailContent').innerHTML = `
        <div class="detail-grid">
            <div class="detail-item">
                <span class="detail-label">Nom</span>
                <span class="detail-value">${escapeHtml(auteur.nom || '—')}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Nationalité</span>
                <span class="detail-value">${escapeHtml(auteur.nationalite || '—')}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">ID</span>
                <span class="detail-value">#${auteur.id_auteur}</span>
            </div>
        </div>
    `;
}

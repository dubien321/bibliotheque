document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        document.getElementById('detailContent').innerHTML =
            '<div class="loading" style="color: #ef4444;">ID de l\'adhérent manquant dans l\'URL.</div>';
        return;
    }
    try {
        const adherent = await AdherentsAPI.getById(id);
        afficherDetails(adherent);

        await chargerHistorique(id);
    } catch (error) {
        document.getElementById('detailContent').innerHTML =
            `<div class="loading" style="color: #ef4444;">Erreur : ${escapeHtml(error.message)}</div>`;
    }
});

function afficherDetails(adherent) {
    document.getElementById('nomAdherent').textContent = adherent.nom_adherent;
    document.getElementById('contactAdherent').textContent = adherent.contact || '—';
    document.getElementById('btnEdit').href = `/pages/adherents/edit.html?id=${adherent.id_adherent}`;

    document.getElementById('detailContent').innerHTML = `
        <div class="detail-grid">
            <div class="detail-item">
                <span class="detail-label">Nom</span>
                <span class="detail-value">${escapeHtml(adherent.nom_adherent || '—')}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Contact</span>
                <span class="detail-value">${escapeHtml(adherent.contact || '—')}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">ID</span>
                <span class="detail-value">#${adherent.id_adherent}</span>
            </div>
        </div>
    `;
}



// js/adherent-view.js
// document.addEventListener('DOMContentLoaded', async () => {
//     const params = new URLSearchParams(window.location.search);
//     const id = params.get('id');

//     if (!id) {
//         document.getElementById('historiqueContainer').innerHTML = 
//             '<div class="loading" style="color: #ef4444;">ID manquant.</div>';
//         return;
//     }

//     try {
//         // Charger les infos de l'adhérent
//         const adherent = await AdherentsAPI.getById(id);
//         document.getElementById('nomAdherent').textContent = adherent.nom_adherent;
//         document.getElementById('contactAdherent').textContent = adherent.contact;
//         document.getElementById('btnEdit').href = `/pages/adherent-form.html?id=${id}`;

//         // Charger l'historique des emprunts
//         await chargerHistorique(id);
//     } catch (error) {
//         document.getElementById('historiqueContainer').innerHTML = 
//             `<div class="loading" style="color: #ef4444;">Erreur : ${error.message}</div>`;
//     }
// });

async function chargerHistorique(adherentId) {
    const container = document.getElementById('historiqueContainer');
    try {
        const historique = await AdherentsAPI.getHistorique(adherentId);

        if (!historique || historique.length === 0) {
            container.innerHTML = '<div class="loading">Aucun emprunt enregistré pour cet adhérent.</div>';
            return;
        }

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Livre</th>
                        <th>Date emprunt</th>
                        <th>Retour prévu</th>
                        <th>Retour effectif</th>
                        <th>Statut</th>
                        <th style="text-align: right;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${historique.map(emp => {
                        const statut = emp.statut_calcule;
                        const badgeClass = statut === 'retard' ? 'retard' : statut === 'rendu' ? 'disponible' : 'emprunte';
                        const badgeLabel = statut === 'retard' ? 'En retard' : statut === 'rendu' ? 'Rendu' : 'En cours';

                        const btnRetour = (statut === 'en_cours' || statut === 'retard')
                            ? `<button class="btn btn-success" onclick="retournerDepuisAdherent(${emp.id_emprunt}, ${adherentId})">
                                   <i class="fas fa-undo"></i> Retourner
                               </button>`
                            : `<span class="text-muted">—</span>`;

                        return `
                            <tr>
                                <td><strong>${escapeHtml(emp.titre_livre)}</strong></td>
                                <td>${formaterDate(emp.date_emprunt)}</td>
                                <td>${formaterDate(emp.date_retour_prevue)}</td>
                                <td>${emp.date_retour_reelle ? formaterDate(emp.date_retour_reelle) : '—'}</td>
                                <td><span class="badge badge-${badgeClass}">${badgeLabel}</span></td>
                                <td style="text-align: right;">${btnRetour}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        container.innerHTML = `<div class="loading" style="color: #ef4444;">Erreur : ${error.message}</div>`;
    }
}

async function retournerDepuisAdherent(empruntId, adherentId) {
    if (!confirm('Confirmer le retour de ce livre ?')) return;
    try {
        await EmpruntsAPI.retour(empruntId);
        afficherMessage('Livre retourné avec succès !');
        await chargerHistorique(adherentId);
    } catch (error) {
        afficherMessage(error.message, 'error');
    }
}

function formaterDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
}
document.addEventListener('DOMContentLoaded', chargerEmprunts);

async function chargerEmprunts() {
	const tbody = document.getElementById('tableEmprunt');
	if (!tbody) return;

	try {
		const emprunts = await EmpruntsAPI.getAll();
		if (!emprunts || emprunts.length === 0) {
			tbody.innerHTML = '<tr><td colspan="6" class="loading">Aucun emprunt trouvé.</td></tr>';
			return;
		}

		tbody.innerHTML = emprunts.map(emprunt => `
			<tr>
				<td>${new Date(emprunt.date_emprunt).toLocaleDateString('fr-FR')}</td>
				<td>${escapeHtml(emprunt.livre_titre || emprunt.id_livre)}</td>
				<td>${escapeHtml(emprunt.auteur_nom || '—')}</td>
				<td>${escapeHtml(emprunt.adherent_nom || '—')}</td>
				<td>${escapeHtml(emprunt.statut || emprunt.statut_calcule || 'en_cours')}</td>
				<td>
				<a href="/pages/emprunts/view.html?id=${emprunt.id_emprunt}" class="btn btn-secondary" title="Voir">
                        <i class="fas fa-eye"></i>
                    </a>
                    <a href="/pages/emprunts/edit.html?id=${emprunt.id_emprunt}" class="btn btn-secondary" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </a>
				</td>
				</tr>
		`).join('');
	} catch (error) {
		tbody.innerHTML = `<tr><td colspan="6" class="loading">Erreur : ${escapeHtml(error.message)}</td></tr>`;
	}
}

function escapeHtml(value) {
	return String(value ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}


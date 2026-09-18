document.addEventListener('DOMContentLoaded', chargerAdherents);

async function chargerAdherents() {
	const tbody = document.getElementById('tableAdherent');
	if (!tbody) return;

	try {
		const adherents = await AdherentsAPI.getAll();
		if (!adherents || adherents.length === 0) {
			tbody.innerHTML = '<tr><td colspan="3" class="loading">Aucun adhérent trouvé.</td></tr>';
			return;
		}

		tbody.innerHTML = adherents.map(adherent => `
			<tr>
				<td>${escapeHtml(adherent.nom_adherent)}</td>
				<td>${escapeHtml(adherent.contact)}</td>
				<td>
				<a href="/pages/adherents/view.html?id=${adherent.id_adherent}" class="btn btn-secondary" title="Voir">
                        <i class="fas fa-eye"></i>
                    </a>
                    <a href="/pages/adherents/edit.html?id=${adherent.id_adherent}" class="btn btn-secondary" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </a>
					<button class="btn btn-danger" onclick="supprimerAdherent(${adherent.id_adherent})"><i class="fas fa-trash"></i> </button>
				</td>
			</tr>
		`).join('');
	} catch (error) {
		tbody.innerHTML = `<tr><td colspan="3" class="loading">Erreur : ${escapeHtml(error.message)}</td></tr>`;
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

async function supprimerAdherent(id) {
    if (!confirm('Voulez-vous vraiment supprimer cet adherent ?')) return;
    try {
        await AdherentsAPI.delete(id);
        afficherMessage('Adherent supprimé avec succès !');
        chargerAdherents();
    } catch (error) {
        afficherMessage(error.message, 'error');
    }
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

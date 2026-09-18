
let chartEmpruntsMois = null;
let chartRepartition = null;

document.addEventListener('DOMContentLoaded', () => {
    chargerDashboard();
});

async function chargerDashboard() {
    try {
        await Promise.all([
            chargerStats(),
            chargerEmpruntsRecents(),
        ]);
    } catch (error) {
        console.error('Erreur dashboard :', error);
        afficherMessage('Erreur de chargement du tableau de bord', 'error');
    }
}

async function chargerStats() {
    const stats = await fetchAPI('/dashboard/stats');
    document.getElementById('statTotalLivres').textContent = stats.total_livres;
    document.getElementById('statDisponibles').textContent = 
        `${stats.livres_disponibles} disponibles`;
    document.getElementById('statTotalAdherents').textContent = stats.total_adherents;
    document.getElementById('statEmpruntsEnCours').textContent = stats.emprunts_en_cours;
    document.getElementById('statEmpruntsRetard').textContent = stats.emprunts_en_retard;

    creerChartEmpruntsMois(stats.emprunts_par_mois);
    creerChartRepartition(stats.repartition_statut);

    // Top 5
    afficherTopLivres(stats.top_livres);
    afficherTopAdherents(stats.top_adherents);
}

function creerChartEmpruntsMois(donnees) {
    const ctx = document.getElementById('chartEmpruntsMois');
    if (!ctx) return;

    const labels = donnees.map(d => {
        const [annee, mois] = d.mois.split('-');
        const nomsMois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 
                          'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        return `${nomsMois[parseInt(mois) - 1]} ${annee.slice(2)}`;
    });
    const valeurs = donnees.map(d => parseInt(d.total));

    if (chartEmpruntsMois) chartEmpruntsMois.destroy();

    chartEmpruntsMois = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Emprunts',
                data: valeurs,
                borderColor: '#4a9eff',
                backgroundColor: 'rgba(74, 158, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#4a9eff',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a1a1a',
                    padding: 12,
                    titleFont: { family: 'Inter', size: 13 },
                    bodyFont: { family: 'Inter', size: 13 },
                    displayColors: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f0f0f0', drawBorder: false },
                    ticks: { 
                        color: '#8b8b8b', 
                        font: { family: 'Inter', size: 12 },
                        stepSize: 1,
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { 
                        color: '#8b8b8b', 
                        font: { family: 'Inter', size: 12 }
                    }
                }
            }
        }
    });
}


function creerChartRepartition(donnees) {
    const ctx = document.getElementById('chartRepartition');
    if (!ctx) return;

    const labels = donnees.map(d => 
        d.statut === 'disponible' ? 'Disponibles' : 'Empruntés'
    );
    const valeurs = donnees.map(d => parseInt(d.total));
    const couleurs = donnees.map(d => 
        d.statut === 'disponible' ? '#22c55e' : '#f59e0b'
    );

    if (chartRepartition) chartRepartition.destroy();

    chartRepartition = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: valeurs,
                backgroundColor: couleurs,
                borderWidth: 0,
                hoverOffset: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 16,
                        font: { family: 'Inter', size: 12, weight: '600' },
                        color: '#1a1a1a',
                        usePointStyle: true,
                        pointStyle: 'circle',
                    }
                },
                tooltip: {
                    backgroundColor: '#1a1a1a',
                    padding: 12,
                    titleFont: { family: 'Inter', size: 13 },
                    bodyFont: { family: 'Inter', size: 13 },
                }
            }
        }
    });
}

function afficherTopLivres(livres) {
    const ul = document.getElementById('topLivres');
    if (!ul) return;

    if (!livres || livres.length === 0) {
        ul.innerHTML = '<li class="loading">Aucune donnée</li>';
        return;
    }

    ul.innerHTML = livres.map((livre, index) => `
        <li>
            <div class="rank">${index + 1}</div>
            <div class="info">
                <span class="name">${escapeHtml(livre.titre)}</span>
                <span class="sub">${escapeHtml(livre.auteur || '—')}</span>
            </div>
            <span class="count">${livre.nb_emprunts}</span>
        </li>
    `).join('');
}

function afficherTopAdherents(adherents) {
    const ul = document.getElementById('topAdherents');
    if (!ul) return;

    if (!adherents || adherents.length === 0) {
        ul.innerHTML = '<li class="loading">Aucune donnée</li>';
        return;
    }

    ul.innerHTML = adherents.map((adherent, index) => `
        <li>
            <div class="rank">${index + 1}</div>
            <div class="info">
                <span class="name">${escapeHtml(adherent.nom_adherent)}</span>
                <span class="sub">${adherent.nb_emprunts} emprunt${adherent.nb_emprunts > 1 ? 's' : ''}</span>
            </div>
            <span class="count">${adherent.nb_emprunts}</span>
        </li>
    `).join('');
}


async function chargerEmpruntsRecents() {
    const tbody = document.getElementById('tableEmpruntsRecents');
    if (!tbody) return;

    try {
        const emprunts = await fetchAPI('/dashboard/emprunts-recents');

        if (!emprunts || emprunts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">Aucun emprunt récent.</td></tr>';
            return;
        }

        tbody.innerHTML = emprunts.map(e => {
            let badgeClass = 'badge-disponible';
            let badgeLabel = 'En cours';
            if (e.statut_calcule === 'retard') {
                badgeClass = 'badge-retard';
                badgeLabel = 'En retard';
            } else if (e.statut_calcule === 'rendu') {
                badgeClass = 'badge-emprunte';
                badgeLabel = 'Rendu';
            }

            const dateEmprunt = new Date(e.date_emprunt).toLocaleDateString('fr-FR');
            const dateRetour = new Date(e.date_retour_prevue).toLocaleDateString('fr-FR');

            return `
                <tr>
                    <td><strong>${escapeHtml(e.livre_titre)}</strong></td>
                    <td>${escapeHtml(e.nom_adherent)}</td>
                    <td>${dateEmprunt}</td>
                    <td>${dateRetour}</td>
                    <td><span class="badge ${badgeClass}">${badgeLabel}</span></td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="5" class="loading" style="color: #ef4444;">Erreur : ${error.message}</td></tr>`;
    }
}
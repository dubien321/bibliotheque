const db = require('../config/db');

exports.getStats = async (req, res, next) => {
    try {
        const stats = {};

        // 1. Compteurs généraux
        const livres = await db.query('SELECT COUNT(*) FROM livres');
        stats.total_livres = parseInt(livres.rows[0].count);

        const adherents = await db.query('SELECT COUNT(*) FROM adherents');
        stats.total_adherents = parseInt(adherents.rows[0].count);

        const auteurs = await db.query('SELECT COUNT(*) FROM auteurs');
        stats.total_auteurs = parseInt(auteurs.rows[0].count);

        const empruntsTotal = await db.query('SELECT COUNT(*) FROM emprunts');
        stats.total_emprunts = parseInt(empruntsTotal.rows[0].count);

        // 2. Emprunts en cours (non rendus)
        const enCours = await db.query(
            'SELECT COUNT(*) FROM emprunts WHERE date_retour_reelle IS NULL'
        );
        stats.emprunts_en_cours = parseInt(enCours.rows[0].count);

        // 3. Emprunts en retard
        const retards = await db.query(`
            SELECT COUNT(*) FROM emprunts 
            WHERE date_retour_reelle IS NULL 
              AND date_retour_prevue < CURRENT_DATE
        `);
        stats.emprunts_en_retard = parseInt(retards.rows[0].count);

        // 4. Livres disponibles
        const disponibles = await db.query(
            "SELECT COUNT(*) FROM livres WHERE statut = 'disponible'"
        );
        stats.livres_disponibles = parseInt(disponibles.rows[0].count);

        // 5. Top 5 livres les plus empruntés
        const topLivres = await db.query(`
            SELECT 
                l.titre,
                a.nom AS auteur,
                COUNT(e.id_emprunt) AS nb_emprunts
            FROM emprunts e
            JOIN livres l ON e.id_livre = l.id_livre
            JOIN auteurs a ON l.id_auteur = a.id_auteur
            GROUP BY l.id_livre, l.titre, a.nom
            ORDER BY nb_emprunts DESC
            LIMIT 5
        `);
        stats.top_livres = topLivres.rows;

        // 6. Top 5 adhérents les plus actifs
        const topAdherents = await db.query(`
            SELECT 
                a.nom_adherent,
                COUNT(e.id_emprunt) AS nb_emprunts
            FROM emprunts e
            JOIN adherents a ON e.id_adherent = a.id_adherent
            GROUP BY a.id_adherent, a.nom_adherent
            ORDER BY nb_emprunts DESC
            LIMIT 5
        `);
        stats.top_adherents = topAdherents.rows;

        // 7. Répartition des livres par statut (pour un graphique en donut)
        const repartitionStatut = await db.query(`
            SELECT statut, COUNT(*) AS total
            FROM livres
            GROUP BY statut
        `);
        stats.repartition_statut = repartitionStatut.rows;

        // 8. Emprunts par mois (12 derniers mois) - pour graphique en ligne
        const empruntsParMois = await db.query(`
            SELECT 
                TO_CHAR(date_emprunt, 'YYYY-MM') AS mois,
                COUNT(*) AS total
            FROM emprunts
            WHERE date_emprunt >= CURRENT_DATE - INTERVAL '12 months'
            GROUP BY mois
            ORDER BY mois ASC
        `);
        stats.emprunts_par_mois = empruntsParMois.rows;

        res.json(stats);
    } catch (err) {
        next(err);
    }
};

// GET /api/dashboard/emprunts-recents
// Retourne les 10 derniers emprunts pour le tableau récent
exports.getEmpruntsRecents = async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT 
                e.id_emprunt,
                e.date_emprunt,
                e.date_retour_prevue,
                e.date_retour_reelle,
                l.titre AS livre_titre,
                a.nom_adherent,
                CASE 
                    WHEN e.date_retour_reelle IS NOT NULL THEN 'rendu'
                    WHEN e.date_retour_prevue < CURRENT_DATE THEN 'retard'
                    ELSE 'en_cours'
                END AS statut_calcule
            FROM emprunts e
            JOIN livres l ON e.id_livre = l.id_livre
            JOIN adherents a ON e.id_adherent = a.id_adherent
            ORDER BY e.date_emprunt DESC
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};
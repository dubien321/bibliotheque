const db = require('../config/db');
    
const AdherentModel = {
    findAllAdherents: async () => {
        const result = await db.query('SELECT * FROM adherents ORDER BY nom_adherent ASC');
        return result.rows;
    },
    findByIdAdherent: async (id_adherent) => {
        const result = await db.query('SELECT * FROM adherents WHERE id_adherent = $1', [id_adherent]);
        return result.rows[0];
    },
    createAdherent: async ({ nom_adherent, contact }) => {
        const result = await db.query(
            'INSERT INTO adherents (nom_adherent, contact) VALUES ($1, $2) RETURNING *',
            [nom_adherent, contact]
        );
        return result.rows[0];
    },
    updateAdherent: async (id_adherent, { nom_adherent, contact }) => {
        const result = await db.query(
            'UPDATE adherents SET nom_adherent = $1, contact = $2 WHERE id_adherent = $3 RETURNING *',
            [nom_adherent, contact, id_adherent]
        );
        return result.rows[0];
    },
    deleteAdherent: async (id_adherent) => {
        const result = await db.query('DELETE FROM adherents WHERE id_adherent = $1 RETURNING *', [id_adherent]);
        return result.rows[0];
    },

    getHistoriqueAdherent: async (id_adherent) => {
        const requette =`
        SELECT 
        e.id_emprunt,
        e.date_emprunt,
        e.date_retour_prevue,
        e.date_retour_reelle,
        l.titre AS titre_livre,
        CASE WHEN e.date_retour_reelle IS NOT NULL THEN 'rendu' 
            WHEN e.date_retour_prevue < CURRENT_DATE THEN 'retard'
            ELSE 'en_cours'
        END AS statut_calcule
        FROM emprunts e
        JOIN livres l ON e.id_livre=l.id_livre
        WHERE e.id_adherent = $1
        ORDER BY e.date_emprunt DESC
        `;
        const result = await db.query(requette, [id_adherent]);
        return result.rows
    }
};  
module.exports = AdherentModel;
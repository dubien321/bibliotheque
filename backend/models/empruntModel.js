const db = require('../config/db');
const { findAll, findById } = require('./auteurModel');

const EmpruntModel = {
    findAll : async()=>{
        const requete= `
        SELECT 
            e.id_emprunt,
            e.id_adherent,
            e.id_livre,
            e.date_emprunt,
            e.date_retour_reelle,
            l.titre AS titre_livre,
            a.nom_auteur AS nom_auteur,
            CASE
                when e.date_retour_reelle IS NOT NULL THEN 'rendu'
                when e.date_retour_reelle IS NULL AND e.date_retour_prevue < CURRENT_DATE THEN 'retard'    
                ELSE 'en_cours'
            END AS statut_calcule
        FROM emprunts e
        JOIN livres l ON e.id_livre = l.id_livre
        JOIN auteurs a ON l.id_auteur = a.id_auteur
        ORDER BY e.date_emprunt DESC
        `;
        const result = await db.query(requete);
        return result.rows;
    },
    findById: async (id_emprunt) => {
        const result = await db.query('SELCT * FROM emprunts WHERE id_emprunt= $1', [id_emprunt]);
        return result.rows[0];
    },
    createEmprunt: async (req, res, next) => {
    const {id_livre, id_adherent, date_emprunt, date_retour} = req.body;
        const verifyLivre = await db.query(
           'SELECT * FROM livres WHERE id_livre=$1',
            [id_livre]
        );
        return result.rows[0];
    },
    retourner: async (id_emprunt) => {
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            const empruntResult = await client.query(
                `UPDATE emprunts 
                SET date_retour_reelle = CURRENT_DATE, statut = 'rendu' 
                WHERE id_emprunt = $1 AND date_retour_reelle IS NULL 
                RETURNING *`,
                [id_emprunt]
            );

            if (empruntResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            await client.query(
                `UPDATE livres SET statut = 'disponible' WHERE id_livre = $1`,
                [empruntResult.rows[0].id_livre]
            );

            await client.query('COMMIT');
            return empruntResult.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

}
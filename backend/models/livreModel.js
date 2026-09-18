const db = require('../config/db');

const LivreModel = {
    findAll: async () => {
        const result = await db.query(`
            SELECT l.id_livre, l.titre, l.date_publication, l.statut,
                   a.nom AS auteur_nom
            FROM livres l
            JOIN auteurs a ON a.id_auteur = l.id_auteur
            ORDER BY l.titre ASC
        `);
        return result.rows;
    },
    findById: async(id)=>{
        const result = await db.query(`
            SELECT * FROM livres WHERE id_livre =$1
            `, [id]
        );
        return result.rows[0];

    },
    createLivre: async ({ titre, date_publication, id_auteur }) => {
        const result = await db.query(
            'INSERT INTO livres (titre, date_publication, id_auteur, statut) VALUES ($1, $2, $3, $4) RETURNING *',
            [titre, date_publication, id_auteur, 'disponible']
        );
        return result.rows[0];
    },
    updateLivre: async (id_livre, { titre, id_auteur, statut }) => {
        const result = await db.query(
            'UPDATE livres SET titre=$1, id_auteur=$2, statut=COALESCE($3, statut) WHERE id_livre=$4 RETURNING *',
            [titre, id_auteur, statut, id_livre]
        );
        return result.rows[0];
    },
    findByNameAuteur: async (search = '') => {
        const searchParam = `%${search}%`;
        let requete = `
            SELECT l.id_livre, l.titre, l.date_publication, l.statut,
                   a.nom AS auteur_nom, a.nationalite AS nationalite_auteur
            FROM livres l
            JOIN auteurs a ON l.id_auteur = a.id_auteur
        `;
        const value = [];

        if (search) {
            requete += ` WHERE l.titre ILIKE $1 OR a.nom ILIKE $1`;
            value.push(searchParam);
        }

        requete += ` ORDER BY l.titre ASC`;
        const result = await db.query(requete, value);
        return result.rows;
    },
    deleteLivre: async (id) => {
        const result = await db.query(
            'DELETE FROM livres WHERE id_livre = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    },
};
module.exports = LivreModel;
const db = require('../config/db');

const AuteurModel = {
    findAll: async () => {
        const result = await db.query('SELECT * FROM auteurs ORDER BY nom ASC');
        return result.rows;
    },

    findById: async (id) => {
        const result = await db.query('SELECT * FROM auteurs WHERE id_auteur = $1', [id]);
        return result.rows[0];
    },

    create: async ({ nom, nationalite }) => {
        const result = await db.query(
            'INSERT INTO auteurs (nom, nationalite) VALUES ($1, $2) RETURNING *',
            [nom, nationalite]
        );
        return result.rows[0];
    },

    update: async (id, { nom, nationalite }) => {
        const result = await db.query(
            'UPDATE auteurs SET nom = $1, nationalite = $2 WHERE id_auteur = $3 RETURNING *',
            [nom, nationalite, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        const result = await db.query(
            'DELETE FROM auteurs WHERE id_auteur = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    },
};

module.exports = AuteurModel;
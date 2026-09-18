const db = require("../config/db");

exports.getAllEmprunts = async (req, res, next) => {
    try{
        const result = await db.query(`
            SELECT
                e.id_emprunt,
                e.id_adherent,
                e.id_livre,
                e.date_emprunt,
                e.date_retour_prevue,
                e.date_retour_reelle,
                l.titre AS livre_titre,
                a.nom AS auteur_nom,
                ad.nom_adherent AS adherent_nom,
                CASE
                    WHEN e.date_retour_reelle IS NOT NULL THEN 'rendu'
                    WHEN e.date_retour_prevue < CURRENT_DATE THEN 'retard'
                    ELSE 'en_cours'
                END AS statut
            FROM emprunts e
            JOIN livres l ON e.id_livre = l.id_livre
            JOIN auteurs a ON l.id_auteur = a.id_auteur
            JOIN adherents ad ON e.id_adherent = ad.id_adherent
            ORDER BY e.date_emprunt DESC
        `);
        res.json(result.rows);
    }catch (error) {
        next(error);
    }
}

exports.createEmprunt = async (req, res, next) => {
    const {id_livre, id_adherent, date_emprunt, date_retour_prevue} = req.body;
    try{
        const verifyLivre = await db.query(
           'SELECT * FROM livres WHERE id_livre=$1',
            [id_livre]
        );
        if(verifyLivre.rows.length === 0){
            return res.status(400).json({erreur: "Ce livre est introuvable"});
        }
        if(verifyLivre.rows[0].statut === "emprunte"){
            return res.status(400).json({erreur: "Ce livre est déjà emprunté"});
        }
        await db.query('BEGIN');
        await db.query(`
            SELECT setval(
                pg_get_serial_sequence('emprunts', 'id_emprunt'),
                COALESCE((SELECT MAX(id_emprunt) FROM emprunts), 0) + 1,
                false
            )
        `);
        const EmpruntResult = await db.query(
            'INSERT INTO emprunts (id_livre, id_adherent, date_emprunt, date_retour_prevue) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_livre, id_adherent, date_emprunt, date_retour_prevue]
        );

        await db.query(
            'UPDATE livres SET statut=$1 WHERE id_livre=$2',
            ['emprunte', id_livre]
        );
        
        await db.query('COMMIT');
        res.status(201).json(EmpruntResult.rows[0]);
    }catch (error) {
        await db.query('ROLLBACK');
        next(error);
    }
}

exports.retournerLivre = async(req, res, next)=>{
    const {id_emprunt} = req.params;
    try{
        await db.query('BEGIN');

        const empruntResult = await db.query(
            "UPDATE emprunts SET date_retour_reelle=CURRENT_DATE, statut=$2 WHERE id_emprunt=$1 RETURNING *",
            [id_emprunt, 'rendu']
        );
        if(empruntResult.rows.length === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({erreur: "Emprunt introuvable"});
        }

        await db.query(
            "UPDATE livres SET statut=$1 WHERE id_livre=(SELECT id_livre FROM emprunts WHERE id_emprunt=$2)",
            ['disponible', id_emprunt]
        );
        await db.query('COMMIT');
        res.json(empruntResult.rows[0]);
    }catch (error) {
        next(error);
    }
}

exports.updateEmprunt = async(req, res, next)=>{
    const {id_emprunt} = req.params;
    const {date_retour_reelle, statut} = req.body;
    try{
        const result = await db.query(
            'UPDATE emprunts SET date_retour_reelle=$1, statut=$2 WHERE id_emprunt=$3 RETURNING *',
            [date_retour_reelle, statut, id_emprunt]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({erreur: "Emprunt introuvable"});
        }
        res.json(result.rows[0]);
    }
    catch(error){
        next(error);
    }
}

exports.deleteEmprunt = async (req, res, next) => {
    const { id_emprunt } = req.params;
    try {
        const result = await db.query(
            'DELETE FROM emprunts WHERE id_emprunt=$1 RETURNING *',
            [id_emprunt]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ erreur: "Emprunt introuvable" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}


exports.getEmprunts = async (req, res, next) => {
    const {id_emprunt} = req.params;
    try{
        const result = await db.query(`
            SELECT
                e.id_emprunt,
                e.id_livre,
                e.id_adherent,
                e.date_emprunt,
                e.date_retour_prevue,
                e.date_retour_reelle,
                l.titre AS titre_livre,
                a.nom_adherent,
                CASE
                    WHEN e.date_retour_reelle IS NOT NULL THEN 'rendu'
                    WHEN e.date_retour_prevue < CURRENT_DATE THEN 'retard'
                    ELSE 'en_cours'
                END AS statut
            FROM emprunts e
            JOIN livres l ON e.id_livre = l.id_livre
            JOIN adherents a ON e.id_adherent = a.id_adherent
            WHERE e.id_emprunt = $1
        `, [id_emprunt]);
        if(result.rows.length === 0) {
            return res.status(404).json({erreur: "Emprunt introuvable"});
        }
        res.json(result.rows[0]);
    }catch(error){
        next(error);
    }
}
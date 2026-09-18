const validate = (champsRequis) => {
    return (req, res, next) => {
        const erreurs = [];
        for (const champ of champsRequis) {
            if (!req.body[champ]) {
                erreurs.push(`Le champ '${champ}' est obligatoire.`);
            }
        }
        if (erreurs.length > 0) {
            return res.status(400).json({ erreurs });
        }
        next();
    };
};

module.exports = validate;
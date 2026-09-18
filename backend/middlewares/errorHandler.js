const errorHandler = (err, req, res, next) => {
    console.error("Erreur attrapée :", err.message);
    const status = err.status || 500;
    res.status(status).json({
        erreur: err.message || "Une erreur interne est survenue sur le serveur."
    });
};

module.exports = errorHandler;
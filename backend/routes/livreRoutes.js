const router = require("express").Router();
const livreController = require("../controllers/livreController");
const validate = require("../middlewares/validate");

router.get("/", livreController.getAllLivres);
router.post("/", validate(["titre", "id_auteur"]), livreController.createLivre);
router.put("/:id_livre", validate(["titre", "id_auteur"]), livreController.updateLivre);
router.delete("/:id_livre", livreController.deleteLivre);
router.get("/search", livreController.getAllLivresByNameAuteur);
router.get('/:id_livre', livreController.getByIdLivres);

module.exports = router;
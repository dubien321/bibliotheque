const router = require("express").Router();
const auteurController = require("../controllers/auteurController");
const validate = require("../middlewares/validate");

router.get("/", auteurController.getAllAuteurs);
router.get("/:id_auteur", auteurController.getByIdAuteur);
router.post("/", validate(["nom", "nationalite"]), auteurController.createAuteur);
router.put("/:id_auteur", validate(["nom", "nationalite"]), auteurController.updateAuteur);
router.delete("/:id_auteur", auteurController.deleteAuteur);

module.exports = router;
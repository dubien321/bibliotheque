const router = require("express").Router();
const adherentController = require("../controllers/adherentController");
const validate = require("../middlewares/validate");

router.get("/", adherentController.getAllAdherents);
router.get("/:id_adherent/emprunts", adherentController.getHistoriqueAdherent);
router.get("/:id_adherent", adherentController.getByIdAdherent);
router.post("/", validate(["nom_adherent", "contact"]), adherentController.createAdherent);
router.put("/:id_adherent", validate(["nom_adherent", "contact"]), adherentController.updateAdherent);
router.delete("/:id_adherent", adherentController.deleteAdherent);

module.exports = router;
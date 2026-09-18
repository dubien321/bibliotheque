const express = require("express");
const router = require("express").Router();
const empruntController = require("../controllers/empruntController");
const validate = require("../middlewares/validate");

router.get("/", empruntController.getAllEmprunts);
router.get("/:id_emprunt", empruntController.getEmprunts);
router.post("/", validate(["id_livre", "id_adherent", "date_retour_prevue"]), empruntController.createEmprunt);
router.put("/:id_emprunt", validate(["date_retour_reelle", "statut"]), empruntController.updateEmprunt);
router.delete("/:id_emprunt", empruntController.deleteEmprunt);
router.put("/:id_emprunt/retour", empruntController.retournerLivre);
module.exports = router;
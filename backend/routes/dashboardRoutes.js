const router = require('express').Router();
const dashboardController = require('../controllers/dasboardController');

router.get('/stats', dashboardController.getStats);
router.get('/emprunts-recents', dashboardController.getEmpruntsRecents);

module.exports = router;
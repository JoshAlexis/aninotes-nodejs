const express = require('express');

const router = express.Router();
const illustratorsController = require('../controllers/illustrators.controller');

router.get('/', illustratorsController.getAll);
router.get('/name', illustratorsController.getByName);
router.get('/source/:source', illustratorsController.getBySource);
router.post('/add', illustratorsController.getAll);
router.put('/update/:id', illustratorsController.getAll);

module.exports = router;

const express = require('express');

const router = express.Router();
const illustratorsController = require('../controllers/illustrators.controller');

router.get('/', illustratorsController.getAll);
router.get('/:id', illustratorsController.getAll);
router.get('/name/:name', illustratorsController.getAll);
router.get('/source/:source', illustratorsController.getAll);
router.post('/add', illustratorsController.getAll);
router.put('/update/:id', illustratorsController.getAll);

module.exports = router;

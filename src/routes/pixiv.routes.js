const express = require('express');

const router = express.Router();
const PixivController = require('../controllers/pixiv.controller');

router.get('/', PixivController.getAll);
router.get('/idpixiv/:idPixiv', PixivController.getByIdPixiv);
router.get('/content', PixivController.getByContent);
router.post('/', PixivController.addPixiv);
router.put('/:id', PixivController.updatePixiv);

module.exports = router;

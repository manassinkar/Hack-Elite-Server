let express = require('express');
let router = express.Router();
let sC = require('../controllers/shortlist.controller');

router.post('/accept',sC.accept);
router.post('/reject',sC.reject);

module.exports = router;
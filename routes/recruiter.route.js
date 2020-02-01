let express = require('express');
let router = express.Router();
let rC = require('../controllers/recuiter.controller');

router.post('/login',rC.login);
router.post('/register',rC.register);
router.get('/viewProfile',rC.viewProfile);
router.post('/shortlist',rC.shortlisting);

module.exports = router;
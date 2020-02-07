let express = require('express');
let router = express.Router();
let multer = require('multer');
let uC = require('../controllers/user.controller');

var storage = multer.diskStorage({
    filename: function (req, file, cb)
    {
        cb(null, file.originalname)
    }
});
   
var upload = multer({ storage: storage });

router.post('/login',uC.login);
router.post('/register',upload.single('file'),uC.register);
router.post('/test',uC.testMail);
router.get('/viewProfile',uC.viewProfile);
router.get('/getCategories',uC.getUniqueCategory);
router.get('/usersByCategory',uC.getUsersByCategory);
router.get('/viewShortlist',uC.viewShortlist);

module.exports = router;
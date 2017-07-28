var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'public/uploads/'})
var fn                          //filename
var i,l

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});


router.post('/', upload.any(), function (req, res, next) {
    // l = req.files.length;
    // i = 0;
    // console.log(l);
    // console.log(i);
    // for ( ; i < req.files.length; i++){
    fn = req.files[0].filename;
    console.log(fn);
    res.render('link');
    // }
});


// for ( i = 0; i < l; i++){
router.get('/image', function (req, res, next) {
    console.log(fn);
    res.render('image', {img: '/uploads/'+fn});
});
// }
module.exports = router;

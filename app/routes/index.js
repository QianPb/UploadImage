/****
 *
 * start
 */
var express = require('express');
var router = express.Router();
var multer = require('multer');       // for upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {   //define the destination of upload
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {   //define the unique filename after uploaded
        cb(null, Date.now()+'-'+file.originalname)
    }
})

var upload = multer({ storage: storage })

var fn;                          //filename
var fnwithoutFi;                 //filename without Fieldname
var filesInZip;                  //the name of files in zip file
var links = {};                  //the urls of pictures in zip


var DecompressZip = require('decompress-zip');     // for unzip
var unzipper = new DecompressZip('public/uploads/1.zip');

function decompressfile(filename) {      //unzip the uploaded file and save to a folder
    unzipper.on('error', function (err) {
        console.log('Caught an error');
    });

    unzipper.on('extract', function (log) {
        console.log('Finished extracting');
    });

    unzipper.on('progress', function (fileIndex, fileCount) {
        console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
    });

    unzipper.extract({
        path: 'public/uploads/'+filename,
        filter: function (file) {
            return file.type !== "SymbolicLink";
        }
    });
}

function getnames() {                    // get all the names of files in the zip
    unzipper.on('error', function (err) {
        console.log('Caught an error');
    });

    unzipper.on('list', function (files) {
        console.log('The archive contains:');
        console.log(files);
        filesInZip = files;

    });

    unzipper.list();
}
//

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

//upload
router.post('/', upload.any(), function (req, res, next) {
    // res.send(req.files)
    fn = req.files[0].filename;
    console.log(fn);
    fnwithoutFi = fn.substring(0,fn.length-4);
    console.log(fnwithoutFi);
    if(req.files[0].mimetype == "application/zip"){       //if the file uploaded is a zip
        setTimeout(function(){
            unzipper = new DecompressZip('public/uploads/'+fn);   //unzip
            decompressfile(fnwithoutFi);
            },500);
        setTimeout(function () {
            getnames();                    // get names of files in zip
        },1200);
        setTimeout(function () {
            for(var i=0, j=0; i<filesInZip.length; i++){           // create urls for pictures
                if ( filesInZip[i].substring(0,9) !== "__MACOSX/" ){
                    console.log(filesInZip[i]);
                    links[j] = "http://localhost:3000/"+fnwithoutFi+"/"+filesInZip[i];
                    j++;
                }
            }
        },1500);
        setTimeout(function () {      //pass the urls to another page to show the links
            console.log(links);
            res.render('link2',{links:links})
        },2000)
    }
    else{                        // if the file uploaded is a single picture
        res.render('link');
    }
});

// //show the picture by http link ( zip file )
// router.get('/'+fnwithoutFi+"/"+filesInZip[i], function (req, res, next) {
//     console.log(fn);
//     res.render('image', {img: '/uploads/'+fnwithoutFi+"/"+filesInZip[i]});
// });

//show the picture by http link ( a single image )

router.get('/image', function (req, res, next) {
    console.log(fn);
    res.render('image', {img: '/uploads/'+fn});
});

module.exports = router;

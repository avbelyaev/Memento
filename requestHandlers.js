/**
 * Created by anthony on 07.05.17.
 */
const exec          = require("child_process").exec;
const utils         = require("./utils");
const querystring   = require("querystring");
const fs            = require("fs");
const formidable    = require("formidable");
const mv            = require("mv");
const meme          = require('./controllers/models/meme');
const url           = require('url');



function start(rq, rsp) {
    console.log("rq handler for 'start' was called");

    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" '+
        'content="text/html; charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/upload" enctype="multipart/form-data" '+
        'method="post">'+
        '<input type="file" name="upload">'+
        '<input type="submit" value="Upload file" />'+
        '</form>'+
        '</body>'+
        '</html>';

    utils.respond(
        rsp, body, utils.STATUS_200, utils.CONTENT_TYPE_TEXT_HTML);
}



function upload(rq, rsp) {
    console.log("rq handler for 'upload' was called");

    var form = new formidable.IncomingForm();
    form.parse(rq, function (err, fields, files) {
        console.log("parsing done");

        mv(files.upload.path, "./tmp/test.png", function (err1) {
            if (err1) {
                throw err1;
            }
        });

        rsp.writeHead(200, {"Content-Type": "text/html"});
        rsp.write("received image:<br/>");
        rsp.write("<data src='/show' />");
        rsp.end();
    })
}



function show(rq, rsp) {
    console.log("rq handler for 'show' was called");

    fs.readFile("./tmp/test.png", "binary", function (err, file) {
        if (err) {
            utils.respond(rsp, err + "\n", utils.STATUS_500, utils.CONTENT_TYPE_TEXT_PLAIN);
            return;
        }

        rsp.writeHead(200, {"Content-Type": "image/png"});
        rsp.write(file, "binary");
        rsp.end();

    });
}

function showMeme(rq, rsp) {
    var urlParts = url.parse(rq.url, true);
    var q = urlParts.query;
    console.log('requesting meme by id: ' + q.id);

    meme.findById(q.id, function (memeFound) {
        rsp.writeHead(200, {"Content-Type:": "text/plain"});
        rsp.write("found: " + memeFound);
        rsp.end();
    });

}


function stub() {
    exec("ls -l", function (err, stdout, stderr) {
        //respond(rsp, stdout);
    });

    exec("find /",
        { timeout: 10000, maxBuffer: 20000*1024 },
        function (error, stdout, stderr) {
            //respond(rsp, stdout);
        }
    );

    function sleep(milliSeconds) {
        var startTime = new Date().getTime();
        while (new Date().getTime() < startTime + milliSeconds);
    }
}


exports.start = start;
exports.upload = upload;
exports.show = show;
exports.showMeme = showMeme;
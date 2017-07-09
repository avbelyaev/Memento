/**
 * Created by anthony on 09.07.17.
 */
const memeModel     = require('./models/meme');

//this module works with meme model

exports.findAll = function (rq, rsp) {
    console.log('findAll');
    memeModel.findAll(function (memes) {
        console.log('memes found');
        rsp.send(memes);
        //rsp.writeHead(200, {"Content-Type:": "text/plain"});
        //rsp.write(memes);
        //rsp.end();
    });
};

exports.findOneByAttr = function (rq, rsp) {

};

// CREATE
exports.meme_create_get = function (rq, rsp) {

};

exports.meme_create_post = function (rq, rsp) {
    rsp.send('meme create POST');
};

//UPDATE
exports.meme_update_get = function (rq, rsp) {
    rsp.send('meme create POST');
};

exports.meme_update_post = function (rq, rsp) {
    rsp.send('meme create POST');
};

//DELETE
exports.meme_delete_get = function (rq, rsp) {
    rsp.send('meme create POST');
};

exports.meme_delete_post = function (rq, rsp) {
    rsp.send('meme create POST');
};
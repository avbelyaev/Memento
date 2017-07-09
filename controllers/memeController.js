/**
 * Created by anthony on 09.07.17.
 */
const memeModel     = require('./models/meme');


exports.findAll = function (rq, rsp) {
    memeModel.findAll(function (memes) {
        rsp.send(memes);
    });
};

exports.findOneById = function (rq, rsp) {
    var id = rq.params.id;
    memeModel.findOneById(id, function (singleMeme) {
        rsp.send(singleMeme);
    });
};

exports.findByTitle = function (rq, rsp) {
    var title = rq.params.title;
    memeModel.findByTitle(title, function (memes) {
        rsp.send(memes);
    });
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
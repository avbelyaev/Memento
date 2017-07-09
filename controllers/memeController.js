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

exports.save = function (rq, rsp) {
    rq.on('data', function (chunk) {
        console.log('chunk of data: ' + chunk);
    });

    rq.on('end', function () {
        console.log('end of data');
    });

    rsp.send('TBD');

    /*memeModel.save(newMeme, function (meme) {
        rsp.send('meme saved');
    })*/
};


exports.update = function (rq, rsp) {
    const id = rq.params.id;
    rsp.send('NOT IMPLEMENTED');
};

exports.delete = function (rq, rsp) {
    const id = rq.params.id;
    rsp.send('NOT IMPLEMENTED');
};
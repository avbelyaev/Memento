/**
 * Created by anthony on 09.07.17.
 */
const memeModel     = require('./models/meme');

//fat model, thin controller
exports.findAll = function (rq, rsp) {
    memeModel.findAll(function (memes) {
        if (memes) {
            rsp.send(memes);
        } else {
            rsp.status(404).send({});
        }
    });
};

exports.findOneById = function (rq, rsp) {
    var id = rq.params.id;
    memeModel.findOneById(id, function (singleMeme) {
        if (singleMeme) {
            rsp.send(singleMeme);
        } else {
            rsp.status(404).send({});
        }
    });
};

exports.findByTitle = function (rq, rsp) {
    var title = rq.params.title;
    memeModel.findByTitle(title, function (memes) {
        if (memes) {
            rsp.send(memes);
        } else {
            rsp.status(404).send({});
        }
    });
};

exports.save = function (rq, rsp) {
    var chunks = [];
    rq.on('data', function (chunk) {
        chunks.push(chunk);
    });

    var data;
    rq.on('end', function () {
        console.log('processing data');
        data = Buffer.concat(chunks);

        var rqBody;
        try {
             rqBody = JSON.parse(data);
        } catch (e) {
            console.log('error while parsing JSON: ' + e);
            rsp.status(404).send({});
            return;
        }

        try {
            memeModel.create(rqBody, function (err, meme) {
                if (err) {
                    console.error('error while creating meme entry');
                    rsp.status(422).send(err);
                }
                if (meme) {
                    rsp.send(meme);
                } else {
                    rsp.status(404).send({});
                }
            });
        } catch (e) {
            console.error('eeee: ');
        }
    });
};


exports.update = function (rq, rsp) {
    const id = rq.params.id;
    rsp.send('NOT IMPLEMENTED');
};

exports.delete = function (rq, rsp) {
    const id = rq.params.id;
    rsp.send('NOT IMPLEMENTED');
};
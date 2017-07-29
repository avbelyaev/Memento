/**
 * Created by anthony on 09.07.17.
 */
const memeModel     = require('./models/meme');


//fat model, thin controller
exports.findAll = function (rq, rsp) {
    console.log("findAll");

    memeModel.findAll(function (memes) {
        if (memes) {
            rsp.send(memes);
        } else {
            rsp.status(404).send({});
        }
    });
};



exports.findOneById = function (rq, rsp) {
    console.log('find by id');
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

    var onDataEnd = function () {
        console.log('processing data');

        var rqBody;
        try {
            rqBody = JSON.parse(Buffer.concat(chunks));

            memeModel.save(rqBody, function (err, meme) {
                if (err) {
                    var saveErr = 'error saving meme entry: ' + err;
                    console.error(saveErr);
                    rsp.status(422).send(saveErr);
                    return;
                }

                if (meme) {
                    rsp.send(meme);
                } else {
                    rsp.status(404).send({});
                }
            });


        } catch (e) {

            var parseErr = 'error saving meme: ' + e;
            rsp.status(404).send(parseErr);
            console.log(parseErr);
        }
    };


    rq.on('data', function (chunk) {
        chunks.push(chunk);
    });

    rq.on('end', onDataEnd);
};



exports.update = function (rq, rsp) {
    const id = rq.params.id;
    rsp.send('NOT IMPLEMENTED');
};



exports.delete = function (rq, rsp) {
    const id = rq.params.id;
    rsp.send('NOT IMPLEMENTED');
};
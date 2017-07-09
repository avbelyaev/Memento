/**
 * Created by anthony on 09.07.17.
 */
const express           = require('express');
const router            = express.Router();
const memeController    = require('../memeController');

router.get('', function (rq, rsp) {
    console.log('empty url');
    rsp.send('empty');
});

router.get('/memes', memeController.findAll);

//router.get('/meme/:id', memeController.find)

router.get('/users', function (rq, rsp) {

});

router.get('/user/:id', function (rq, rsp) {
    var id = rq.params.id;
    console.log('user id:' + id);
    rsp.send('id: ' + id);
});

module.exports = router;
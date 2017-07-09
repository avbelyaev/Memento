/**
 * Created by anthony on 09.07.17.
 */
const express           = require('express');
const router            = express.Router();
const memeController    = require('../memeController');
const userController    = require('../userController');
const postController    = require('../postController');
const rels              = require('../constants');

router.get('/', function (rq, rsp) {
    console.log('root');
    rsp.send('root');
});

router.get(rels.REL_MEME + ":id", memeController.findOneById);

router.get(rels.REL_MEMES, memeController.findAll);



router.get(rels.REL_USERS, function (rq, rsp) {

});





router.get(rels.REL_POSTS, function (rq, rsp) {

});

router.get(rels.REL_USERS + ':id', function (rq, rsp) {
    var id = rq.params.id;
    console.log('user id:' + id);
    rsp.send('id: ' + id);
});

module.exports = router;
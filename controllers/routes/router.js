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

router.get(rels.MEME + ':id', memeController.findOneById);

//https://stackoverflow.com/a/41521743/4504720
router.post(rels.MEME + 'create', memeController.save);

router.put(rels.MEME + ':id/update', memeController.update);

router.delete(rels.MEME + ':id/delete', memeController.delete);

router.get(rels.MEMES, memeController.findAll);

//TODO JS Promises


router.get(rels.USERS, function (rq, rsp) {

});





router.get(rels.POSTS, function (rq, rsp) {

});

router.get(rels.USERS + ':id', function (rq, rsp) {
    var id = rq.params.id;
    console.log('user id:' + id);
    rsp.send('id: ' + id);
});

module.exports = router;
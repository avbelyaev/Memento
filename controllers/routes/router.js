/**
 * Created by anthony on 09.07.17.
 */
const express           = require('express');
const router            = express.Router();
const memeController    = require('../memeController');
const userController    = require('../userController');
const postController    = require('../postController');
const log               = require('winston');


router.use(function (rq, rsp, next) {
    log.info('-----------------');
    log.info('Rq time: ' + (new Date()).toLocaleTimeString());
    next();
});


router.post     ('/memes/create', memeController.save);
router.get      ('/memes/:id', memeController.findOneById);
router.patch    ('/memes/:id', memeController.update);
router.put      ('/memes/:id', memeController.update);
router.delete   ('/memes/:id', memeController.delete);
router.get      ('/memes', memeController.findAll);


router.post     ('/posts/create', postController.save);
router.get      ('/posts/findByTitle', postController.findByTitle);
router.get      ('/posts/:id/meme', postController.findOneByIdGetMeme);
router.get      ('/posts/:id', postController.findOneById, postController.prepareResource);
router.patch    ('/posts/:id', postController.update);
router.put      ('/posts/:id', postController.update);
router.delete   ('/posts/:id', postController.delete);
router.get      ('/posts', postController.findAll);




router.get('/users', function (rq, rsp) {
    console.log("users::get");
    rsp.status(501).send('NOT IMPLEMENTED');
});


router.get('/', function (rq, rsp) {
    console.log('root');
    rsp.send('root');
});


module.exports = router;
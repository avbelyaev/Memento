/**
 * Created by anthony on 09.07.17.
 */
const express           = require('express');
const router            = express.Router();
const log               = require('winston');
const memeController    = require('../memeController');
const userController    = require('../userController');
const postController    = require('../postController');
const postMw            = require('../../middlewares/postMiddleware');
const userMw            = require('../../middlewares/userMiddleware');


router.use(function (rq, rsp, next) {
    log.info('-----------------');
    log.info('<-- Rq: ' + (new Date()).toLocaleTimeString());
    next();
});


router.post     ('/memes/create', memeController.save);
router.get      ('/memes/:id/posts', memeController.findPostsByMeme);
router.get      ('/memes/:id', memeController.findOneById);
router.patch    ('/memes/:id', memeController.update);
router.put      ('/memes/:id', memeController.update);
router.delete   ('/memes/:id', memeController.delete);
router.get      ('/memes', memeController.findAll);


router.post     ('/posts/create', postController.save);
router.get      ('/posts/findByTitle', postController.findByTitle);
router.get      ('/posts/:id', postController.findOneById, postMw.prepareResource);
router.patch    ('/posts/:id', postController.update);
router.put      ('/posts/:id', postController.update);
router.delete   ('/posts/:id', postController.delete);
router.get      ('/posts', postController.findAll, postMw.prepareResource);


router.post     ('/users/create', userController.save);
router.get      ('/users/:id/memes', userController.findMemesByUser);
router.get      ('/users/:id/posts', userController.findPostsByUser);
router.patch    ('/users/:id', userController.update);
router.put      ('/users/:id', userController.update);
router.delete   ('/users/:id', userController.delete);
router.get      ('/users', userController.findAll);
router.get      ('/users/findByUsername/:username',
                    userMw.checkToken,
                    userController.findOneByUsername);


router.get('/', function (rq, rsp) {
    console.log('root');
    rsp.send('root');
});


module.exports = router;
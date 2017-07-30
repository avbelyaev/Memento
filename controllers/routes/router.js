/**
 * Created by anthony on 09.07.17.
 */
const express           = require('express');
const router            = express.Router();
const memeController    = require('../memeController');
const userController    = require('../userController');
const postController    = require('../postController');


router.post('/meme/create', memeController.save);
router.get('/meme/:id', memeController.findOneById);
router.patch('/meme/:id', memeController.update);
router.put('/meme/:id', memeController.update);
router.delete('/meme/:id', memeController.delete);

router.get('/memes/', memeController.findAll);



router.get('/users', function (rq, rsp) {
    console.log("users::get")
});





router.get('/posts', function (rq, rsp) {

});

router.get('/user/:id', function (rq, rsp) {
    var id = rq.params.id;
    console.log('user id:' + id);
    rsp.send('id: ' + id);
});

router.get('/', function (rq, rsp) {
    console.log('root');
    rsp.send('root');
});

module.exports = router;
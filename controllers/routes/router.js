/**
 * Created by anthony on 09.07.17.
 */
const express           = require('express');
const router            = express.Router();
const memeController    = require('../memeController');
const userController    = require('../userController');
const postController    = require('../postController');

router.get('/', function (rq, rsp) {
    console.log('root');
    rsp.send('root');
});

router.get('/meme/:id', memeController.findOneById);
//https://stackoverflow.com/a/41521743/4504720
router.post('/meme/create', memeController.save);
router.put('/meme/:id/update', memeController.update);
router.delete('/meme/:id/delete', memeController.delete);

router.get('/memes/', memeController.findAll);

//TODO JS Promises


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

module.exports = router;
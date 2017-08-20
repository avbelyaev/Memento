const AppError          = require('../utils/errors/AppError');
const halson            = require('halson');
const log               = require('winston');
const controllerUtils   = require('../utils/controllerUtils');


//http://blog.cloud66.com/how-to-deploy-restful-apis-using-node-express4-and-docker/
//https://github.com/seznam/halson
exports.prepareResource = function(rq, rsp, next) {
    log.info('preparing halson resource');
    var resource = rq.locals.ret;


    if (resource instanceof AppError) {
        log.error('error preparing resource');

    } else {

        resource = halson(resource)
            .addLink('self', {
                method: 'GET',
                link: rq.originalUrl
            })
            .addLink('delete', {
                method: 'DELETE',
                link: rq.originalUrl
            })
            .addLink('update', {
                method: 'PATCH',
                link: rq.originalUrl
            });
    }

    var contTypeHalson = {
        'Content-Type': 'application/hal+json'
    };

    controllerUtils.respond(rsp, rq.locals.status, resource, contTypeHalson);
    next();
};
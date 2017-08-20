const AppError          = require('../utils/errors/AppError');
const halson            = require('halson');
const log               = require('winston');


//http://blog.cloud66.com/how-to-deploy-restful-apis-using-node-express4-and-docker/
//https://github.com/seznam/halson
exports.prepareResource = function(rq, rsp, next) {
    log.info('preparing halson resource');

    var status = rq.locals.status;
    var resource = rq.locals.ret;
    var headers = {
        'Content-Type': 'application/hal+json'
    };


    if (null !== resource) {

        if (resource instanceof AppError) {
            log.error('resource is an error');

        } else if ('object' === typeof resource && 0 < resource.length) {
            log.info('preparing ' + resource.length + ' object(s)');

            if (1 === resource.length) {

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

            } else {
                log.info('preparing array of ' + resource.length + ' entries');

                //get paging parameters here right from rq
                for (var key in resource) {
                    if (resource.hasOwnProperty(key)) {
                        var currRes = resource[key];

                    }
                }
            }
        }
    }

    rsp.status(status)
        .set(headers)
        .send(resource);

    log.info('--> Rsp: ' + status);
    next();
};
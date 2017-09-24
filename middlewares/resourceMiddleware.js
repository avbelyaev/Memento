/**
 * Created by anthony on 23.09.17.
 */
const halson            = require('halson');
const log               = require('winston');
const sendResponse      = require('../utils/httpUtils').sendResponse;

exports.prepareResource = function (rq, rsp, next) {
    log.info('preparing resource');

    let status = rq.locals.status;
    let headers = rq.locals.headers || {
        'Content-Type': 'application/hal+json'
    };

    let objectsList = [];
    let tmpResource = {};
    let resource = rq.locals.ret;

    if (resource) {
        if (Array.isArray(resource)) {

            let i = 0;
            while (i < resource.length) {
                if (resource.hasOwnProperty(i)) {
                    objectsList.push(createHalsonForEntity(resource[i], rq));
                }
                i++;
            }
            tmpResource.content = objectsList;
            resource = halson(tmpResource)
                .addLink(currentResourceRel(rq), {
                    method: rq.method,
                    link: rq.baseUrl + rq.route.path
                });

        } else {
            resource = createHalsonForEntity(resource, rq);
        }
    }

    return sendResponse(rsp, status, resource, headers);
};

const createHalsonForEntity = function(entity, rq) {
    let halsonEntity = halson(entity._doc)
        .addLink('self', {
            method: 'GET',
            link: createLinkToResource(rq, entity.id)
        })
        .addLink('delete', {
            method: 'DELETE',
            link: createLinkToResource(rq, entity.id)
        })
        .addLink('update', {
            method: 'PUT',
            link: createLinkToResource(rq, entity.id)
        });
    return halsonEntity;
};

const createLinkToResource = function(rq, resourceId) {
    let path = rq.route.path;
    let trimmedPath = path.startsWith('/') ? path.substring(1) : path;
    let rels = trimmedPath.split('/');

    if (1 < rels.length) {
        rels = rels.slice(0, rels.length - 1);
    }

    return rq.baseUrl + '/' + rels.join('/') + '/' + resourceId;
};

const currentResourceRel = function (rq) {
    let path = rq.route.path;
    return path.substring(path.lastIndexOf('/') + 1, path.length);
};
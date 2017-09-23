/**
 * Created by anthony on 23.09.17.
 */
const halson            = require('halson');
const log               = require('winston');
const sendResponse      = require('../utils/httpUtils').sendResponse;

exports.prepareUserResource = function (rq, rsp, next) {
    log.info('preparing user resource');

    let status = rq.locals.status;
    let headers = rq.locals.headers || {
        'Content-Type': 'application/hal+json'
    };

    let objectsList = [];
    let tmpResource = {};
    let resource = rq.locals.ret;

    if (resource) {
        let i = 0;
        while (i < resource.length) {
            objectsList.push(createHalson(resource[i], rq));
            i++;
        }
        tmpResource.content = objectsList;
        resource = halson(tmpResource)
            .addLink('search', {
                method: 'GET',
                link: rq.baseUrl + rq.route.path
            });
    }

    return sendResponse(rsp, status, resource, headers);
};

const createHalson = function(entity, rq) {
    let halsonEntity = halson(entity._doc)
        .addLink('self', {
            method: 'GET',
            link: linkToId(rq, entity.id)
        })
        .addLink('delete', {
            method: 'DELETE',
            link: linkToId(rq, entity.id)
        })
        .addLink('update', {
            method: 'PUT',
            link: linkToId(rq, entity.id)
        });
    return halsonEntity;
};

const linkToId = function(rq, endpoint) {
    return rq.baseUrl + '/users' + '/' + endpoint;
};
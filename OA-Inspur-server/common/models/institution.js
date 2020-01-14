'use strict';

module.exports = function(Institutions) { 
    Institutions.beforeRemote('create', function(context, user, next) {
        context.args.data.publisher_id = context.req.accessToken.userId;
        next();
    });
    Institutions.beforeRemote('replaceOrCreate', function(context, user, next) {
        let createTime;
        Institutions.findById(context.args.data.id, function(err, instance) {
            createTime = instance.create_time;
            context.args.data.create_time = createTime;
            context.args.data.update_time = new Date().toISOString();
            context.args.data.publisher_id = context.req.accessToken.userId;
            next();
        })
    });
    Institutions.beforeRemote('replaceById', function(context, user, next) {
        let createTime;
        Institutions.findById(context.args.data.id, function(err, instance) {
            createTime = instance.create_time;
            context.args.data.create_time = createTime;
            context.args.data.update_time = new Date().toISOString();
            context.args.data.publisher_id = context.req.accessToken.userId;
            next();
        })
    });
};

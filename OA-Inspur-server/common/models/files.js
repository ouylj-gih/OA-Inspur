'use strict';
const _async = require('async');
const CONTAINER_URL = '/static/';

module.exports = function (Files) {

  function defineUploadModel(app, cb) {
    const uploadModel = {
      type: {
        type: "string",
        required: true,
        description: "image/jpeg"
      },
      name: {
        type: "string",
        required: true,
        description: "name-1651651.jpg"
      },
      url: {
        type: "string",
        required: true,
        description: "/api/files/{}/name-1651651.jpg"
      },
      container: {
        type: "string",
        required: true,
        description: "{}"
      },
      size: {
        type: "number",
        required: true,
        description: "15616"
      }
    };

    var ds = app.datasources.db;
    ds.define('uploadModel', uploadModel, {
      idInjection: false
    });
    cb(null, app);
  }

  function defineUpload(app, cb) {
    Files.upload = function (ctx, options, cb) {
      options = options || {};
      if (!ctx.req.params.container) ctx.req.params.container = 'portrait';

      // function upload() {
      Files.app.models.Container.upload(ctx.req, ctx.result, options, function (err, fileObj) {
        if (err) {
          return cb(null, {
            status: 'failed',
            message: err.message,
          });
        } else {
          // 此处 “file” 应当与表单中的 field name 相同
          var fileInfoArr = fileObj.files.file;
          var objs = [];
          fileInfoArr.forEach(function (item) {
            objs.push({
              name: item.name,
              type: item.type,
              size: item.size,
              container: item.container,
              url: CONTAINER_URL + item.container + '/' +
                item.name,
            });
          });

          cb(null, objs);
        }
      });
    };

    Files.remoteMethod(
      'upload', {
        description: 'Upload a file or more files',
        accepts: [
          {arg: 'ctx', type: 'object', http: {source: 'context'}},
          {arg: 'options', type: 'object', http: {source: 'query'}},
        ],
        returns: {
          arg: 'result', type: 'uploadModel', root: true,
        },
        http: {verb: 'post',path: '/:container/upload'},
      }
    );

    cb(null, app);
  }

  function defineFilesAllModel(app, cb) {
    const filesAllModel = [{
      type: {
        type: "string",
        required: true,
        description: "image/jpeg"
      },
      name: {
        type: "string",
        required: true,
        description: "name-1651651.jpg"
      },
      url: {
        type: "string",
        required: true,
        description: "/api/files/{}/name-1651651.jpg"
      },
      container: {
        type: "string",
        required: true,
        description: "{}"
      },
      size: {
        type: "number",
        required: true,
        description: "15616"
      }
    }];

    var ds = app.datasources.db;
    ds.define('filesAllModel', filesAllModel, {
      idInjection: false
    });
    cb(null, app);
  }
  function defineFilesAll(app, cb) {
    Files.filesAll = function (ctx, options, cb) {
      Files.app.models.Container.getFiles(ctx, null, function (err, arrFiles) {
        console.log(JSON.stringify(arrFiles));
        if (err) {
          return cb(null, {
            status: 'failed',
            message: err.message,
          });
        } else {
          var objs = [];
          arrFiles.forEach(function (item) {
            objs.push({
              name: item.name,
              type: item.name.substring(item.name.lastIndexOf('.')),
              size: item.size,
              container: item.container,
              url: CONTAINER_URL + item.container + '/' +
                item.name,
            });
          });

          cb(null, objs);
        }
      });
    };

    Files.remoteMethod('filesAll', {
        description: '获取封面轮播图，公告图，通知文档，静态图片集合等',
        shared: true,
        accepts: [{
          arg: 'container',
          type: 'string',
          http: {
            source: 'path'
          }
        }, {
          arg: 'res',
          type: 'object',
          http: {
            source: 'res'
          }
        }],
        returns: [{arg: 'result', type: 'uploadModel', root: true,}],
        http: {verb: 'get',path: '/:container/filesAll'},
      }
    );

    cb(null, app);
  }


  _async.waterfall([
    Files.getApp.bind(Files),
    defineUploadModel,
    defineUpload,
    defineFilesAllModel,
    defineFilesAll,
  ])
}
;

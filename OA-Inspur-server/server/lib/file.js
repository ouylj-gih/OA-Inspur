"use strict";

const formidable = require('formidable');
const fs = require('fs');
const path = require("path");

let config = {};
config.maxSize = 100000000000;
config.uploadDir = '/home/liuchengjun/project/wechat-shopping-mall/wechat-shopping-mall-server/server/storage/';
config.ext = ['png', 'jpeg', 'jpg', 'txt', 'css', 'js', 'zip'];

/**
 * 文件上传
 * @param {*} request object request对象
 * @param {*} name 上传表单的name
 * @param {*} dir 上传目录下的存储路径
 * @param {*} callback 
 */
function upload(request, name, dir, callback) {
    let form = new formidable.IncomingForm();

    // 多文件上传开启
    form.multiples = true;

    //是否包含文件后缀
    form.keepExtensions = true;

    form.parse(request, function (error, fields, files) {
        if (error) {
            return callback(error, null);
        }
        if (files.hasOwnProperty(name)) {
            let file = files[name];
            if (!(file instanceof Array)) {
                /* 多文件上传 */
                file = [file];
            }

            let fileData = [];
            let wrong = [];

            /* 校验文件 */
            file.forEach(function (elem) {
                if (elem.size > config.maxSize) {
                    wrong.push('文件名称为' + elem.name + '的文件超过文件上传的大小限制');
                } else if (!in_array(getFileExtName(elem.name), config.ext)) {
                    wrong.push('文件名称为' + elem.name + '的文件后缀名不允许上传');
                }
                fileData.push({
                    name: elem.name,
                    type: elem.type,
                    size: elem.size,
                    path: elem.path
                });
            });

            if (wrong.length === 0) {
                let result = [];
                fileData.forEach(function (element) {
                    let newFileName = createNewFileName(getFileExtName(element.name));
                    if (mkdirsSync(config.uploadDir + dir)) {
                        let newFilePath = config.uploadDir + dir + newFileName;
                        fs.renameSync(element.path, newFilePath);
                        result.push({
                            realName: element.name,
                            fileName: newFileName,
                            size: element.size,
                            fileRealPath: config.uploadDir + dir + newFileName,
                            filePath: newFilePath
                        });
                    } else {
                        return callback('目录生成失败', null);
                    }
                });
                return callback(null, result);
            } else {
                /* 有文件不符合配置 */
                return callback(wrong.join(','), null);
            }
        } else {
            return callback('该name非上传input', null);
        }
    });
}

/**
 * 
 */
function getHtml() {
    let html = '';
}

/**
 * 获取文件后缀名
 * @param {*} filename string 文件名称
 */
function getFileExtName(filename) {
    let array = filename.split('.');
    return array[array.length - 1];
}

/**
 * 创建新文件名
 * @param {*} ext string 文件后缀名
 */
function createNewFileName(ext) {
    let timestamp = new Date().getTime();
    return timestamp + randomChar(5) + '.' + ext;
}

/**
 * 判断数组中是否有制定值
 * @param {*} search 
 * @param {*} arr 
 * @returns bool
 */
function in_array(search, arr) {
    let s = String.fromCharCode(2);
    let r = new RegExp(s + search + s);
    return (r.test(s + arr.join(s) + s));
}

/**
 * 递归创建目录 异步方法 
 * @param {*} dirname 
 * @param {*} callback 
 */
function mkdirs(dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (exists) {
            callback();
        } else {
            mkdirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback);
            }
            );
        }
    });
}

/**
 * 递归创建目录 同步方法
 * @param {*} dirname 
 */
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

/**
 * 生成随机长度的字符串
 * @param {*} length 
 */
function randomChar(length) {
    length = parseInt(length);
    let tmp = "0123456789qwertyuioplkjhgfdsazxcvbnm";
    let result = '';
    for (let i = 0; i < length; i++) {
        result += tmp.charAt(Math.ceil(Math.random() * 100000000) % tmp.length);
    }
    return result;
}

module.exports = {
    upload: upload,
    mkdirsSync: mkdirsSync,
    randomChar: randomChar,
    createNewFileName: createNewFileName,
    getFileExtName: getFileExtName
};
'use strict';

var fs = require('fs');

function clientError(msg, code) {
    var err = new Error(msg);
    err.code = code;
    err.statusCode = 400;
    return err;
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

//判断上传文件类型
function checkUploadFile(imgInfo) {
    var fileExtension = "png";
    var imgType = imgInfo.match(/data:(\S*);/);
    if (imgType == null) {
        return '上传文件格式不正确!';
    }
    if (imgType[1] == "image/jpeg" || imgType[1] == "image/png" || imgType[1] == "image/jpg") {
        if (imgType[1] == "image/png") {
            fileExtension = "png";
        } else {
            fileExtension = "jpg";
        }
    }
    else {
        return '请上传正确格式的图片(eg:image/png,image/jpg)!';
    }
    return fileExtension;
}
//文件上传
function uploadWriteFile(imgInfo, fileRealPath) {
    var flag = false;
    //过滤data:URL
    var base64Data = imgInfo.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile(fileRealPath, dataBuffer, function (err) {
        if (err) {
            return false;
        } else {
            return true;
        }
    });
}

/**
 * 去除字符串两端空格
 * @param {*} str 
 */
function trim(str) {
    if (typeof (str) === 'string') {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }
    return str;
};

function array_column(array, field1, field2) {
    if (array instanceof Array && array.length !== 0) {
        let result = [];
        array.forEach(function (elem) {
            if (field1 instanceof Array && field1.length !== 0) {
                field1.forEach(function (e) {
                    result[elem[field2]] = elem[e];
                });
            } else {
                result[elem[field2]] = elem[field1];
            }
        });
        return result;
    } else {
        return [];
    }
}

function createRandomNumber(n) {
    let randomNumber = "";
    for (var i = 0; i < n; i++) {
        randomNumber += Math.floor(Math.random() * 10);
    }
    return randomNumber;
}

function compare(property) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
    }
}

function keysort(key, sortType) {
    return function (a, b) {
        return sortType ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
    }
}

module.exports = {
    clientError: clientError,
    in_array: in_array,
    checkUploadFile: checkUploadFile,
    uploadWriteFile: uploadWriteFile,
    trim: trim,
    array_column: array_column,
    createRandomNumber: createRandomNumber,
    compare: compare,
    keysort: keysort
}

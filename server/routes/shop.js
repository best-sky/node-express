var express = require('express');
var router = express.Router();
var db = require('./db.js');
//处理表单
var formidable = require('formidable');
//添加商品
router.post("/add", function (req, res, next) {
    if (req.session.user) {
        var form = new formidable.IncomingForm();
        form.encoding = "utf-8";
        form.uploadDir = "public/shop/";
        form.keepExtensions = true;
        form.maxFieldsSize = 1 * 1024 * 1024;
        form.maxFields = 1000;
        form.parse(req, function (err, fields, files) {
            if (!err) {
                db("find", "shoplist", {}, function (result) {
                    let shopImg = files[Object.getOwnPropertyNames(files)[0]].path;
                    // console.log(fields);
                    let data = {
                        shopName: fields.shopName,
                        shopTitle: fields.shopTitle,
                        shopPrice: {
                            old: fields.shopOldPrice,
                            new: fields.shopNewPrice,
                        },
                        shopClassify: fields.shopClassify,
                        shopImg: shopImg.slice(12),
                        shopId: result.length + 1,
                        shopDescribe: fields.shopDescribe,
                        shopPutaway: fields.shopPutaway,
                        shopInventory: fields.shopInventory,
                        shopProperty: fields.shopProperty
                    };
                    db("insertOne", "shoplist", data, function (result) {
                        if (result.result.n == 1) {
                            res.send({
                                "msg": "操作成功",
                                "code": 1
                            });
                        } else {
                            res.send({
                                "msg": "操作失败",
                                "code": 0
                            });
                        }
                    });
                });
            } else {
                res.send({
                    "msg": "文件上传失败",
                    "code": 0
                });
            }
        })
    } else {
        res.send({
            'msg': '登录信息发生丢失,请重新登录',
            "code": 0
        });
    }
});
//商品列表,搜索
router.post("/shoplist", function (req, res, next) {
    if (req.session.user && req.body.userId != "") {
        // console.log(req.body.shopClassify);
        // console.log(req.body.shopName);
        var data = {};
        if (req.body.shopClassify == "" && req.body.shopName == "") {
            data = {
                shopName: {
                    $regex: '.*' + req.body.shopName + '.*'
                }
            };
        } else if (req.body.shopClassify != "" && req.body.shopName != "") {
            //查询条件都在就一起查询
            data = {
                shopName: {
                    $regex: '.*' + req.body.shopName + '.*'
                },
                shopClassify: String(req.body.shopClassify)
            };
        } else if (req.body.shopClassify != "" && req.body.shopName == "") {
            data = {
                shopClassify: String(req.body.shopClassify)
            };
        } else {
            //否则，就查询单个条件
            data = {
                $or: [{
                    shopName: {
                        $regex: '.*' + req.body.shopName + '.*'
                    }
                }, {
                    shopClassify: String(req.body.shopClassify)
                }]
            };
        }
        // console.log(data);
        db("find", "shoplist", data, function (result) {
            // console.log(result)
            let pageSize = Number(req.body.pageSize); //每页条数
            let lastPage = result.length % pageSize == 0 ? result.length / pageSize : Math.ceil(result.length / pageSize);
            let pagination = Number(req.body.pagination);
            let data = req.body.pagination == 1 ? result.slice(0, pageSize * pagination) : result.slice(pageSize * (pagination - 1), pageSize * pagination);
            if (result.length < 1) {
                res.send({
                    "msg": "暂无数据",
                    "code": 0,
                    "data": {
                        "lastPage": lastPage, //最大页数
                        "pagination": pagination, //第几页,页码
                        "shoplist": data
                    }
                });
            } else {
                res.send({
                    "msg": "获取成功",
                    "code": 1,
                    "data": {
                        "lastPage": lastPage, //最大页数
                        "pagination": pagination, //第几页,页码
                        "shoplist": data
                    }
                });
            }
        });
    } else {
        res.send({
            'msg': '登录信息发生丢失,请重新登录',
            "code": 0
        });
    }
});
router.post("/shoplist/delete", function (req, res, next) {
    // console.log(req.query.shopId) 接受get请求参数
    // console.log(req)
    // console.log(req.body.shopId)
    // console.log(req.query.shopId)
    if (req.session.user) {
        let data = {
            shopId: Number(req.body.shopId)
        };
        db("deleteOne", "shoplist", data, function (result) {
            if (result.result.n == 0) {
                res.send({
                    "msg": "删除失败",
                    "code": 0
                });
            } else {
                res.send({
                    "msg": "删除成功",
                    "code": 1
                });
            }
        })
    } else {
        res.send({
            'msg': '登录信息发生丢失,请重新登录',
            "code": 0
        });
    }
})
module.exports = router;
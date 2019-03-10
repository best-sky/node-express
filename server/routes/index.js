var express = require('express');
var router = express.Router();
var db = require("./db.js");
//加密算法
var crypto = require('crypto');

/* GET home page. */
//用户列表
router.post('/userlist', function(req, res, next) {
    if (req.session.user && req.body.userId != null) {
        db("find", "userslist", {}, function(result) {
            let pageSize = Number(req.body.pageSize); //每页条数
            let lastPage = result.length % pageSize == 0 ? result.length / pageSize : Math.ceil(result.length / pageSize);
            let pagination = Number(req.body.pagination);
            let data = req.body.pagination == 1 ? result.slice(0, pageSize * pagination) : result.slice(pageSize * (pagination - 1), pageSize * pagination);
            if (result.length < 1) {
                res.send({
                    "msg": "暂无数据",
                    "code": 0,
                });
            } else {
                res.send({
                    "msg": "获取成功",
                    "code": 1,
                    "data": {
                        "lastPage": lastPage, //最大页数
                        "pagination": pagination, //第几页,页码
                        "userlist": data
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
//按条件搜索用户
router.post('/userlist/find', function(req, res, next) {
    if (req.session.user && req.body.userId != null) {
        var data = {};
        // console.log(req.body.power);
        // 这边需要注意的是会打印true
        // console.log(0 == "");
        if (req.body.power == "" && req.body.userName == "") {
            data = {
                userName: {
                    $regex: '.*' + req.body.userName + '.*'
                }
            };
        } else if (req.body.power != "" && req.body.userName != "") {
            //查询条件都在就一起查询
            data = {
                userName: {
                    $regex: '.*' + req.body.userName + '.*'
                },
                power: req.body.power
            };
        } else if (req.body.power != "" && req.body.userName == "") {
            data = {
                power: req.body.power
            };
        } else {
            //否则，就查询单个条件
            data = {
                $or: [{
                    userName: {
                        $regex: '.*' + req.body.userName + '.*'
                    }
                }, {
                    power: req.body.power
                }]
            };
        }
        // console.log(data);
        db("find", "userslist", data, function(result) {
            // console.log(result)
            let pageSize = Number(req.body.pageSize); //每页条数
            let lastPage = result.length % pageSize == 0 ? result.length / pageSize : Math.ceil(result.length / pageSize);
            let pagination = 1;
            let information = req.body.pagination == 1 ? result.slice(0, pageSize * pagination) : result.slice(pageSize * (pagination - 1), pageSize * pagination);
            if (result.length < 1) {
                data = {};
                res.send({
                    "msg": "未找到与之匹配的结果",
                    "code": 0,
                    "data": {
                        "lastPage": lastPage, //最大页数
                        "pagination": pagination, //第几页,页码
                        "userlist": information
                    }
                });
            } else {
                data = {};
                res.send({
                    "msg": "获取成功",
                    "code": 1,
                    "data": {
                        "lastPage": lastPage, //最大页数
                        "pagination": pagination, //第几页,页码
                        "userlist": information
                    }
                });
            }
        });
    }
});
//删除用户
router.post('/userlist/delete', function(req, res, next) {
    if (req.session.user && req.body.userId != null) {
        db("deleteOne", "userslist", {
                userId: Number(req.body.user_id)
            },
            function(result) {
                if (result.result.n == 0) {
                    res.send({
                        "msg": "删除失败",
                        "code": 0
                    });
                } else {
                    res.send({
                        "msg": req.session.user.userId == 1 ? "删除成功" : "成功注销账号",
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
});
//添加用户
router.post('/userlist/add', function(req, res, next) {
    let regPhone = /^1[3456789]\d{9}$/;
    let regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (req.session.user && req.body.userId != null) {
        if (req.body.userName == null || req.body.nickName == null || req.body.email == null || req.body.power == null || req.body.loginPass == null || req.body.sex == null) {
            res.send({
                "msg": "请将信息填写完整",
                "code": 0
            });
        } else if (regPhone.test(req.body.userName) == false) {
            res.send({
                "msg": "请使用手机号进行注册",
                "code": 0
            });
        } else if (regEmail.test(req.body.email) == false) {
            res.send({
                "msg": "邮箱格式错误",
                "code": 0
            });
        } else {
            db("find", "userslist", {
                userName: req.body.userName
            }, function(result) {
                if (result.length > 0) {
                    res.send({
                        "msg": "该账号已经被注册",
                        "code": 0
                    })
                } else {
                    db('find', "userslist", {}, function(result) {
                        let md5 = crypto.createHash('md5');
                        let loginPass = md5.update(req.body.loginPass).digest('base64');
                        let data = {
                            createAt: new Date(),
                            userId: result.length + 1, //用户id
                            headSrc: "apple.png", //用户头像
                            sex: Number(req.body.sex),
                            userName: req.body.userName,
                            nickName: req.body.nickName,
                            loginPass: loginPass,
                            email: req.body.email,
                            power: Number(req.body.power),
                            cold: 1
                        };
                        db("insertOne", "userslist", data, function(result) {
                            //console.log(result);
                            res.send({
                                "msg": "添加成功",
                                "code": 1
                            });
                        });
                    });
                };
            });
        }
    } else {
        res.send({
            'msg': '登录信息发生丢失,请重新登录',
            "code": 0
        });
    }
});
//修改用户信息
router.post('/userlist/change', function(req, res, next) {
    if (req.session.user && req.body.userId != null) {
        let data = [{
                userId: Number(req.body.user_id)
            },
            {
                $set: {
                    nickName: req.body.nickName,
                    sex: req.body.sex
                }
            }
        ];
        db("updateOne", "userslist", data, function(result) {
            //console.log(result)
            if (result.result.n == 1) {
                res.send({
                    "msg": "修改成功",
                    "code": 1
                });
            } else {
                res.send({
                    "msg": "修改失败",
                    "code": 0
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
//账号冻结
router.post('/userlist/frost', function(req, res, next) {
    if (req.session.user && req.body.userId != null) {
        let data = [{
                userId: Number(req.body.user_id)
            },
            {
                $set: {
                    cold: 2,
                }
            }
        ];
        db("updateOne", "userslist", data, function(result) {
            // console.log(result)
            if (result.result.n == 1) {
                res.send({
                    "msg": "冻结成功",
                    "code": 1
                });
            } else {
                res.send({
                    "msg": "冻结失败",
                    "code": 0
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
module.exports = router;
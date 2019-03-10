var express = require('express');
var router = express.Router();
var db = require("./db.js");
//处理表单
var formidable = require('formidable');
//加密算法
var crypto = require('crypto');
//发送邮件
var nodemailer = require("nodemailer");
//文件读取
var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;
//创建user对象，用于session存储用户信息
function User(user) {
    this.id = user.id;
    this.name = user.userName;
    this.password = user.loginPass;
    this.veri = user.veri;
};
/* GET users listing. */
//用户注册
router.post('/registered', function(req, res, next) {
    let regPhone = /^1[3456789]\d{9}$/;
    let regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (req.body.userName == "" || req.body.loginPass == "") {
        res.send({
            "msg": "请输入你的账号和密码",
            "code": 0
        });
    } else if (req.body.loginPass != req.body.confirmPass) {
        res.send({
            "msg": "两次密码输入不一致",
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
            //文档插入时间
            //			console.log(result[0]._id.getTimestamp());
            //防止用户第一次注册不了
            result[0] == undefined ? result.push({
                "userName": ""
            }) == "" : "";
            if (result[0].userName == req.body.userName) {
                res.send({
                    "msg": "该账号已经注册",
                    "code": 0
                });
            } else {
                //让用户id随数据库长度增加自增(生成用户唯一标示)
                db("find", "userslist", {}, function(result) {
                    var md5 = crypto.createHash('md5');
                    var loginPass = md5.update(req.body.loginPass).digest('base64');
                    let data = {
                        createAt: new Date(), //注册时间
                        userId: result.length + 1, //用户id
                        sex: 1, //1为男性2为女性
                        userName: req.body.userName, //账号
                        loginPass: loginPass, //密码
                        nickName: req.body.userName, //默认用户名
                        email: req.body.email, //用户邮箱
                        headSrc: "apple.png", //用户头像
                        power: req.body.userName == "18702631413" ? 1 : 2, //1为超级管理员
                        // 账号状态1为正常2为被冻结
                        cold: 1
                    };
                    db("insertOne", "userslist", data, function(result) {
                        //	console.log(result);
                        res.send({
                            "msg": "注册成功",
                            "code": 1
                        });
                    })
                });
            }
        })
    }
});
//用户登录
router.post('/login', function(req, res, next) {
    let reg = /^1[3456789]\d{9}$/;
    let data = {
        userName: req.body.userName
    };
    if (data.userName == "" || data.loginPass == "") {
        res.send({
            "msg": "请输入你的账号和密码",
            "code": 0
        });
    } else if (reg.test(data.userName) == false) {
        res.send({
            "msg": "输入的账号格式不正确",
            "code": 0
        });
    } else {
        db("find", "userslist", data, function(result) {
            // console.log(result);
            if (result.length == 0) {
                res.send({
                    "msg": "该账号尚未注册",
                    "code": 0
                });
            } else if (result[0].cold == 2) {
                res.send({
                    "msg": "账号异常,请联系客服进行处理",
                    "code": 0
                });
            } else {
                //保存用户登录状态
                let md5 = crypto.createHash('md5');
                let loginPass = md5.update(req.body.loginPass).digest('base64');
                let newUser = new User({
                    userName: req.body.userName,
                    loginPass: loginPass,
                    id: result[0]._id,
                    veri: ""
                });
                req.session.user = newUser;
                //验证密码是否正确
                if (result[0].loginPass != loginPass) {
                    res.send({
                        "msg": "密码错误",
                        "code": 0,
                    });
                } else {
                    //console.log(req.session.user)
                    res.send({
                        "msg": "登录成功",
                        "code": 1,
                        "userId": result[0].userId,
                        "power": result[0].power
                    });
                }
            }
        })
    }
});
//获取验证码
router.post('/getCode', function(req, res, next) {
    let str = 'ABCEFGHJKLMNPQRSTWXY123456789';
    let Code = "";
    let data = {
        userName: req.body.userName
    };
    if (data.userName == "") {
        res.send({
            "msg": "请输入你要找回密码的账号",
            "code": 0
        })
    } else {
        function setCode(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        };
        for (let i = 0; i < 4; i++) {
            let text = str[setCode(0, str.length)];
            Code += text;
        };
        db("find", "userslist", data, function(result) {
            if (result.length < 1) {
                res.send({
                    "msg": "该账号不存在",
                    "code": 0
                });
            } else {
                //配置邮件
                var transporter = nodemailer.createTransport({
                    service: "QQ",
                    auth: {
                        user: '1104735883@qq.com', //发送邮件的邮箱
                        pass: 'pvntuortkkzqibhh', //第三方授权密码，不是qq邮箱密码，在发送邮箱里面设置，后面有方法
                    }
                });
                //发送邮件
                var sendmail = function() {
                    var option = {
                        from: "1104735883@qq.com", //发送邮件的邮箱
                        to: result[0].email //目标邮箱
                    };
                    option.subject = '李洋的后台';
                    option.html = "您的验证码为：" + Code + "</br> " + '有效期10分钟,请勿泄露给他人';
                    transporter.sendMail(option, function(error, response) {
                        if (error) {
                            console.log("fail: " + error);
                        } else {
                            req.session.user = {};
                            req.session.user.veri = Code;
                            //							console.log(req.session.user);
                            setTimeout(() => { //设置验证码过期时间
                                req.session.user.veri = "";
                            }, 600000);
                            res.send({
                                "msg": "验证码成功,请前往注册时绑定的邮箱查看",
                                "code": 1,
                            });
                        }
                    });
                }();
            }
        })
    }
});
//确认验证码,验证身份
router.post('/affirmCode', function(req, res, next) {
    if (req.body.userName == "" || req.body.veri == "") {
        res.send({
            "msg": "请输入要找回的账号和验证码",
            "code": 0
        });
    } else {
        if (req.body.veri === req.session.user.veri) {
            res.send({
                "msg": "身份验证成功",
                "code": 1,
                "veri": req.session.user.veri
            });
        } else {
            res.send({
                "msg": "验证码错误或者已过期",
                "code": 0
            });
        }
    }
});
//修改登录密码
router.post('/changeLoginPass', function(req, res, next) {
    if (req.body.newPass == "" || req.body.nextPass == "") {
        res.send({
            "msg": "请输入新密码",
            "code": 0
        });
    } else if (req.body.newPass != req.body.nextPass) {
        res.send({
            "msg": "两次密码输入不一致",
            "code": 0
        });
    } else if (req.body.veri != req.session.user.veri) {
        // console.log(req.body.veri);
        // console.log(req.session.user.veri);
        res.send({
            "msg": "验证信息已过期，请重新获取验证码",
            "code": 0
        });
    } else {
        var md5 = crypto.createHash('md5');
        var loginPass = md5.update(req.body.newPass).digest('base64');
        let data = [{ //查询条件
                userName: req.body.userName
            },
            {
                $set: { //要修改的字段
                    loginPass: loginPass
                }
            }
        ];
        db("updateOne", "userslist", data, function(result) {
            //			console.log(result)
            if (result.result.n == 1) {
                res.send({
                    "msg": "密码修改成功",
                    "code": 1
                });
            } else {
                res.send({
                    "msg": "密码修改失败",
                    "code": 0
                });
            }
        })
    }
});
//用户退出
router.post('/quit', function(req, res, next) {
    if (req.session.user) {
        req.session.user = {};
    };
    res.send({
        "msg": "退出成功",
        "code": 1
    });
});
router.post('/index', function(req, res, next) {
    if (req.session.user && req.body.userId != "") {
        //console.log(req.body.userId)
        //这边需要注意前端传过来的数据类型
        db("find", "userslist", {
            userId: Number(req.body.userId)
        }, function(result) {
            //			console.log(result)
            result[0].loginPass = "";
            //除登录密码外的数据都传回前端
            res.send({
                'msg': '用户信息获取成功',
                "code": 1,
                "data": result[0],
            });
        });
    } else {
        res.send({
            'msg': '登录信息发生丢失,请重新登录',
            "code": 0
        });
    }
});
//修改头像
router.post('/changeheadSrc', function(req, res, next) {
    if (req.session.user && req.body.userId != "") {
        var form = new formidable.IncomingForm(); //创建Formidable.IncomingForm对象
        form.encoding = 'utf-8'; //设置表单域的编码
        form.uploadDir = "public/img/"; // 设置上传文件存放的文件夹
        form.keepExtensions = true; // 设置该属性为true可以使得上传的文件保持原来的文件的扩展名
        form.maxFieldsSize = 2 * 1024 * 1024; // 限制所有存储表单字段域的大小（除去file字段），如果超出，则会触发error事件，默认为2M
        form.maxFields = 1000; // 设置可以转换多少查询字符串，默认为1000
        // 方法会转换请求中所包含的表单数据，callback会包含所有字段域和文件信息
        form.parse(req, function(error, fields, files) {
            // 获取到的文件  console.log(files);
            //表单其他附加字段  console.log(fields.userId);
            if (!error) {
                var imgSrc = {
                    cacheName: files[Object.getOwnPropertyNames(files)[0]].path
                };
                let data = [{ //查询条件
                        userId: Number(fields.userId)
                    },
                    {
                        $set: { //要修改的字段
                            headSrc: imgSrc.cacheName.slice(11)
                        }
                    }
                ];
                console.log(data);
                db("updateOne", "userslist", data, function(result) {
                    if (result.result.n == 1) {
                        res.send({
                            "msg": "头像修改成功",
                            "headSrc": imgSrc.cacheName.slice(11),
                            "code": 1
                        });
                    } else {
                        res.send({
                            "msg": "头像修改失败",
                            "code": 0
                        });
                    }
                });
            } else {
                res.send({
                    "msg": "文件上传失败",
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
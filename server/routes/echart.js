var express = require('express');
var router = express.Router();
var db = require("./db.js");
//用户统计
router.post('/echart', function (req, res, next) {
    if (req.session.user && req.body.userId != null) {
        let echartData = [{
            value: 0, name: "普通用户"
        }, {
            value: null, name: "普通管理员"
        }, {
            value: null, name: "超级管理员"
        },
        ]
        db("find", "userslist", { power: 2 }, function (result) {
            echartData[1].value = result.length;
        });
        db("find", "userslist", { power: 1 }, function (result) {
            echartData[2].value = result.length;
        });
        function timeout(ms) {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, ms, echartData);
            });
        }
        timeout(100).then((value) => {
            //  console.log(value);
            res.send({
                "code": 1,
                "echartData": value
            });
        });
    } else {
        res.send({
            'msg': '登录信息发生丢失,请重新登录',
            "code": 0
        });
    }
})
module.exports = router;
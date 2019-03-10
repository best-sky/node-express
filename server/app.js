var createError = require('http-errors');
// 加载express框架
var express = require('express');
//  加在path 模块 处理路径的一个模块
var path = require('path');
// 处理cookie的
var cookieParser = require('cookie-parser');
//处理session
var session = require('express-session');
//处理日志
var logger = require('morgan');
// 加载  处理history请求的   //处理vue项目打包后的dist文件
var history = require('connect-history-api-fallback');
//跨域
var cors = require('cors');
//代理模块
var proxy = require('http-proxy-middleware');
//加载路由(后台接口)模块
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var echartRouter = require('./routes/echart');
var shopRouter = require('./routes/shop');


var app = express();


// 视图引擎设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// 使用上面加载的模块
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
// 使用 bodyParser  处理post 请求的数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// 使用处理history的请求的中间件  
app.use(history());
//注意 ： 放置在静态资源的上方
// 静态资源托管的中间件
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', proxy({
//	target: 'http://localhost:3000', //请求地址
//	changeOrigin: true,
//	pathRewrite: {
//		'^/': '', // 重写请求，比如我们源访问的是api/old-path，那么请求会被解析为/api/new-path
//	},
//}));
// app.listen(8080); //代理后请求地址或端口
// catch 404 and forward to error handler	

app.use(session({
    "name": "LIYANG", // 设置cookie的名称，他有个默认的 connect.sid
    "secret": "LIYANG", // 设置加密的字符串，它是一个必须的属性
    "cookie": {
        maxAge: 8000000000
    }, //设置cookie的失效时间
    "resave": false, // 每次请求是否重新设置session
    "saveUninitialized": false //每次请求是否初始化
}));
//启用加载的路由(后台接口),后台接口地址为该地址+路由文件地址组成
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/echart', echartRouter);
app.use('/shop', shopRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
//session应该放置在路由文件上面

// 解决用ajax   跨域和调取数据后在控制台显示乱码的问题
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization,Origin,Accept,X-Requested-With,XMLHttpRequest');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('X-Powered-By', ' 3.2.1');
    res.header('Content-Type', 'application/json;charset=utf-8');
});


app.use(cors);

module.exports = app;

// 启动聊天服务器
var ws = require("nodejs-websocket");
console.log("开始建立连接...")

var game1 = null, game2 = null, game1Ready = false, game2Ready = false;
var server = ws.createServer(function (conn) {
    conn.on("text", function (str) {
        console.log("收到的信息为:" + str)
        if (str === "game1") {
            game1 = conn;
            game1Ready = true;
            conn.send("success");
        }
        if (str === "game2") {
            game2 = conn;
            game2Ready = true;
        }
        if (game1Ready && game2Ready) {
            game2.sendText(str);
        }

        conn.sendText(str)
    })
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
}).listen(9000)
console.log("WebSocket建立完毕");
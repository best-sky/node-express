import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import login from '@/components/login'
import registered from '@/components/registered'
import forgetPass from '@/components/forgetPass'
import userslist from '@/components/userslist'
import shoplist from '@/components/shoplist'
import addshop from '@/components/addshop'
import chat from '@/components/chat'
import header from '@/components/common/Header'
Vue.use(Router)

export default new Router({
    mode: "history",
    routes: [{
        path: '*',
        redirect: "/login"
    }, {
        path: '/login',
        name: 'login',
        component: login,
    }, {
        path: '/registered',
        name: 'registered',
        component: registered,
        meta: {
            title: "用户注册"
        }
    }, {
        path: '/forgetPass',
        name: 'forgetPass',
        component: forgetPass,
        meta: {
            title: "忘记密码"
        }
    }, {
        path: '/header',
        name: 'header',
        component: header,
        meta: {
            title: "登录后头部组件"
        },
        children: [{
            path: '/index',
            name: 'index',
            component: index,
            meta: {
                title: "统计概览",
            }
        }, {
            path: '/userslist',
            name: 'userslist',
            component: userslist,
            meta: {
                title: "用户管理",
            }
        },
        {
            path: '/shoplist',
            name: 'shoplist',
            component: shoplist,
            meta: {
                title: "商品管理",
            },
        }, {
            path: '/addshop',
            name: 'addshop',
            component: addshop,
            meta: {
                title: "添加商品",
            }
        },{
            path: '/chat',
            name: 'chat',
            component: chat,
            meta: {
                title: "在线反馈",
            }
        }]
    }
    ]
})
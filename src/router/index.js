import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import ForgotPassword from '../views/ForgotPassword.vue'

const Amplify = require("aws-amplify");

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/password_reset',
        name: 'PasswordReset',
        component: ForgotPassword
    }, {
        path: '/password_refresh',
        name: 'PasswordRefresh',
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    Amplify.Auth.currentAuthenticatedUser().then((user) => {
        console.log("Authenticated")
        next()
    }).catch((e) => {
        console.log("Not authenticated")
        if (to.name !== 'Login') {
            console.log("to login")
            next("/login");
        } else {
            next();
        }
    });
});
export default router

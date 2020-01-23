import Vue from 'vue'
import VueRouter from 'vue-router'
import Movie from '../views/Movie.vue'
import Cinema from '../views/Cinema.vue'
import Moviedetail from '../components/movie/Moviedetail'
import Film from '../components/cinema/Film'
// import Ticket from '../components/cinema/Ticket'
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'movie',
        component: Movie
    },

    {
        path: '/moviedetail/:id',
        name: 'moviedetail',
        component: Moviedetail
    },
    {
        path: '/cinema/:id/film',
        name: 'film',
        component: Film,
        // children:[
        //     {
        //         path:':id/:k',
        //         name:'ticket',
        //         component:Ticket,
        //     }
        // ]
    },
    {
        path: '/cinema',
        name: 'cinema',

        component: () => import(/* webpackChunkName: "about" */ '../views/Cinema.vue')
    },
    {
        path: '/cinema/seafilm',
        name: 'seafilm',

        component: () => import(/* webpackChunkName: "about" */ '../components/cinema/SeaFilm')
    },
    {
        path: '/info',
        name: 'info',
        component: () => import('../views/Info.vue')
    },
    {
        path: '/user',
        name: 'user',
        component: () => import('../views/User.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../components/regiterLogin/Login.vue')
    },
    {
        path: '/location',
        name: 'location',
        component: () => import('../components/Location.vue')
    },
    {
        path: '/selcinema/:id',
        name: 'selcinema',
        component: () => import('../components/buy/selCinema.vue')
    },

]

const router = new VueRouter({
    routes
})

export default router

import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    { path: '/', name: 'Home', component: () => import('@/views/Admin.vue'), },

    { path: '/:catchAll(.*)', name: 'NotFound', component: () => import('@/components/notFound/notFound.vue'),},
]

const router = createRouter({
    routes,
    history: createWebHashHistory(),
})

export default router
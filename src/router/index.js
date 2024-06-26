import { createRouter, createWebHistory } from 'vue-router'
// import ExcelView from '@/views/ExcelView.vue'
// import FilesView from '@/views/FilesView.vue'
// import FileDetailsView from '@/views/FileDetailsView.vue'
// import LoginView from '@/views/LoginView.vue'
// import RegisterView from '@/views/RegisterView.vue'
import useAuthStore from '@/store/auth.js'


const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/LoginView.vue'),
    meta: {
      requireAuth: false
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '@/views/RegisterView.vue'),
    meta: {
      requireAuth: false
    }
  },
  {
    path: '/excel-create',
    name: 'excel-create',
    component: () => import(/* webpackChunkName: "excel-create" */ '@/views/ExcelView.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/files',
    name: 'files',
    component: import(/* webpackChunkName: "files" */ '@/views/FilesView.vue'),
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/files/:id',
    name: 'file-detail',
    component: import(/* webpackChunkName: "files-detail" */ '@/views/FileDetailsView.vue'),
    props: true,
    meta: {
      requireAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requireAuth) {
    if (auth.isAuth) {
      next();
    } else {
      next('/login');
    }
  }
  if (!to.meta.requireAuth) {
    if (auth.isAuth) {
      next('/excel-create');
    } else {
      next();
    }
  }
})

export default router

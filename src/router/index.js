import { createRouter, createWebHistory } from 'vue-router'
import ExcelView from '@/views/ExcelView.vue'
import FilesView from '@/views/FilesView.vue'
import FileDetailsView from '@/views/FileDetailsView.vue'

const routes = [
  {
    path: '/',
    name: 'excel-create',
    component: ExcelView
  },
  {
    path: '/files',
    name: 'files',
    component: FilesView
  },
  {
    path: '/files/:id',
    name: 'file-detail',
    component: FileDetailsView,
    props: true,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

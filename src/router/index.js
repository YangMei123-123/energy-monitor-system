import { createRouter, createWebHistory } from 'vue-router'

// 路由懒加载：使用动态 import() 实现按需加载
// Vite 会自动将每个页面拆分为独立的 chunk，仅首屏访问的 HomeView 会被打包进主 bundle
const HomeView = () => import('@/views/HomeView.vue')
const BuildingListView = () => import('@/views/BuildingListView.vue')
const BuildingDetailView = () => import('@/views/BuildingDetailView.vue')
const AnalysisView = () => import('@/views/AnalysisView.vue')
const SuggestionsView = () => import('@/views/SuggestionsView.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { title: '首页总览' }
  },
  {
    path: '/buildings',
    name: 'BuildingList',
    component: BuildingListView,
    meta: { title: '教学楼管理' }
  },
  {
    path: '/buildings/:id',
    name: 'BuildingDetail',
    component: BuildingDetailView,
    meta: { title: '楼栋详情' }
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: AnalysisView,
    meta: { title: '能耗分析' }
  },
  {
    path: '/suggestions',
    name: 'Suggestions',
    component: SuggestionsView,
    meta: { title: '节能建议' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：更新页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 校园能耗平台` : '校园能耗平台'
  next()
})

export default router

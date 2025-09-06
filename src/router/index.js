import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import FaqView from '../views/FaqView.vue';
import AboutView from '../views/AboutView.vue';
import ContactView from '../views/ContactView.vue';
import BlogView from '../views/BlogView.vue';
import BlogDetailView from '../views/BlogDetailView.vue';
import PricingView from '../views/PricingView.vue';
import UseCaseView from '../views/UseCaseView.vue';
import UseCaseDetailView from '../views/UseCaseDetailView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/faq',
    name: 'Faq',
    component: FaqView,
  },
  {
    path: '/about-us',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/contact-us',
    name: 'Contact',
    component: ContactView,
  },
  {
    path: '/blog',
    name: 'Blog',
    component: BlogView,
  },
  {
    path: '/blog-detail',
    name: 'BlogDetail',
    component: BlogDetailView,
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: PricingView,
  },
  {
    path: '/use-case',
    name: 'UseCase',
    component: UseCaseView,
  },
  {
    path: '/use-case-detail',
    name: 'UseCaseDetail',
    component: UseCaseDetailView,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
});

export default router;

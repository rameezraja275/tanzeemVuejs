import Vue from "vue";
import VueRouter from "vue-router";
import { validateToken } from "../utils/helpers";
import Layout from "../components/Layout";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: () => import("../pages/Dashboard/"),
    meta: { layout: Layout },
    beforeEnter(to, from, next) {
      if (validateToken()) {
        next();
      } else {
        next({
          name: "Login"
        });
      }
    }
  },
  {
    path: "/coa",
    name: "COA",
    component: () => import("../pages/COA/"),
    meta: { layout: Layout },
    beforeEnter(to, from, next) {
      if (validateToken()) {
        next();
      } else {
        next({
          name: "Login"
        });
      }
    },
    children: [
      {
        path: ":acccode",
        component: () => import("../pages/COA/Components/form"),
        meta: { layout: Layout }
      }
    ]
  },
  {
    path: "/accountconfig",
    name: "AccountConfig",
    component: () => import("../pages/AccountConfig"),
    meta: { layout: Layout },
    beforeEnter(to, from, next) {
      if (validateToken()) {
        next();
      } else {
        next({
          name: "Login"
        });
      }
    }
  },
  {
    path: "/voucherpost",
    name: "VoucherPost",
    component: () => import("../pages/VoucherPost"),
    meta: { layout: Layout },
    beforeEnter(to, from, next) {
      if (validateToken()) {
        next();
      } else {
        next({
          name: "Login"
        });
      }
    },
    children: [
      {
        path: ":vpid",
        component: () => import("../pages/VoucherPost/components/Table"),
        meta: { layout: Layout }
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../pages/Login/"),
    beforeEnter(to, from, next) {
      if (!validateToken()) {
        next();
      } else {
        next({
          name: "COA"
        });
      }
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

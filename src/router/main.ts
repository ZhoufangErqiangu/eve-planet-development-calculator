import { type RouteRaw } from ".";

export const mainRoute: RouteRaw[] = [
  {
    path: "/",
    redirect: "/p2-forecast",
  },
  {
    name: "home",
    path: "/home",
    component: async () => await import("../views/home/HomeView.vue"),
  },
  {
    name: "p2-forecast",
    path: "/p2-forecast",
    component: async () =>
      await import("../views/p2-forecast/P2ForecastView.vue"),
  },
];

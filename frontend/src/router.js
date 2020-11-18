import Vue from "vue";
import Router from "vue-router";
import PokemonsList from "@/views/List.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "PokemonsList",
      component: PokemonsList
    },
    {
      path: "/details/:id",
      name: "PokemonDetails",
      // route level code-splitting
      // this generates a separate chunk (pokemon-details.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "pokemon-details" */ "@/views/Details")
    },
    {
      path: "*",
      name: "Home",
      component: PokemonsList
    }
  ]
});

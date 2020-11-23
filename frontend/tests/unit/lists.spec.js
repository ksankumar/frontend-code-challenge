import { shallowMount, createLocalVue } from "@vue/test-utils";
import { createMockClient } from "mock-apollo-client";
import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import VueApollo from "vue-apollo";
import mockPokemonList from "../data/list.json";
import mockPokemonTypes from "../data/types.json";
import pokemonsQuery from "@/graphql/pokemons.query.gql";
import pokemonTypesQuery from "@/graphql/pokemonTypes.query.gql";
import localTestQuery from "@/graphql/localTest.query.gql";
import PokemonsComponent from "@/views/List";
import PokemonCard from "@/components/PokemonCard";
import NoDataComponent from "@/components/NoData";

const localVue = createLocalVue();

// let wrapper
const routes = [
  { path: "/", name: "PokemonsList", component: PokemonsComponent }
];
const router = new VueRouter({ routes });

Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(VueApollo);

describe("Pokemons List view", () => {
  let wrapper;
  let mockClient;
  let apolloProvider;
  let requestHandlers;

  const createComponent = (handlers, data) => {
    // We want to specify default handlers for different operations and overwrite them with passed handlers
    requestHandlers = {
      allPokeyMonsQueryHandler: jest.fn().mockResolvedValue(mockPokemonList),
      pokeyMonsTypesQueryHandler: jest.fn().mockResolvedValue(mockPokemonTypes),
      // allPokeyMonsQueryHandler: jest.fn().mockResolvedValue(mockPokemonList),
      ...handlers
    };

    mockClient = createMockClient({
      resolvers: {}
    });

    mockClient.cache.writeQuery({
      query: localTestQuery,
      data: {
        fetchLocalUser: {
          __typename: "Pokemon",
          name: "Test"
        }
      }
    });

    // Unfortunately, it's not possible to override handler already set
    // So we need to do all the work for setting handlers in the factory
    mockClient.setRequestHandler(
      pokemonsQuery,
      requestHandlers.allPokeyMonsQueryHandler
    );
    mockClient.setRequestHandler(
      pokemonTypesQuery,
      requestHandlers.pokeyMonsTypesQueryHandler
    );

    apolloProvider = new VueApollo({
      defaultClient: mockClient
    });
    wrapper = shallowMount(PokemonsComponent, {
      localVue,
      apolloProvider,
      router,
      data() {
        return {
          ...data
        };
      }
    });
  };

  afterEach(() => {
    wrapper.destroy();
    mockClient = null;
    apolloProvider = null;
  });
  // it("add a pokemon to favorite on Favorite mutation", async () => {
  //   createComponent();
  //   await wrapper.vm.$nextTick();
  //   await wrapper.vm.$nextTick();
  //   // Waiting for query promise to resolve and populate data
  //   try {
  //     wrapper
  //       .findAllComponents(PokemonCard)
  //       .at(0)
  //       .vm.makeFavorite({ id: "001", isFavorite: true });
  //     wrapper
  //       .findAllComponents(PokemonCard)
  //       .at(0)
  //       .vm.$emit("makeFavorite", { id: "001", isFavorite: true });
  //   } catch (e) {
  //     console.log(e);
  //   }
  //
  //   // expect(requestHandlers.deleteHeroMutationHandler).toHaveBeenCalledWith({
  //   //   name: "Anonymous Vue Hero"
  //   // });
  //   // await wrapper.vm.$nextTick();
  //   // await wrapper.vm.$nextTick();
  //   // wrapper
  //   //   .findAllComponents(PokemonCard)
  //   //   .at(0)
  //   //   .vm.$emit("makeFavorit1e", { isFavorite: true });
  //
  //   // expect(requestHandlers.addHeroMutationHandler).toHaveBeenCalledWith({
  //   //   hero: {
  //   //     ...newHeroMock
  //   //   }
  //   // });
  //
  //   // We wait for mutation promise to resolve and then we check if new hero is added to cache
  //   // await wrapper.vm.$nextTick();
  //   //
  //   // expect(
  //   //   mockClient.cache.readQuery({ query: allHeroesQuery }).allHeroes
  //   // ).toHaveLength(3);
  //   //
  //   // // We wait for one more tick for component to re-render updated cache data
  //   // await wrapper.vm.$nextTick();
  //   //
  //   // expect(wrapper.html()).toMatchSnapshot();
  //   // expect(wrapper.findAllComponents(VueHero)).toHaveLength(3);
  // });
  it("renders a loading block when query is in progress", async () => {
    createComponent();
    expect(requestHandlers.allPokeyMonsQueryHandler).toHaveBeenCalled();
    expect(wrapper.find(".test-loading").exists()).toBe(true);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders a list of 10 pokemons when query is resolved", async () => {
    createComponent();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".test-loading").exists()).toBe(false);
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.findAllComponents(PokemonCard)).toHaveLength(10);
  });

  it("renders a list of pokemon types when query is resolved", async () => {
    createComponent({
      pokeyMonsTypesQueryHandler: jest.fn().mockResolvedValue(mockPokemonTypes)
    });
    // For some reason, when we reject the promise, it requires +1 tick to render an error
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(requestHandlers.pokeyMonsTypesQueryHandler).toHaveBeenCalled();
    // expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders a message about no pokemons when heroes list is empty", async () => {
    createComponent({
      allPokeyMonsQueryHandler: jest
        .fn()
        .mockResolvedValue({ data: { pokemons: { edges: [] } } })
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".test-loading").exists()).toBe(false);
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.findAllComponents(NoDataComponent)).toHaveLength(1);
  });

  it("renders error if query fails", async () => {
    createComponent({
      allPokeyMonsQueryHandler: jest
        .fn()
        .mockRejectedValue(new Error("GraphQL error"))
    });
    // For some reason, when we reject the promise, it requires +1 tick to render an error
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.findAllComponents(NoDataComponent)).toHaveLength(1);
  });
});

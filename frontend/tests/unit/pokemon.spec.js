import { config, shallowMount, createLocalVue } from "@vue/test-utils";
import { createMockClient } from "mock-apollo-client";
import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import VueApollo from "vue-apollo";
import mockPokemonList from "../data/list.json";
import favoritePokemonMutation from "@/graphql/favoritePokemon.mutation.gql";
import unFavoritePokemonMutation from "@/graphql/unFavoritePokemon.mutation.gql";
import localTestQuery from "@/graphql/localTest.query.gql";
import PokemonCardComponent from "@/components/PokemonCard";
import PokemonDetails from "@/views/Details";

config.showDeprecationWarnings = false;
const localVue = createLocalVue();

const routes = [
  { path: "/details/:id", name: "PokemonDetails", component: PokemonDetails }
];
const router = new VueRouter({ routes });

Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(VueApollo);

describe("Pokemon component", () => {
  let wrapper;
  let mockClient;
  let apolloProvider;
  let requestHandlers;
  const createComponent = (handlers, data) => {
    // We want to specify default handlers for different operations and overwrite them with passed handlers
    requestHandlers = {
      favoritePokemonMutationHandler: jest
        .fn()
        .mockResolvedValue(mockPokemonList),
      unFavoritePokemonMutationHandler: jest
        .fn()
        .mockResolvedValue(mockPokemonList),
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
      favoritePokemonMutation,
      requestHandlers.favoritePokemonMutationHandler
    );
    mockClient.setRequestHandler(
      unFavoritePokemonMutation,
      requestHandlers.unFavoritePokemonMutationHandler
    );

    apolloProvider = new VueApollo({
      defaultClient: mockClient
    });

    wrapper = shallowMount(PokemonCardComponent, {
      localVue,
      apolloProvider,
      router,
      propsData: {
        pokemon: mockPokemonList.data.pokemons.edges[0]
      },
      data() {
        return {
          ...data
        };
      }
    });
  };

  afterEach(() => {
    //wrapper.destroy();
    mockClient = null;
    apolloProvider = null;
  });
  it("renders a pokemon component", async () => {
    createComponent();
    expect(wrapper.is(PokemonCardComponent)).toBe(true);
    expect(wrapper.vm).toBeTruthy();
    expect(
      wrapper.findComponent({ name: PokemonCardComponent.name }).exists()
    ).toBeTruthy();
  });

  it("renders message when component is created", () => {
    // check the name of the component
    expect(wrapper.text()).toContain("Bulbasaur");
    expect(wrapper.props().pokemon.name).toBe("Bulbasaur");
  });

  it("displayed pokemon correctly with query data", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("processes valid props data", () => {
    expect(wrapper.props().pokemon.name).toBe("Bulbasaur");
    expect(wrapper.props().pokemon.types.join(", ")).toBe("Grass, Poison");
    expect(wrapper.props().pokemon.isFavorite).toBe(false);
  });

  it("make a favorite pokemon", async () => {
    wrapper.vm.makeFavorite(wrapper.props().pokemon);
    expect(requestHandlers.favoritePokemonMutationHandler).toHaveBeenCalledWith(
      {
        id: "001"
      }
    );
  });
  it("check favorite icon has been changed", async () => {
    mockPokemonList.data.pokemons.edges[0].isFavorite = true;
    createComponent(
      {},
      {
        propsData: {
          pokemon: mockPokemonList.data.pokemons.edges[0]
        }
      }
    );
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("mdi-heart");
  });
  it("make a un-favorite pokemon", async () => {
    // wrapper.setData({ pokemon: mockPokemonList.data.pokemons.edges[0] });
    wrapper.vm.makeFavorite(wrapper.props().pokemon);
    expect(
      requestHandlers.unFavoritePokemonMutationHandler
    ).toHaveBeenCalledWith({
      id: "001"
    });
  });
  it("check un-favorite icon has been changed", async () => {
    mockPokemonList.data.pokemons.edges[0].isFavorite = false;
    createComponent(
      {},
      {
        propsData: {
          pokemon: mockPokemonList.data.pokemons.edges[0]
        }
      }
    );
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("mdi-heart-outline");
  });

  it("should navigate to Pokemon's details on click pokemon", async () => {
    const routerPushSpy = jest.spyOn(wrapper.vm.$router, "push");
    const id = wrapper.props().pokemon.id;

    wrapper.vm.goPokemonDetails(id);
    expect(routerPushSpy).toHaveBeenCalledWith({
      name: "PokemonDetails",
      params: { id: id }
    });
  });
});

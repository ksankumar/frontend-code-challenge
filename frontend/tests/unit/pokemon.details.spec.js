import { config, shallowMount, createLocalVue } from "@vue/test-utils";
import { createMockClient } from "mock-apollo-client";
import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import VueApollo from "vue-apollo";
import mockPokemonDetails from "../data/details.json";
import mockPokemonList from "../data/list.json";
import pokemonDetailsQuery from "@/graphql/pokemonDetails.query.gql";
import localTestQuery from "@/graphql/localTest.query.gql";
import PokemonDetails from "@/views/Details";

config.showDeprecationWarnings = false;
const localVue = createLocalVue();

const routes = [
  {
    path: "/details/123",
    name: "PokemonDetails",
    component: PokemonDetails
  }
];
const router = new VueRouter({ routes });
Vue.use(Vuetify);
Vue.use(VueRouter);
Vue.use(VueApollo);

describe("Pokemon Details view", () => {
  let wrapper;
  let mockClient;
  let apolloProvider;
  let requestHandlers;
  const createComponent = (handlers, data) => {
    // We want to specify default handlers for different operations and overwrite them with passed handlers
    requestHandlers = {
      pokemonDetailsQueryHandler: jest
        .fn()
        .mockResolvedValue(mockPokemonDetails),
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
      pokemonDetailsQuery,
      requestHandlers.pokemonDetailsQueryHandler
    );

    apolloProvider = new VueApollo({
      defaultClient: mockClient
    });

    wrapper = shallowMount(PokemonDetails, {
      localVue,
      apolloProvider,
      router,
      data() {
        return {
          ...data
        };
      }
    });
    wrapper.vm.$route.params["id"] = "001";
  };

  it("renders a pokemon details component", async () => {
    createComponent();
    expect(wrapper.is(PokemonDetails)).toBe(true);
    expect(wrapper.vm).toBeTruthy();
    expect(
      wrapper.findComponent({ name: PokemonDetails.name }).exists()
    ).toBeTruthy();
    expect(requestHandlers.pokemonDetailsQueryHandler).toHaveBeenCalled();
  });

  it("renders message when component is created", () => {
    expect(wrapper.text()).toContain("Bulbasaur");
  });

  it("displayed pokemon correctly with query data", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});

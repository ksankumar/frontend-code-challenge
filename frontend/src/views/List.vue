<template>
  <v-card flat height="100%" width="100%">
    <div class="overflow-hidden">
      <v-row no-gutters>
        <v-col cols="6" md="6" sm="6">
          <v-btn
            :outlined="isFavorite"
            block
            class="text-capitalize"
            color="primary"
            elevation="0"
            large
            tile
            @click.stop="
              isFavorite = false;
              reFetchPokemons();
            "
          >
            All
          </v-btn>
        </v-col>
        <v-col cols="6" md="6" sm="6">
          <v-btn
            :outlined="!isFavorite"
            block
            class="text-capitalize"
            color="primary"
            elevation="0"
            large
            tile
            @click.stop="
              isFavorite = true;
              reFetchPokemons();
            "
          >
            Favorites
          </v-btn>
        </v-col>
      </v-row>
      <v-row align="center" justify="space-around">
        <v-col cols="12" md="7" sm="6" class="pr-3">
          <v-text-field
            v-model.trim="pokemonName"
            clearable
            hide-details
            label="Search"
            outlined
            @input="onSearchPokemon"
          ></v-text-field>
        </v-col>
        <v-col cols="8" md="4" sm="4">
          <!--          <ApolloQuery-->
          <!--            v-slot="{ result: { data }, isLoading }"-->
          <!--            :query="require('../graphql/pokemonTypes.query.gql')"-->
          <!--          >-->
          <v-skeleton-loader
            v-if="$apollo.queries.pokemons.loading"
            type="list-item"
          ></v-skeleton-loader>
          <v-select
            v-else
            label="Type"
            class="selectable"
            :items="pokemonTypes"
            v-model="pokemonType"
            @change="reFetchPokemons"
            clearable
            hide-details
            outlined
          ></v-select>
          <!--          </ApolloQuery>-->
        </v-col>
        <v-col cols="4" md="1" sm="2">
          <v-row align="center" justify="space-around" no-gutters>
            <v-btn color="primary" icon large @click.stop="listView = true">
              <v-icon large>mdi-view-list</v-icon>
            </v-btn>
            <v-divider align="center" vertical></v-divider>
            <v-btn color="primary" icon large @click.stop="listView = false">
              <v-icon large>mdi-grid</v-icon>
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <v-divider class="elevation-10" />
    <v-card class="content-scroll" flat @scroll="onScroll">
      <template v-if="pokemons">
        <v-slide-x-transition
          v-if="pokemons.edges.length"
          :duration="250"
          mode="out-in"
        >
          <v-list v-if="listView" two-line>
            <v-list-item
              v-for="item in pokemons.edges"
              :key="item.id"
              class="mb-3 v-sheet--outlined"
            >
              <v-list-item-avatar>
                <v-img
                  :src="item.image"
                  class="text-right pa-2"
                  contain
                  height="300"
                >
                  <template v-slot:placeholder>
                    <v-row
                      align="center"
                      class="fill-height ma-0"
                      justify="center"
                    >
                      <v-progress-circular
                        color="primary"
                        indeterminate
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle v-html="item.types.join(', ')" />
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click.stop="makeFavorite(item)">
                  <v-icon color="red" size="30"
                    >{{ item.isFavorite ? "mdi-heart" : "mdi-heart-outline" }}
                  </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-row v-else>
            <v-col
              v-for="item in pokemons.edges"
              :key="item.id"
              class="pullUp"
              cols="12"
              md="3"
              sm="4"
            >
              <PokemonCard :pokemon="item" />
            </v-col>
          </v-row>
        </v-slide-x-transition>
        <v-fade-transition v-else>
          <NoData
            :message="
              isFavorite
                ? 'You didn\'t select any favorite pokemon yet.'
                : 'We Couldn\'t find the Pokemon that you\'re looking for'
            "
          />
        </v-fade-transition>
      </template>
      <div v-else-if="$apollo.queries.pokemons.loading" class="test-loading">
        <v-skeleton-loader
          type="image, list-item-avatar-two-line"
        ></v-skeleton-loader>
      </div>
      <v-fade-transition v-if="!pokemons && showError">
        <NoData message="We're down for maintenance. Check back shortly." />
      </v-fade-transition>
    </v-card>
  </v-card>
</template>

<script>
import POKEMONS_QUERY from "@/graphql/pokemons.query.gql";
import POKEMONS_TYPES_QUERY from "@/graphql/pokemonTypes.query.gql";
import localTestQuery from "@/graphql/localTest.query.gql";
import PokemonCard from "@/components/PokemonCard";
import NoData from "@/components/NoData";

export default {
  name: "pokemons-list",
  components: {
    PokemonCard,
    NoData
  },
  data: () => ({
    offset: 0,
    pokemonName: "",
    searchText: "",
    isFavorite: false,
    pokemonType: "",
    listView: false,
    showError: false
  }),
  apollo: {
    pokemonTypes: {
      query: POKEMONS_TYPES_QUERY
    },
    pokemons: {
      query: POKEMONS_QUERY,
      variables: {
        offset: 0
      },
      error() {
        this.showError = true;
      },
      fetchPolicy: "network-only",
      debounce: 300,
      loadingKey: "loading"
    },
    fetchLocalUser: {
      query: localTestQuery,
      result() {
        console.log("*************Test fetched!");
      }
    }
  },
  methods: {
    onScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
      if (scrollTop + clientHeight >= scrollHeight) this.loadMorePokemons();
    },
    loadMorePokemons() {
      this.offset = this.offset + 10;
      this.$apollo.queries.pokemons.fetchMore({
        variables: {
          offset: this.offset
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newList = fetchMoreResult.pokemons.edges;
          return {
            pokemons: {
              __typename: previousResult.pokemons.__typename,
              // Merging the pokemons list
              edges: [...previousResult.pokemons.edges, ...newList]
            }
          };
        }
      });
    },
    onSearchPokemon() {
      this.$delay(this.reFetchPokemons);
    },
    reFetchPokemons() {
      this.$apollo.queries.pokemons.refetch({
        search: this.pokemonName,
        isFavorite: this.isFavorite,
        type: this.pokemonType
      });
    }
  }
};
</script>

<style scoped>
.content-scroll {
  position: absolute;
  height: -moz-calc(100% - 120px);
  height: -webkit-calc(100% - 120px);
  height: calc(100% - 120px);
  overflow-y: scroll;
  overflow-x: hidden;
  scroll-behavior: smooth !important;
  overscroll-behavior-y: none;
  -webkit-overflow-scrolling: touch;
  left: 0;
  right: 0;
}
.pullUp {
  animation-name: pullUp;
  -webkit-animation-name: pullUp;

  animation-duration: 1.1s;
  -webkit-animation-duration: 1.1s;

  animation-timing-function: ease-out;
  -webkit-animation-timing-function: ease-out;

  transform-origin: 50% 100%;
  -ms-transform-origin: 50% 100%;
  -webkit-transform-origin: 50% 100%;
}

@keyframes pullUp {
  0% {
    transform: scaleY(0.1);
  }

  40% {
    transform: scaleY(1.02);
  }

  60% {
    transform: scaleY(0.98);
  }

  80% {
    transform: scaleY(1.01);
  }

  100% {
    transform: scaleY(0.98);
  }

  80% {
    transform: scaleY(1.01);
  }

  100% {
    transform: scaleY(1);
  }
}

@-webkit-keyframes pullUp {
  0% {
    -webkit-transform: scaleY(0.1);
  }

  40% {
    -webkit-transform: scaleY(1.02);
  }

  60% {
    -webkit-transform: scaleY(0.98);
  }

  80% {
    -webkit-transform: scaleY(1.01);
  }

  100% {
    -webkit-transform: scaleY(0.98);
  }

  80% {
    -webkit-transform: scaleY(1.01);
  }

  100% {
    -webkit-transform: scaleY(1);
  }
}
</style>

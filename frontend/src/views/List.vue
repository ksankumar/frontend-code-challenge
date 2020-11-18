<template>
  <v-container>
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
            @click.stop="isFavorite = false"
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
            @click.stop="isFavorite = true"
          >
            Favorites
          </v-btn>
        </v-col>
      </v-row>
      <v-row align="center" class="mt-5 mb-2" justify="space-around" no-gutters>
        <v-col class="pr-3" cols="6" md="7" sm="6">
          <v-text-field
            v-model.trim="searchText"
            clearable
            hide-details
            label="Search"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="5" md="4" sm="4">
          <ApolloQuery
            v-slot="{ result: { data }, isLoading }"
            :query="require('../graphql/PokemonTypes.gql')"
          >
            <v-skeleton-loader
              v-if="isLoading"
              type="list-item"
            ></v-skeleton-loader>
            <v-select
              v-else
              v-model="pokemonType"
              :items="data.pokemonTypes"
              clearable
              hide-details
              label="Type"
              outlined
            ></v-select>
          </ApolloQuery>
        </v-col>
        <v-col cols="1" md="1" sm="2">
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
    <v-card class="content-scroll" flat @scroll="handleScroll">
      <v-container v-if="pokemons && pokemons.edges.length">
        <v-slide-x-transition :duration="250" mode="out-in">
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
              <v-card outlined @click.stop="goPokemonDetails(item.id)">
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
                <v-card-actions class="grey lighten-3">
                  <div>
                    <div class="font-weight-normal">
                      <strong>{{ item.name }}</strong>
                    </div>
                    <div>{{ item.types.join(", ") }}</div>
                  </div>
                  <v-spacer></v-spacer>
                  <v-btn icon @click.stop="makeFavorite(item)">
                    <v-icon color="red" size="30"
                      >{{ item.isFavorite ? "mdi-heart" : "mdi-heart-outline" }}
                    </v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-slide-x-transition>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import Pokemons from "@/graphql/Pokemons.gql";
import FavoritePokemon from "@/graphql/FavoritePokemon.gql";
import UnFavoritePokemon from "@/graphql/UnFavoritePokemon.gql";

export default {
  name: "pokemons-list",
  data: () => ({
    offset: 0,
    searchText: "",
    isFavorite: false,
    pokemonType: "",
    listView: false
  }),
  apollo: {
    pokemons: {
      query: Pokemons,
      variables() {
        return {
          offset: 0,
          search: this.searchText,
          isFavorite: this.isFavorite,
          type: this.pokemonType
        };
      },
      fetchPolicy: "network-only",
      debounce: 300,
      loadingKey: "loading"
    }
  },
  methods: {
    handleScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
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
    async makeFavorite(item) {
      await this.$apollo.mutate({
        mutation: item.isFavorite ? UnFavoritePokemon : FavoritePokemon,
        variables: {
          id: item.id
        }
      });
    },
    goPokemonDetails(pokemonId) {
      this.$router.push({ name: "PokemonDetails", params: { id: pokemonId } });
    }
  }
};
</script>

<style scoped>
.content-scroll {
  position: absolute;
  height: -moz-calc(100% - 150px);
  height: -webkit-calc(100% - 150px);
  height: calc(100% - 150px);
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

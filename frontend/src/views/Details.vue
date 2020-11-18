<template>
  <v-container>
    <ApolloQuery
      :query="require('../graphql/PokemonDetails.gql')"
      :variables="{ id: $route.params.id }"
    >
      <template v-slot="{ result: { data }, isLoading }">
        <!-- Loading -->
        <v-skeleton-loader
          v-if="isLoading"
          type="image, table-tfoot, list-item-three-line"
        ></v-skeleton-loader>
        <!-- Result -->
        <div v-if="data && data.pokemonById">
          <v-card outlined>
            <template slot="progress">
              <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
              ></v-progress-linear>
            </template>

            <v-img :src="data.pokemonById.image" contain height="400">
              <template v-slot:placeholder>
                <v-row align="center" class="fill-height ma-0" justify="center">
                  <v-progress-circular
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </v-row>
              </template>
              <audio-player :audioSrc="data.pokemonById.sound" />
            </v-img>
            <v-sheet color="secondary">
              <v-card color="transparent" flat tile>
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-list-item-title class="headline font-weight-bold"
                      >{{ data.pokemonById.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="font-weight-bold"
                      >{{ data.pokemonById.types.join(", ") }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click.stop="makeFavorite(data.pokemonById)">
                      <v-icon color="red" size="30"
                        >{{
                          data.pokemonById.isFavorite
                            ? "mdi-heart"
                            : "mdi-heart-outline"
                        }}
                      </v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-card-text class="pt-0">
                  <v-row align="center" no-gutters>
                    <v-col cols="11">
                      <v-progress-linear
                        color="#a09ffe"
                        height="10"
                        rounded
                        value="100"
                      ></v-progress-linear>
                    </v-col>
                    <v-col cols="1">
                      <b class="font-weight-black float-right"
                        >CP:&nbsp;{{ data.pokemonById.maxCP }}</b
                      >
                    </v-col>
                  </v-row>
                  <v-row align="center" no-gutters>
                    <v-col cols="11">
                      <v-progress-linear
                        color="#71c1a1"
                        height="10"
                        rounded
                        value="100"
                      ></v-progress-linear>
                    </v-col>
                    <v-col cols="1">
                      <b class="font-weight-black float-right">
                        HP:&nbsp;{{ data.pokemonById.maxHP }}
                      </b>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-divider></v-divider>
              <v-card class="text-center" color="transparent" flat tile>
                <v-row align="center" justify="center">
                  <v-col>
                    <v-list-item-content>
                      <v-list-item-title class="headline font-weight-bold">
                        Weight
                      </v-list-item-title>
                      <v-list-item-subtitle class="subtitle-1">
                        {{ data.pokemonById.weight.minimum }}
                        <span class="px-1">-</span>
                        {{ data.pokemonById.weight.maximum }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-col>
                  <v-divider vertical></v-divider>
                  <v-col>
                    <v-list-item-content>
                      <v-list-item-title class="headline font-weight-bold">
                        Height
                      </v-list-item-title>
                      <v-list-item-subtitle class="subtitle-1">
                        {{ data.pokemonById.height.minimum }}
                        <span class="px-1">-</span>
                        {{ data.pokemonById.height.maximum }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-card>
            </v-sheet>
          </v-card>
          <v-fade-transition mode="out-in">
            <v-row>
              <v-col
                v-for="item in data.pokemonById.evolutions"
                :key="item.id"
                class="pullUp"
                cols="12"
                md="3"
                sm="4"
              >
                <EvolutionCard :id="item.id" />
              </v-col>
            </v-row>
          </v-fade-transition>
        </div>
        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>
  </v-container>
</template>

<script>
import FavoritePokemon from "@/graphql/FavoritePokemon.gql";
import UnFavoritePokemon from "@/graphql/UnFavoritePokemon.gql";
import EvolutionCard from "@/components/EvolutionCard";
import AudioPlayer from "@/components/AudioPlayer";

export default {
  name: "Details",
  components: {
    EvolutionCard,
    AudioPlayer
  },
  methods: {
    async makeFavorite(item) {
      await this.$apollo.mutate({
        mutation: item.isFavorite ? UnFavoritePokemon : FavoritePokemon,
        variables: {
          id: item.id
        }
      });
    }
  }
};
</script>

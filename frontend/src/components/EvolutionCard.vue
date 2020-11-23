<template>
  <ApolloQuery
    v-if="id"
    :query="require('../graphql/pokemonEvolution.query.gql')"
    :variables="{ id: id }"
  >
    <template v-slot="{ result: { data }, isLoading }">
      <!-- Loading -->
      <v-skeleton-loader
        v-if="isLoading"
        type="image, table-tfoot"
      ></v-skeleton-loader>
      <!-- Result -->
      <v-card
        v-else
        outlined
        @click.stop="goPokemonDetails(data.pokemonById.id)"
      >
        <v-img
          :src="data.pokemonById.image"
          class="text-right pa-2"
          contain
          height="300"
        >
          <template v-slot:placeholder>
            <v-row align="center" class="fill-height ma-0" justify="center">
              <v-progress-circular
                color="primary"
                indeterminate
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <v-card-actions class="grey lighten-3">
          <div class="font-weight-normal">
            <strong>{{ data.pokemonById.name }}</strong>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click.stop="makeFavorite(data.pokemonById)">
            <v-icon
              color="red"
              size="30"
              v-text="
                data.pokemonById.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'
              "
            >
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </ApolloQuery>
</template>

<script>
import UnFavoritePokemon from "@/graphql/unFavoritePokemon.mutation.gql";
import FavoritePokemon from "@/graphql/favoritePokemon.mutation.gql";

export default {
  name: "EvolutionCard",
  props: {
    id: {
      type: String
    }
  },
  methods: {
    goPokemonDetails(pokemonId) {
      this.$router.push({
        name: "PokemonDetails",
        params: {
          id: pokemonId
        }
      });
    },
    async makeFavorite(item) {
      console.log("pokemonId **********", item);
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

<template>
  <v-card outlined @click.stop="goPokemonDetails(pokemon.id)">
    <v-img :src="pokemon.image" class="text-right pa-2" contain height="300">
      <template v-slot:placeholder>
        <v-skeleton-loader v-slot:placeholder type="image"></v-skeleton-loader>
      </template>
    </v-img>
    <v-card-actions class="grey lighten-3">
      <div>
        <div class="font-weight-normal">
          <strong>{{ pokemon.name }}</strong>
        </div>
        <div>{{ pokemon.types.join(", ") }}</div>
      </div>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="makeFavorite(pokemon)" class="test-favorite">
        <v-icon color="red" size="30"
          >{{ pokemon.isFavorite ? "mdi-heart" : "mdi-heart-outline" }}
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import UnFavoritePokemon from "@/graphql/unFavoritePokemon.mutation.gql";
import FavoritePokemon from "@/graphql/favoritePokemon.mutation.gql";

export default {
  name: "PokemonCard",
  props: {
    pokemon: {
      type: Object
    }
  },
  methods: {
    makeFavorite(item) {
      this.$apollo.mutate({
        mutation: item.isFavorite ? UnFavoritePokemon : FavoritePokemon,
        variables: {
          id: item.id
        }
      });
    },
    goPokemonDetails(pokemonId) {
      this.$router.push({
        name: "PokemonDetails",
        params: {
          id: pokemonId
        }
      });
    }
  }
};
</script>

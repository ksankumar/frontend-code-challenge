<template>
  <v-btn icon @click.stop="makeFavorite(pokemon)" class="test-favorite">
    <v-icon color="red" size="30"
      >{{ pokemon.isFavorite ? "mdi-heart" : "mdi-heart-outline" }}
    </v-icon>
  </v-btn>
</template>

<script>
import UnFavoritePokemon from "@/graphql/unFavoritePokemon.mutation.gql";
import FavoritePokemon from "@/graphql/favoritePokemon.mutation.gql";

export default {
  name: "favorite-button",
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
    }
  }
};
</script>

<style scoped></style>

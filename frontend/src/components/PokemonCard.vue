<template>
  <v-card
    outlined
    @click.stop="goPokemonDetails(pokemon.id)"
    class="pokemon-card"
  >
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
        <div v-if="pokemon.types">{{ pokemon.types.join(", ") }}</div>
      </div>
      <v-spacer></v-spacer>
      <favorite-button :pokemon="pokemon" />
    </v-card-actions>
  </v-card>
</template>

<script>
import FavoriteButton from "@/components/FavoriteButton";

export default {
  name: "pokemon-card",
  components: {
    FavoriteButton
  },
  props: {
    pokemon: {
      type: Object
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
    }
  }
};
</script>
<style scoped>
@-webkit-keyframes swing {
  15% {
    -webkit-transform: translateX(5px);
    transform: translateX(5px);
  }
  30% {
    -webkit-transform: translateX(-5px);
    transform: translateX(-5px);
  }
  50% {
    -webkit-transform: translateX(3px);
    transform: translateX(3px);
  }
  65% {
    -webkit-transform: translateX(-3px);
    transform: translateX(-3px);
  }
  80% {
    -webkit-transform: translateX(2px);
    transform: translateX(2px);
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
}
@keyframes swing {
  15% {
    -webkit-transform: translateX(5px);
    transform: translateX(5px);
  }
  30% {
    -webkit-transform: translateX(-5px);
    transform: translateX(-5px);
  }
  50% {
    -webkit-transform: translateX(3px);
    transform: translateX(3px);
  }
  65% {
    -webkit-transform: translateX(-3px);
    transform: translateX(-3px);
  }
  80% {
    -webkit-transform: translateX(2px);
    transform: translateX(2px);
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
}
.pokemon-card:hover {
  -webkit-animation: swing 1s ease;
  animation: swing 1s ease;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
}
</style>

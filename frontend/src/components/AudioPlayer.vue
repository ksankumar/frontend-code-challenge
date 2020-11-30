<template>
  <v-fab-transition>
    <v-btn
      absolute
      bottom
      class="mb-8"
      fab
      icon
      left
      small
      @click.stop="playRoar"
    >
      <v-icon color="primary" size="36">mdi-volume-high</v-icon>
      <audio
        ref="audioPlayer"
        :src="audioSrc"
        class="d-none"
        preload="auto"
      ></audio>
    </v-btn>
  </v-fab-transition>
</template>

<script>
export default {
  name: "audio-player",
  props: {
    audioSrc: {
      type: String
    }
  },
  methods: {
    playRoar() {
      const player = this.$refs.audioPlayer;
      player.pause();
      player.currentTime = 0;
      player.play();
    }
  }
};
</script>

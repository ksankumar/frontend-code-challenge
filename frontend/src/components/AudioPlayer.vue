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
      @click.stop="$refs.audioPlayer.play()"
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
  }
};
</script>

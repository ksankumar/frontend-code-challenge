<template>
  <v-app>
    <v-container fluid fill-height>
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>

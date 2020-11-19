import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#71c1a1",
        secondary: "#f3f3f3",
        error: "#FF5252",
        success: "#4CAF50"
      }
    }
  }
});

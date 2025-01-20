import { createApp } from 'vue'
import App from '@/App.vue'

import '@mdi/font/css/materialdesignicons.css' // Importa los estilos de los íconos de Material Design Icons

import router from './plugins/router'
import '@/style.css'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App)
  .use(vuetify)
  .use(router)
  .use(VueSweetalert2)
  .mount('#app')

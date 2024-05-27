import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles';
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createPinia } from 'pinia'


// Configura Vuetify
const vuetify = createVuetify({
    components,
    directives
});

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(vuetify)
app.use(router)
app.mount('#app')

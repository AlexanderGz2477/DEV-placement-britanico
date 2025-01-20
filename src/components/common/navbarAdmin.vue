<template>
    <v-app-bar color="rgba(255,255,255,255)" density="compact">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <div>
            
        </div>
        <v-img  src="/img/brita.png" class="logo"></v-img>
        <h1>{{ usuario }}</h1>
      
    </v-app-bar>


    <v-navigation-drawer v-model="drawer">

        <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-folder" title="Placement" value="myfiles" ></v-list-item>
        </v-list>

    </v-navigation-drawer>


</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'
import { BACKEND_URL } from '../../config.js';
export default {
    data() {
        return {
            usuario: 'Británico',
            drawer: false,
        };
    },

    mounted() {

    },

    methods: {


    }

}

</script>
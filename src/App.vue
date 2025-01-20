<template>
  <v-layout>
   
    <navbarAdmin/>

    <v-main>
      <router-view></router-view> <!-- Acá aparece todo lo que va en los link de Vue-Router -->
    </v-main>
  </v-layout>
</template>

<script setup>
//import maestroAddCorreosUsuarios from 'components/admin/admin_maestroAddCorreosUsuarios.vue'
import navbarAdmin from './components/common/navbarAdmin.vue'
import { RouterView, RouterLink } from 'vue-router'

</script>
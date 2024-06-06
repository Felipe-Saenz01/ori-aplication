<template>
  <v-app theme="dark">
    <v-navigation-drawer v-if="(auth.isAuth)" class="elevation-3 ma-2 rounded-xl bg-teal-darken-3" theme="dark" >
      <v-list-item class="pa-4 text-bold" title="Ori Application" subtitle="Unitrópico"></v-list-item>
      <v-divider :thickness="3" ></v-divider>
      <v-list-item prepend-icon="mdi-pen-plus" link to="/excel-create" title="Subir Archivo"></v-list-item>
      <v-list-item prepend-icon="mdi-view-list" link to="/files" title="Lista Archivos"></v-list-item>
    </v-navigation-drawer>  
    <v-navigation-drawer v-else class="elevation-3 ma-2 rounded-xl bg-teal-darken-3" theme="dark" >
      <v-list-item class="pa-4 text-bold" title="Ori Application" subtitle="Unitrópico"></v-list-item>
      <v-divider :thickness="3" ></v-divider>
      <v-list-item prepend-icon="mdi-view-list" link to="/login" title="Login"></v-list-item>
      <v-list-item prepend-icon="mdi-view-list" link to="/register" title="Register"></v-list-item>
    </v-navigation-drawer>  

    <v-main class="bg-dark">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
  import useAuthstore from '@/store/auth.js'

  const auth = useAuthstore();
</script>


<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  background-color: #151419;
}
</style>

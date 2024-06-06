<template>
    <v-container class="h-100">
        <v-card class="pa-5 bg-grey-lighten-3 text-center mx-auto my-auto w-50">
            <v-img aspect-ratio="16/9" cover class="w-75 mx-auto mb-3"
                src="https://i.postimg.cc/GtJMcSLD/LOGO-1024x601.png">
            </v-img>
            <h1> Login </h1>
            <v-divider class="my-4"></v-divider>
            <v-text-field v-model="email" clearable label="Email" prepend-icon="mdi-account-circle" type="email"
                placeholder="example@unitropico.edu.co" class="mx-5">
            </v-text-field>
            <v-text-field v-model="password" clearable label="Contraseña" prepend-icon="mdi-lock" type="password"
                class="mx-5">
            </v-text-field>

            <v-btn color="green" class="mt-5 rounded-lg" @click="auth">
                Login
            </v-btn>
        </v-card>

    </v-container>
</template>

<script setup>

import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import useAuthStore from '@/store/auth';
import useNotification from '@/store/notification';
import { toast } from 'vue3-toastify';
import { useRouter } from 'vue-router';

const email = ref('')
const password = ref('')

const userAuth = useAuthStore()
const notificationStore = useNotification()

const router = useRouter()

const auth = () => {
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email.value, password.value).then(() => {
        userAuth.isAuth = true
        notificationStore.isNotificated = true;
        notificationStore.content = 'Logueado, Bienvenido';
        notificationStore.type = 'success';
        router.push({ name: 'files' })
    })
    .catch((error) => {
        toast.error('Error al Intentar loguear, revise sus credenciales', {
        transition: toast.TRANSITIONS.FLIP,
        autoClose: 3000
      });
      console.log('error: ',error)
    } )
}

</script>

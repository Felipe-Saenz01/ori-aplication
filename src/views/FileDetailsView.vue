<template>
    <v-container>
        <v-row>
            <v-col class="text-center">
                <h1>Contenido Archivo</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card class="pa-5 mb-1 bg-teal-darken-3 d-flex align-cente">
                    <div>
                        <p><strong>Nombre del archivo:</strong> {{ file.name }}</p>
                        <p><strong>Fecha de creación:</strong> {{ formatDate(file.created) }}</p>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn append-icon="mdi-delete" color="green" class="rounded-lg mr-2 elevation-8" @click="confirmDelete"> Exportar </v-btn>
                    <v-btn append-icon="mdi-delete" color="red" class="rounded-lg elevation-8" @click="confirmDelete"> Eliminar </v-btn>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card class="pa-5 bg-teal-darken-3">
                    <v-data-table v-if="file.data && file.headers.length" :headers="file.headers" :items="file.data"
                        theme="dark" class="elevation-8">
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/services/firebase.js';
import { getDoc, doc, deleteDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import useNotification from '@/store/notification.js';


const file = ref({})
const route = useRoute();
const router = useRouter();
const fileId = ref(route.params.id);
const notificationStore = useNotification()

const formatDate = (timestamp) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
        const date = timestamp.toDate();
        return date.toLocaleString();
    } else {
        return 'Fecha inválida';
    }
};

onMounted(async () => {
    try {
        const fileDoc = doc(db, 'files', fileId.value);
        const fileSnapshot = await getDoc(fileDoc);
        if (fileSnapshot.exists()) {
            file.value = fileSnapshot.data()
        } else {
            console.log('No se encontró ningún documento con el ID especificado.');
        }
    } catch (error) {
        console.error('Error al obtener el documento:', error);
    }
})

const confirmDelete = () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteFile();
        }
    });
};

const deleteFile = async () => {
    try {
        const fileDoc = doc(db, 'files', fileId.value);
        await deleteDoc(fileDoc);
        notificationStore.isNotificated = true;
        notificationStore.content = 'Archivo eliminado con exito';
        notificationStore.type = 'success';

        router.push({name: 'files'}); 
    } catch (error) {
        notificationStore.isNotificated = true;
        notificationStore.content = 'No se pudo eliminar el archivo';
        notificationStore.type = 'error';
    }
};

</script>

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
                    <v-btn append-icon="mdi-delete" color="red" class="rounded-lg elevation-8" @click="deleteFile"> Eliminar </v-btn>
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

const file = ref({})
const route = useRoute();
const router = useRouter();
const fileId = ref(route.params.id);

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

const deleteFile = async () => {
    try {
        const fileDoc = doc(db, 'files', fileId.value);
        await deleteDoc(fileDoc);
        console.log('Documento eliminado con éxito.');
        router.push('/files'); // Redirige al view de files
    } catch (error) {
        console.error('Error al eliminar el documento:', error);
    }
};

</script>

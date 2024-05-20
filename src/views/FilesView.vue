<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <h1 class="font-bold mb-5">Lista archivos</h1>
      </v-col>
    </v-row>
    <v-divider :thickness="7" class="mx-5 mb-5 "></v-divider>
    <v-row>
      <v-col>
        <v-card class="pa-1 bg-teal-darken-3">
          <v-data-table :headers="exampleHeaders" :items="files" theme="dark" item-value="id"
            class="elevation-1 text-lg">
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.archivo }}</td>
                <td>{{ item.fechaCreacion }}</td>
                <td>
                  <v-icon color="yellow"  @click="goFile(item.id)"> mdi-view-list </v-icon>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { db } from '@/services/firebase.js';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';


const exampleHeaders = ref([
  { title: 'Archivo', value: 'archivo' },
  { title: 'Fecha Creacion', value: 'fechaCreacion' },
  { title: 'Editar', value: 'editar' },
]);

const files = ref([]);

const router = useRouter();

const formatDate = (timestamp) => {
  const date = timestamp.toDate(); // Convertir el Timestamp a una fecha JavaScript
  return date.toLocaleString(); // Formatear la fecha como una cadena legible
};

onMounted(async () => {
  const q = query(collection(db, 'files'), orderBy('created', 'desc'))
  const filesCollection = await getDocs(q);
  const filesData = filesCollection.docs.map(doc => {
    return {
      archivo: doc.data().name,
      fechaCreacion: formatDate(doc.data().created),
      id: doc.id,
    };
  });
  files.value = filesData;
}); 


const goFile = (fileId) => {
  router.push({ name: 'file-detail', params: { id: fileId } });
};


</script>
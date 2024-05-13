<template>
  <div class="mt-5">
    <h1 class="text-xl font-bold text-center">This is an about page</h1>
  </div>
  <div class="wfull border ml-2">
      <table class="w-full text-sm rtl:text-right text-gray-200">
        <thead class="text-xs text-center uppercase bg-gray-700  text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">Archivo</th>
                <th scope="col" class="px-6 py-3">Fecha Creación</th>
                <th scope="col" class="px-6 py-3">Editar</th>
            </tr>
        </thead>
        <tbody class="text-left">
            <tr v-for="(file, key) in files" :key="key" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td  scope="row" class="px-6 py-4 font-medium whitespace-nowrap ">{{ file.name }}</td>
                <td  scope="row" class="px-6 py-4 font-medium whitespace-nowrap ">{{ formatDate(file.created) }}</td>
                <td  scope="row" class="px-6 py-4 font-medium whitespace-nowrap ">Editar</td>
            </tr>

        </tbody>
        </table>
    </div>
</template>

<script setup>
import { db } from '@/services/firebase.js';
import { getDocs, getDoc, doc, collection } from 'firebase/firestore';
import { ref, onMounted } from 'vue';

const files = ref([]);

onMounted(async()=> {
  let flesCollection = await getDocs(collection(db, 'files'))
  flesCollection.forEach(file =>{
    //console.log(file.id);
    files.value.push({id: file.id, ...file.data()});
  })
  console.log(files.value)
  getFileById('Wfk7YBp05A595DCYTHD7')

})

const formatDate = (timestamp) => {
  const date = timestamp.toDate(); // Convertir el Timestamp a una fecha JavaScript
  return date.toLocaleString(); // Formatear la fecha como una cadena legible
};

const getFileById = async (fileId) => {
  try {
    const fileDoc = doc(db, 'files', fileId);
    const fileSnapshot = await getDoc(fileDoc);
    if (fileSnapshot.exists()) {
      console.log('Documento encontrado:', fileSnapshot.data());
    } else {
      console.log('No se encontró ningún documento con el ID especificado.');
    }
  } catch (error) {
    console.error('Error al obtener el documento:', error);
  }
};

</script>
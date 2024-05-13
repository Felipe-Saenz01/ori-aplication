<template>
  <div class=" mt-5 text-center text-xl font-bold mb-5">
    <h1>Hola bom dia</h1>
  </div>
  <div class="w-full flex ">
    <div class="w-1/3 border p-5 mr-2 rounded-lg border-black max">
      <h1 class="text-xl font-bold">Subir Excel</h1>
      <p>Pequeño Formulario para subir el excel</p>
      <hr>
      <div class="flex flex-col my-5">
            <label class="w-ful mb-2 font-bold" >Archivo</label>
            <input @change="handleFileChange" class="w-ful bg-gray-200 text-black rounded-md h-12 p-2" type="file"  >
      </div>
      <div class="flex justify-center mt-5 text-white">
        <button @click="handleSaveFile" class="bg-green-500/100 hover:bg-green-600/100 w-1/5 h-8 rounded-md font-bold">Guardar</button>
      </div>

    </div>
    <div class="w-1/2 border ml-2">
      <table v-if="(excelData)" class="w-full text-sm rtl:text-right text-gray-200">
        <thead class="text-xs text-center uppercase bg-gray-700  text-gray-400">
            <tr>
                <th v-for="(header, key) in headers" :key="key" scope="col" class="px-6 py-3">{{ header }}</th>
            </tr>
        </thead>
        <tbody class="text-left">
            <tr v-for="(row, index) in excelData" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td v-for="(value, key) in row" :key="key" scope="row" class="px-6 py-4 font-medium whitespace-nowrap ">{{ value }}</td>
            </tr>

        </tbody>
        </table>
    </div>
  </div>
</template> 

<script setup>
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import { db } from '@/services/firebase.js';
import {collection, addDoc, Timestamp} from 'firebase/firestore';


const file = ref(null);
const excelData = ref(null);
const headers = ref([])

const handleFileChange = (event) => {
  file.value = event.target.files[0];
  handleFileUpload();
};

const handleFileUpload = () => {
  if (!file.value) {
    console.error('No se ha seleccionado ningún archivo.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Solo toma la primera hoja del archivo Excel
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    headers.value= rows[0];
    
    const formattedData = rows.slice(1).map(row => {
      const formattedRow = {};
      rows[0].forEach((header, index) => {
        formattedRow[header] = row[index];
      });
      return formattedRow;
    });

    excelData.value = formattedData; // Almacena los datos del archivo Excel en la variable excelData

    console.log(file.value.name)
  };
  reader.readAsArrayBuffer(file.value); 
};

const handleSaveFile = async () => {
  if (!file.value) {
    console.error('No se ha seleccionado ningún archivo.');
    return;
  }
    
  try {
    const docRef = await addDoc(collection(db, "files"), {
      name: file.value.name,
      headers: headers.value,
      data: excelData.value,
      created: Timestamp.now()
    });
    console.log('Archivo subido correctamente a Firestore con ID:', docRef);
  } catch (error) {
    console.error('Error al subir el archivo a Firestore:', error);
  }

  
}

</script>

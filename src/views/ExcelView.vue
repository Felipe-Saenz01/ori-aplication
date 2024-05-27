<template>
  <v-container class="mt-5" :fluid="true">
    <v-row class="text-center">
      <v-col>
        <h1 class="font-bold mb-5">Exportar Archivo Plano</h1>
      </v-col>
    </v-row>
    <v-divider :thickness="7" class="mx-5 mb-5 "></v-divider>
    <v-row>
      <v-col cols="3" class="ml-2">
        <v-card class="pa-5 bg-grey-lighten-3">
          <h2 class="text-xl font-bold text-green">Subir Excel</h2>
          <p>Pequeño Formulario para subir el excel</p>
          <v-divider class="my-4"></v-divider>
          <v-file-input label="Archivo" @change="handleFileChange" outlined></v-file-input>
          <v-btn color="green" class="mt-5" @click="handleSaveFile">
            Guardar
          </v-btn>
        </v-card>
      </v-col>
      <v-col cols="8" pa="8">
        <v-card ma="3" color="bg-light-green">
          <v-data-table v-if="excelData && headers.length" :headers="headers" :items="excelData" theme="dark"
            class="elevation-1 custom-data-table"></v-data-table>
          <v-data-table v-else :headers="exampleHeaders" :items="exampleData" theme="dark"
            class="elevation-1 custom-data-table"></v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import { db } from '@/services/firebase.js';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import useNotification from '@/store/notification.js';

const file = ref(null);
const excelData = ref([]);
const headers = ref([]);
const router = useRouter();
const notificationStore = useNotification();


// Datos de ejemplo para mostrar en la tabla cuando no se ha subido ningún archivo Excel
const exampleHeaders = ref([
  { title: 'Documento', value: 'Documento' },
  { title: 'Nombres', value: 'Nombres' },
  { title: 'Correo', value: 'Correo' },
  { title: 'Género', value: 'Genero' },
  { title: 'Estado', value: 'Estado' },
  { title: 'Etiquetas', value: 'Etiquetas' },
]);

const exampleData = ref([
  { Documento: '123456', Nombres: 'Juan Perez', Correo: 'juan.perez@example.com', Genero: 'Masculino', Estado: 'Activo', Etiquetas: 'Nuevo' },
  { Documento: '654321', Nombres: 'Maria Lopez', Correo: 'maria.lopez@example.com', Genero: 'Femenino', Estado: 'Inactivo', Etiquetas: 'Antiguo' },
]);

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

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    headers.value = rows[0].map(header => ({ title: header, value: header }));

    const formattedData = rows.slice(1).map(row => {
      const formattedRow = {};
      rows[0].forEach((header, index) => {
        formattedRow[header] = row[index];
      });
      return formattedRow;
    });

    excelData.value = formattedData;
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
    if (docRef) {
      notificationStore.isNotificated = true;
      notificationStore.content = 'Archivo guardado con exito';
      notificationStore.type = 'success';
      router.push({ name: 'files' })
    }
  } catch (error) {
    notificationStore.isNotificated = true;
    notificationStore.content = 'No se pudo guardar el archivo';
    notificationStore.type = 'error';
  }
};
</script>

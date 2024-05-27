import { defineStore } from "pinia";

const useNotificationStore = defineStore('notification', {
    state: () =>({
        isNotificated: false,
        content: "Accion completada",
        type: 'success'
    })
});

export default useNotificationStore;
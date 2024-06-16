import { defineStore } from 'pinia'

const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuth: false
    }),
    persist: {
        storage: sessionStorage,
        paths: ['isAuth'] 
    }
})

export default useAuthStore;
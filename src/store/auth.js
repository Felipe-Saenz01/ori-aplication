import {defineStore } from 'pinia'

const useAuthStore = defineStore('auth',{
    state: () =>({
        isAuth: false
    })
})

export default useAuthStore;
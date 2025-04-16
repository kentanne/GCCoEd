// stores/userRegistration.js
import { defineStore } from 'pinia'

export const registrationStore = defineStore('registrationStore', {
  state: () => ({
    registrationData: {}
  }),
  actions: {
    passAndMail(data) {
      this.registrationData = { ...this.registrationData, ...data }
    },
    reset() {
      this.registrationData = {}
    }
  }
})

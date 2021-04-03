import axios from 'axios'

const api = axios.create({
  // baseURL: 'http://192.168.0.109:3333'
  baseURL: 'https://e73aa222138b.ngrok.io'
})

export default api
import axios from 'axios';
const instance = axios.create({
  baseURL: '/api',
  
  headers: { 'X-Custom-Header': 'foobar' },
});

export {instance}

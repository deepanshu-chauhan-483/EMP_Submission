import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const fetchEvents = () => API.get('/events');
export const createEvent = (data, token) =>
  API.post('/events', data, { headers: { Authorization: `Bearer ${token}` } });

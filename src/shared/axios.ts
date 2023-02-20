import Axios from 'axios';

const URL = 'http://localhost:3001';

const axiosInstance = Axios.create({baseURL: URL});

export {axiosInstance as axios};

import axios, { AxiosPromise } from 'axios';

export const quickFetchData = (path: string): AxiosPromise => axios.get(path);

export const fetchData = (params: any): AxiosPromise => axios(params);

import axios, { AxiosPromise } from 'axios';

export const quickFetchData = (path: string): AxiosPromise => axios.get(path);

export const fetchData = (params: any): AxiosPromise => axios(params);

export const apiKey = '724ad44abed685b9f3c67bbe0d53e7df';

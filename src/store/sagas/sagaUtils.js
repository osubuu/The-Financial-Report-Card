import axios from 'axios';

export const quickFetchData = path => axios.get(path);

export const fetchData = params => axios({
	...params,
});

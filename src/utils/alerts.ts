import swal, { SweetAlertResult } from 'sweetalert2';

const wrongSnapshotUrl = (): Promise<SweetAlertResult> => swal.fire({
	icon: 'question',
	title: 'Invalid Share URL',
	text: 'The share URL is invalid. Please make sure you\'ve included all the characters and try again.',
});

const snapshotUrlCreated = (key: string): Promise<SweetAlertResult> => swal.fire({
	icon: 'success',
	title: 'Share URL Created',
	html: `Use the following URL to access this snapshot again:<br><br><strong>${key}</strong>`,
});

const noTickerSubmitted = (): Promise<SweetAlertResult> => swal.fire({
	icon: 'error',
	title: 'No Input',
	text: 'No input detected. Please submit a company ticker.',
});

const dataNotFound = (): Promise<SweetAlertResult> => swal.fire({
	icon: 'error',
	title: 'Sorry!',
	text: 'Data could not be retrieved for this company. Please search for another one.',
});


export default {
	wrongSnapshotUrl,
	snapshotUrlCreated,
	noTickerSubmitted,
	dataNotFound,
};

import swal from 'sweetalert2';

const Utils = {
	wrongSnapshotUrl: () => swal({
		type: 'question',
		title: 'Invalid Share URL',
		text: 'The share URL is invalid. Please make sure you\'ve included all the characters and try again.',
	}),
	snapshotUrlCreated: key => swal({
		type: 'success',
		title: 'Share URL Created',
		html: `Use the following URL to access this snapshot again:<br><br><strong>${key}</strong>`,
	}),
	noTickerSubmitted: () => swal({
		type: 'error',
		title: 'No Input',
		text: 'No input detected. Please submit a company ticker.',
	}),
	dataNotFound: () => swal({
		type: 'error',
		title: 'Sorry!',
		text: 'Data could not be retrieved for this company. Please search for another one.',
	}),
};

export default Utils;

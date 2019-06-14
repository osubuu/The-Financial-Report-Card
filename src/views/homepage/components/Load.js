import React from 'react';

const Load = (props) => {
	const { getDataFromFirebase, getSavedInput } = props;
	const description = 'Want to load an already existing snapshot?\nEnter your key below.';
	return (
		<div className="loading-container">
			<h3 className="loading-description">{description}</h3>
			<form
				action=""
				className="loading-form"
				onSubmit={getDataFromFirebase}
			>
				<input
					className="load-field"
					onChange={getSavedInput}
					type="text"
				/>
				<button className="load-button" type="submit">
					<i className="fas fa-arrow-circle-right" />
				</button>
			</form>
		</div>
	);
};

export default Load;

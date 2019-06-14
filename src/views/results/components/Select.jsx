import React from 'react';

const Select = (props) => {
	const {
		i, item, availableFSLIs, getUserFSLIChange,
	} = props;
	return (
		<div className="select-div">
			<select
				onChange={event => getUserFSLIChange(event, i)}
				className="all-fslis-select"
				defaultValue={item.fsli}
				key={i}
			>
				{availableFSLIs.is ? (
					<optgroup className="is-fslis" label="Income Statement">
						{availableFSLIs.is.map(fsli => (
							<option value={fsli} key={fsli}>
								{fsli}
							</option>
						))}
					</optgroup>
				) : null}

				{availableFSLIs.bs ? (
					<optgroup className="bs-fslis" label="Balance Sheet">
						{availableFSLIs.bs.map(fsli => (
							<option value={fsli} key={fsli}>
								{fsli}
							</option>
						))}
					</optgroup>
				) : null}
			</select>
		</div>
	);
};

export default Select;

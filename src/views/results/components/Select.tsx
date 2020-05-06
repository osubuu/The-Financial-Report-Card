import React from 'react';
import { SelectElement, SelectProps } from '../../../types/types';

const Select = (props: SelectProps): JSX.Element => {
	const {
		index, item, availableFSLIs, getUserFSLIChange,
	} = props;
	return (
		<div className="select-div">
			<select
				onChange={(event: SelectElement): void => getUserFSLIChange(event, index)}
				className="all-fslis-select"
				defaultValue={item.fsli}
				key={index}
			>
				{availableFSLIs.is ? (
					<optgroup className="is-fslis" label="Income Statement">
						{availableFSLIs.is.map((fsli) => (
							<option value={fsli} key={fsli}>
								{fsli}
							</option>
						))}
					</optgroup>
				) : null}

				{availableFSLIs.bs ? (
					<optgroup className="bs-fslis" label="Balance Sheet">
						{availableFSLIs.bs.map((fsli) => (
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

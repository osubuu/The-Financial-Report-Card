import React from 'react';
import LoadingScreen from 'react-loading-screen';
import { LoaderProps } from '../../types/types';

const Loader = (props: LoaderProps): JSX.Element => {
	const { condition } = props;
	return (
		<LoadingScreen
			loading={condition}
			bgColor="rgba(0,0,0,0.5)"
			spinnerColor="#edac53"
			textColor="#676767"
		>
			<div />
		</LoadingScreen>
	);
};

export default Loader;

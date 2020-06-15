import React from 'react';
import { CompanyProfileProps } from '../../../types/types';

const CompanyProfile = (props: CompanyProfileProps): JSX.Element => {
	const { profile, saveToFirebase } = props;
	const {
		companyName, symbol: ticker, exchange, ceo, sector, industry, description, website,
	} = profile;

	return (
		<section className="company-profile">
			<div className="profile-general-sec-1">
				<h2 className="company-name">{companyName}</h2>
				<h3 className="company-ticker">{ticker}</h3>
			</div>

			<div className="profile-general-sec-2">
				<div className="company-exchange space-between">
					<h4>Exchange:</h4>
					<h4 className="profile-value">{exchange}</h4>
				</div>

				{ceo ? (
					<div className="company-ceo space-between">
						<h4>CEO:</h4>
						<h4 className="profile-value">{ceo}</h4>
					</div>
				) : null}

				{sector ? (
					<div className="company-sector space-between">
						<h5>Sector:</h5>
						<h5 className="profile-value">{sector}</h5>
					</div>
				) : null}

				{industry ? (
					<div className="company-industry space-between">
						<h5>Industry:</h5>
						<h5 className="profile-value">{industry}</h5>
					</div>
				) : null}
			</div>

			<div className="profile-general-sec-3">
				<p className="company-description">{description}</p>

				<h6 className="company-website">
					<a href={website}>{website}</a>
				</h6>
			</div>

			<button type="button" className="share-button" onClick={saveToFirebase}>
				<h5>SHARE SNAPSHOT</h5>
			</button>
		</section>
	);
};

export default CompanyProfile;

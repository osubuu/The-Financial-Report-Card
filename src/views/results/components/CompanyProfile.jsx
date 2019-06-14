import React from 'react';

const CompanyProfile = (props) => {
	const { error, profileResult, saveToFirebase } = props;
	if (error) return null;

	return (
		<section className="company-profile">
			<div className="profile-general-sec-1">
				<h2 className="company-name">{profileResult.companyName}</h2>
				<h3 className="company-ticker">{profileResult.ticker}</h3>
			</div>

			<div className="profile-general-sec-2">
				<div className="company-exchange space-between">
					<h4>Exchange:</h4>
					<h4 className="profile-value">{profileResult.exchange}</h4>
				</div>

				{profileResult.CEO ? (
					<div className="company-ceo space-between">
						<h4>CEO:</h4>
						<h4 className="profile-value">{profileResult.CEO}</h4>
					</div>
				) : null}

				{profileResult.sector ? (
					<div className="company-sector space-between">
						<h5>Sector:</h5>
						<h5 className="profile-value">{profileResult.sector}</h5>
					</div>
				) : null}

				{profileResult.industry ? (
					<div className="company-industry space-between">
						<h5>Industry:</h5>
						<h5 className="profile-value">{profileResult.industry}</h5>
					</div>
				) : null}
			</div>

			<div className="profile-general-sec-3">
				<p className="company-description">{profileResult.description}</p>

				<h6 className="company-website">
					<a href={profileResult.website}>{profileResult.website}</a>
				</h6>
			</div>

			<button type="button" className="save-button" onClick={saveToFirebase}>
				<h5>SAVE CURRENT SNAPSHOT</h5>
			</button>
		</section>
	);
};

export default CompanyProfile;

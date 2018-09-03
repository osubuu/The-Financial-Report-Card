import React from "react";

const CompanyProfile = props => {
  // if a API request error occured, don't display
  if (props.error === true) {
    return null;
  }

  // else, display
  else {
    return (
      <section className="company-profile">
        <div className="profile-general-sec-1">
          <h2 className="company-name">{props.profileResult.companyName}</h2>
          <h3 className="company-ticker">({props.profileResult.ticker})</h3>
        </div>

        <div className="profile-general-sec-2">
          {/* <div className="profile-sec-2"> */}
          <div className="company-exchange space-between">
            <h4>Exchange:</h4>
            <h4 className="profile-value">{props.profileResult.exchange}</h4>
          </div>

          {props.profileResult["CEO"] ? (
            <div className="company-ceo space-between">
              <h4>CEO:</h4>
              <h4 className="profile-value">{props.profileResult["CEO"]}</h4>
            </div>
          ) : null}
          {/* </div> */}

          {/* <div className="profile-sec-3"> */}
          {props.profileResult.sector ? (
            <div className="company-sector space-between">
              <h5>Sector:</h5>
              <h5 className="profile-value">{props.profileResult.sector}</h5>
            </div>
          ) : null}

          {props.profileResult.industry ? (
            <div className="company-industry space-between">
              <h5>Industry:</h5>
              <h5 className="profile-value">{props.profileResult.industry}</h5>
            </div>
          ) : null}
          {/* </div> */}
        </div>

        <div className="profile-general-sec-3">
          <p className="company-description">
            {props.profileResult.description}
          </p>

          <h6 className="company-website">
            <a href={props.profileResult.website}>
              {props.profileResult.website}
            </a>
          </h6>
        </div>

        <button className="save-button" onClick={props.saveToFirebase}>
          <h5>SAVE CURRENT SNAPSHOT</h5>
        </button>
      </section>
    );
  }
};

export default CompanyProfile;

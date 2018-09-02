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
        <h2 className="company-name">{props.profileResult.companyName}</h2>
        <h3 className="company-ticker">({props.userInput})</h3>
        <div className="company-exchange space-between">
          <h4>Exchange:</h4>
          <h4>{props.profileResult.exchange}</h4>
        </div>

        {props.profileResult["CEO"] ? (
          <div className="company-ceo space-between">
            <h4>CEO:</h4>
            <h4>{props.profileResult["CEO"]}</h4>
          </div>
        ) : null}

        {props.profileResult.sector ? (
          <div className="company-sector space-between">
            <h5>Sector:</h5>
            <h5>{props.profileResult.sector}</h5>
          </div>
        ) : null}

        {props.profileResult.industry ? (
          <div className="company-industry space-between">
            <h5>Industry:</h5>
            <h5>{props.profileResult.industry}</h5>
          </div>
        ) : null}

        <p className="company-description">{props.profileResult.description}</p>

        <h6 className="company-website">
          <a href={props.profileResult.website}>
            {props.profileResult.website}
          </a>
        </h6>

        <button className="save-button" onClick={props.saveToFirebase}>
          SAVE CURRENT SNAPSHOT
        </button>
      </section>
    );
  }
};

export default CompanyProfile;

import React from "react";

const Load = props => {
  return (
    <div className="loading-container">
      <h3 className="loading-description">
        Want to load an already existing snapshot?
        <br />
        Enter your key below.
      </h3>
      <form
        action=""
        className="loading-form"
        onSubmit={props.getDataFromFirebase}
      >
        <input
          className="load-field"
          onChange={props.getSavedInput}
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

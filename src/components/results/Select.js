import React from "react";

const Select = props => {
  return (
    <div className="select-div">
      <select
        onChange={event => props.getUserFSLIChange(event, props.i)}
        className="all-fslis-select"
        defaultValue={props.item.fsli}
        key={props.i}
      >
        {typeof props.availableFSLIs.is !== "undefined" &&
        props.availableFSLIs.is.length > 0 ? (
          <optgroup className="is-fslis" label="Income Statement">
            {props.availableFSLIs.is.map(fsli => {
              return (
                <option value={fsli} key={fsli}>
                  {fsli}
                </option>
              );
            })}
          </optgroup>
        ) : null}

        {typeof props.availableFSLIs.bs !== "undefined" &&
        props.availableFSLIs.bs.length > 0 ? (
          <optgroup className="bs-fslis" label="Balance Sheet">
            {props.availableFSLIs.bs.map(fsli => {
              return (
                <option value={fsli} key={fsli}>
                  {fsli}
                </option>
              );
            })}
          </optgroup>
        ) : null}
      </select>
    </div>
  );
};

export default Select;

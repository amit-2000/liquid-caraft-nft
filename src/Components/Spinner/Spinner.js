import React from "react";

import "./Spinner.css";

const Spinner = (props) => {
    // eslint-disable-next-line react/prop-types
    const { withoutMargin } = props;
    return (
        <>
            <div
                className={`loader ${withoutMargin ? "without-margin" : ""}`}
            />
            <div className="modal-backdrop" />
        </>
    );
};

export default Spinner;

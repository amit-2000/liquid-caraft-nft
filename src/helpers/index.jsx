import React from "react";
import PropTypes from "prop-types";
import ReactLoading from "react-loading";

export const WithLoadingHoc = (Component) =>
    function WithLoadingComponent({ isLoading, ...props }) {
        return !isLoading ? (
            <Component {...props} />
        ) : (
            <div className="loader">
                <ReactLoading color="#140b63" type="spin" />
            </div>
        );
        WithLoadingComponent.propTypes = {
            isLoading: PropTypes.bool.isRequired,
            rest: PropTypes.any
        };
    };
    
export const truncateAddress = (address, first = 5, last = 5) =>
address
  ? `${address.slice(0, first)}...${address.slice(-last, address.length)}`
  : null;

export const WithLoadingComponent = WithLoadingHoc(() => <></>);


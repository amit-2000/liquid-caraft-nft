import React from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";

const LiquidCraftModal = ({ show, onClose, children, header }) => {
    return (
        <Modal
            className="modal fade liquidcraftmodal"
            id=""
            show={show}
            onHide={onClose}
            backdrop={false}
            keyboard={false}
        >
           
            {/* )} */}
            <Modal.Body>
                <div>{children}</div>
            </Modal.Body>
        </Modal>
    );
};

export default LiquidCraftModal;
LiquidCraftModal.propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func,
    header: PropTypes.string,
    children: PropTypes.element
};

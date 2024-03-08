import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './DeleteModal.css';

const DeleteModal = ({ title, message, handleCancel, handleDelete }) =>
    (
        <Modal show={true} onHide={handleCancel} className='delete-modal' centered>
            <Modal.Header className=''>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='delete-modal-body'>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Confirm Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );

export default DeleteModal;
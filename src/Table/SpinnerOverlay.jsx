import React from "react";
import { Spinner } from "react-bootstrap";
import './SpinnerOverlay.css';

const SpinnerOverlay =  () => (
    <div class="overlay">
        <div class="overlay-content"><Spinner animation="grow" variant="primary" size='sm'/>
            <Spinner animation="grow" variant="secondary" size='sm'/>
            <Spinner animation="grow" variant="success" size='sm'/>
            <Spinner animation="grow" variant="danger" size='sm'/>
            <Spinner animation="grow" variant="warning" size='sm'/>
            <Spinner animation="grow" variant="info" size='sm'/>
            <Spinner animation="grow" variant="dark" size='sm'/>
        </div>
    </div>
)

export default SpinnerOverlay;
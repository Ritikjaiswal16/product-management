import React, { useEffect, useRef, useState } from "react";
import { ProgressBar, Toast } from "react-bootstrap";
import "boxicons";
import './Toaster.css';

const Toaster = ({toastMessage, onClose, variant}) => {
    const initialTime = 10; // in seconds
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [progressBarPercent, setProgressBarPercent] = useState(0);
 
    const timerId = useRef();
 
    useEffect(() => {
        if (initialTime) {
            timerId.current = window.setInterval(() => {
                setTimeLeft((prevProgress) => prevProgress - 1);
            }, 500);
 
            return () => {
                clearInterval(timerId.current);
            };
        }
    }, []);
 
    useEffect(() => {
        if (initialTime) {
            if (progressBarPercent < 100) {
                let updateProgressPercent = Math.round(
                    ((initialTime - (timeLeft - 1)) / initialTime) * 100
                );
                setProgressBarPercent(updateProgressPercent);
            }
 
            if (timeLeft === 0 && timerId.current) {
                clearInterval(timerId.current);
 
                return;
            }
        }
    }, [timeLeft]);
    return (
        <Toast
            className="position-fixed bottom-0 end-0 toaster"
            style={{ "z-index": "11" }}
            bg={variant}
            onClose={onClose}
            delay={5000}
            animation
            autohide
            show
        >

            <Toast.Body className="toaster-body">
                {toastMessage}
                <div className="progress-div">
            <ProgressBar variant="success" now={progressBarPercent} />
            </div>
            </Toast.Body>
        </Toast>
    )
}

export default Toaster;
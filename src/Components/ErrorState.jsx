import React from "react";
import { Image } from "react-bootstrap";

const ErrorState = () => {
    return(
        <div className="d-flex flex-column align-items-center">
        <Image style={{width: "300px", height:"200px"}} src={"/error.jpg"}/>
        <h2>Something went wrong</h2>
        <h4>Try refreshing the page</h4>
        </div>
    )
}

export default ErrorState;
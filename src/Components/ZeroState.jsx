import React from "react";
import { Image } from "react-bootstrap";

const ZeroState = () => {
    return(
        <div className="d-flex flex-column align-items-center">
        <Image style={{width: "200px", height:"200px"}} src={"/no_data.jpg" }/>
        <h2>Nothing to show here</h2>
        <h4>Try Adding new data</h4>
        </div>
    )
}

export default ZeroState;
import Accordion from "react-bootstrap/Accordion";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import React from "react";
import "./DetailsAccordions.css";

function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () => console.log(""));

  return (
    <button
      type="button"
      style={{
        backgroundColor:"white",
        width: "100%",
        border: "None",
        height: "100%",
      }}
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}

const DetailsAccordions = ({ backButton, title, rightButton, body }) => (
  <Accordion defaultActiveKey="0" className="basic-details-accordion">
   
      <div className="d-flex justify-content-between basic-details-heading-accordion">
        {backButton}
        <CustomToggle eventKey="0">{title}</CustomToggle>
        {rightButton}
      </div>
      <Accordion.Collapse eventKey="0">
        <div >
          <hr></hr>
          <div className="basic-details-accordion-body">{body}</div>

        </div>
      </Accordion.Collapse>
  </Accordion>
);

export default DetailsAccordions;

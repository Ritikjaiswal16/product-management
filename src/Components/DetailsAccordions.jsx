import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import React from 'react';
import './DetailsAccordions.css';


function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log(''),
  );

  return (
    <button
      type="button"
      style={{ backgroundColor: 'white' ,width:"100%" ,border:"None", height:"100%"}}
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}

const DetailsAccordions = ({ backButton,title,rightButton, body}) =>
    (
    <Accordion defaultActiveKey="0" >
      <div  className='basic-details-accordion'>
      <div className="d-flex justify-content-between pb-0 basic-details-heading-accordion">
        {backButton} 
        <CustomToggle eventKey="0">{title}</CustomToggle>
        {rightButton}
        </div>
        <Accordion.Collapse eventKey="0" className='mt-0 pt-0'>
            <div>
                <hr></hr>
                {body}
            </div>
        </Accordion.Collapse>
      </div>
    </Accordion>
    );

    export default DetailsAccordions;
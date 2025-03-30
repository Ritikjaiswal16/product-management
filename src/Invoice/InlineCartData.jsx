import React, { useState } from "react";
import { Card } from "react-bootstrap";
import FieldWithCounter from "../Components/FieldWithCounter";

const InlineCartData = ({ data, ...props }) => {
  return (
    <FieldWithCounter
      maxValue={data.quantity}
      key={data.batch_number}
      props={props}
    />
  );
};

export default InlineCartData;

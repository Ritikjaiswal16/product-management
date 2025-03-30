import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

const FieldWithCounter = ({ maxValue, key, props }) => {
  const handleCounterChange = (value) => {
    if (value <= 0) {
      props.onChange(0);
    } else if (value >= maxValue) {
      props.onChange(maxValue);
    } else {
      props.onChange(value);
    }
  };
  const quantity = props.value;
  return (
    <div className="d-flex">
      <Button
        onClick={() => props.onChange(quantity - 1)}
        disabled={quantity <= 0}
      >
        -
      </Button>
      <Form.Control
        {...props.field}
        className="w-50"
        type="number"
        onChange={(e) => handleCounterChange(e.target.value)}
        value={quantity}
        max={maxValue}
        min={0}
        handleBlur={props.onBlur}
      />
      <Button
        onClick={() => props.onChange(quantity + 1)}
        disabled={quantity >= maxValue}
      >
        +
      </Button>
    </div>
  );
};

export default FieldWithCounter;

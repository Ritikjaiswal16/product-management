import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

const PasswordLabel = ({value}) => {
    const [showPassword, setShowPassword] = useState(false);

    console.log("seomt")

    return(<InputGroup className='mt-3'>
    <Form.Control
        id={'Password'}
        size="lg"
        type={showPassword? "text" : "password"}
        readOnly
        value={value}
    />
    <InputGroup.Text>
        <span onClick={() => setShowPassword(!showPassword)} class={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}>i</span>
    </InputGroup.Text>
</InputGroup>)
}

export default PasswordLabel;
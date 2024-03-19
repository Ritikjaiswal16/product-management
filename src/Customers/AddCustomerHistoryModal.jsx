import { Formik } from "formik";
import React from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";

const AddCustomerHistoryModal = ({ setShowModal, handleSave }) => {
    const validateProduct = (values) => {
        let errors = {};
        if (!values.amount || values.amount <= 0) {
            errors.amount = "Amount should be a positive number"
        }
        return errors;
    }

    return (<Modal show onHide={() => setShowModal(null)} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Recipt</Modal.Title>
        </Modal.Header>
        <Formik
            initialValues={{ get_change_type_display: "Deposit", payment_type:"Cash"}}
            validate={validateProduct}
            onSubmit={handleSave}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isValid,
                dirty
            }) => (
                <>
                    <Form noValidate onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Form.Group>
                                    <Form.Select
                                    className="mb-3"
                                        style={{ padding: "15px" }}
                                        name="get_change_type_display"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.get_change_type_display}
                                        isInvalid={errors.get_change_type_display && touched.get_change_type_display}
                                    >
                                        <option value="Deposit">Deposit</option>
                                        <option value="Other Deduction">Other Deduction</option>
                                    </Form.Select>
                            </Form.Group>
                            <Form.Group >
                                <FloatingLabel
                                    label="Description"
                                    className="mb-3"
                                >
                                    <Form.Control
                                        name="description"
                                        type="text"
                                        placeholder="description"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={errors.description && touched.description}
                                        value={values.description}
                                    />
                                </FloatingLabel>
                            </Form.Group>
                            <div className="d-flex gap-3">
                            <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                                <FloatingLabel
                                    label="Amount"
                                    className="mb-3"
                                >
                                    <Form.Control
                                        name="amount"
                                        type="number"
                                        placeholder="00"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={errors.amount && touched.amount}
                                        value={values.amount}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.amount}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>
                            { values.get_change_type_display !=="Other Deduction" &&<Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                                <Form.Select
                                    style={{ padding: "15px" }}
                                    name="payment_type"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.payment_type}
                                    isInvalid={errors.payment_type && touched.payment_type}
                                >
                                    <option value="cash">Cash</option>
                                    <option value="cheque">Cheque</option>
                                    <option value="RTGS">RTGS</option>
                                    <option value="NEFT">NEFT</option>
                                    <option value="UPI">UPI</option>
                                    <option value="card">Card</option>
                                </Form.Select>
                            </Form.Group>}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(null)}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit" disabled={!isValid || !dirty}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Form>
                </>
            )}
        </Formik>
    </Modal>)
}

export default AddCustomerHistoryModal;
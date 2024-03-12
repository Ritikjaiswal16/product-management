import { Formik } from "formik";
import React from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";

const AddInventoryModal = ({ showModal, setShowModal, handleSave }) => {
    const validateInventory = (values) => {
        let errors = {};
        if (!values.inventory_name) {
            errors.inventory_name = "Inventory Name cannot be empty"
        }
        if (!values.inventory_net_quantity) {
            errors.inventory_net_quantity = "Please provide net quantity of inventory"
        }
        if (!values.inventory_manufacturer) {
            errors.inventory_manufacturer = "Please provide Manufacturer of inventory"
        }
        if (!values.inventory_hsn) {
            errors.inventory_hsn = "Please provide HSN code written on inventory"
        }
        if (!values.inventory_measure_unit) {
            errors.inventory_measure_unit = "Please select one measuring unit of inventory"
        }
        if(!values.inventory_sp_credit){
            errors.inventory_sp_credit = "Please provide credit price"
        }
        if (!values.inventory_gst_percentage) {
            errors.inventory_gst_percentage = "Please provide GST number"
        }
        if (!values.inventory_sp_gst) {
            errors.inventory_sp_gst = "Please provide estimated selling price including GST"
        }
        if (!values.inventory_notify_count) {
            errors.inventory_notify_count = "Please provide notify count to remind when reach that value"
        }
        return errors;
    }

    return (<Modal show={true} onHide={() => setShowModal(null)} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Add Inventory</Modal.Title>
        </Modal.Header>
        <Formik
            initialValues={Object.keys(showModal)?.length ? showModal:{inventory_gst_percentage:18, inventory_notify_count:5}}
            validate={validateInventory}
            onSubmit={handleSave}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                setFieldValue,
                handleSubmit,
                isValid,
                dirty
            }) => (
                <>
                    <Form noValidate onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Form.Group>
                                <FloatingLabel
                                    label="Inventory Name"
                                    className="mb-3"
                                >
                                    <Form.Control
                                        name="inventory_name"
                                        type="text"
                                        placeholder="some inventory name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={errors.inventory_name && touched.inventory_name}
                                        value={values.inventory_name}
                                        autoFocus
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {errors.inventory_name}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group>
                                <FloatingLabel
                                    label="Inventory Manufacturer Name"
                                    className="mb-3"
                                >
                                    <Form.Control
                                        name="inventory_manufacturer"
                                        type="text"
                                        placeholder="some inventory name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={errors.inventory_manufacturer && touched.inventory_manufacturer}
                                        value={values.inventory_manufacturer}
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {errors.inventory_manufacturer}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group>
                                <FloatingLabel
                                    label="HSN/SAC Code"
                                    className="mb-3"
                                >
                                    <Form.Control
                                        name="inventory_hsn"
                                        type="text"
                                        placeholder="45HSNU56"
                                        onChange={(e) => setFieldValue('inventory_hsn', e.target.value?.toUpperCase())}
                                        onBlur={handleBlur}
                                        isInvalid={errors.inventory_hsn && touched.inventory_hsn}
                                        value={values.inventory_hsn}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.inventory_hsn}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>
                            <div className="d-flex gap-3">
                                <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                                    <FloatingLabel
                                        label="Net Quantity"
                                        className="mb-3"
                                    >
                                        <Form.Control
                                            name="inventory_net_quantity"
                                            type="number"
                                            placeholder="12"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={errors.inventory_net_quantity && touched.inventory_net_quantity}
                                            value={values.inventory_net_quantity}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.inventory_net_quantity}
                                        </Form.Control.Feedback>
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                                    <Form.Select
                                        style={{ padding: "15px" }}
                                        name="inventory_measure_unit"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.inventory_measure_unit}
                                        isInvalid={errors.inventory_measure_unit && touched.inventory_measure_unit}
                                    >
                                        <option className="d-none" selected disabled>Measure Unit</option>
                                        <option value="ml">Milli Liter (ml)</option>
                                        <option value="l">Liter (l)</option>
                                        <option value="gm">Gram (gm)</option>
                                        <option value="kg">Kilogram (kg)</option>`
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.inventory_measure_unit}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="d-flex gap-3">
                                <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                                    <FloatingLabel
                                        label="Selling Price (in Rupees)"
                                        className="mb-3"
                                    >
                                        <Form.Control
                                            name="inventory_sp_gst"
                                            type="number"
                                            placeholder="90"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={errors.inventory_sp_gst && touched.inventory_sp_gst}
                                            value={values.inventory_sp_gst}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.inventory_sp_gst}
                                        </Form.Control.Feedback>
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                                    <FloatingLabel
                                        label="Credit Price (in Rupees)"
                                        className="mb-3"
                                    >
                                        <Form.Control
                                            name="inventory_sp_credit"
                                            type="number"
                                            placeholder="90"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={errors.inventory_sp_credit && touched.inventory_sp_credit}
                                            value={values.inventory_sp_credit}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.inventory_sp_credit}
                                        </Form.Control.Feedback>
                                    </FloatingLabel>
                                </Form.Group>
                                

                            </div>
                            <div className="d-flex gap-3">
                            <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                                    <FloatingLabel
                                        label="Total GST (in %)"
                                        className="mb-3"
                                    >
                                        <Form.Control
                                            name="inventory_gst_percentage"
                                            type="number"
                                            placeholder="9"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={errors.inventory_gst_percentage && touched.inventory_gst_percentage}
                                            value={values.inventory_gst_percentage}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.inventory_gst_percentage}
                                        </Form.Control.Feedback>
                                    </FloatingLabel>
                                </Form.Group>
                            <Form.Group style={{ "padding-top": "1px", width: "50%" }}>
                                <FloatingLabel
                                    label="Notify Count"
                                    className="mb-3"
                                >
                                    <Form.Control
                                        name="inventory_notify_count"
                                        type="number"
                                        placeholder="90"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={errors.inventory_notify_count && touched.inventory_notify_count}
                                        value={values.inventory_notify_count}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.inventory_notify_count}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>
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

export default AddInventoryModal;
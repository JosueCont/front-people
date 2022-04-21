import { Form, Input, Row, Col } from "antd";
import { useEffect } from "react";
import SelectWorkTitle from "../selects/SelectWorkTitle";

const LegalRepresentative = ({ form, legalRepresentative }) => {
  useEffect(() => {
    if (legalRepresentative) setForm(legalRepresentative);
  }, [legalRepresentative]);

  const setForm = (data) => {
    form.setFieldsValue({
      name: data.name,
      work_title: data.work_title,
      email: data.email,
      phone: data.phone,
      contact_name: data.contact_name,
      contact_email: data.contact_email,
    });
  };

  return (
    <Form layout={"vertical"} form={form}>
      <Row>
        <Col lg={6} xs={22}>
          <Form.Item name="name" label="Nombre">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22} offset={1}>
          <SelectWorkTitle />
        </Col>
        <Col lg={6} xs={22} offset={1}>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="phone" label="Telefono">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={13} xs={22} offset={1}>
          <Form.Item name="contact_name" label="Nombre de contacto">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={13} xs={22}>
          <Form.Item name="contact_email" label="Correo de contacto">
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default LegalRepresentative;

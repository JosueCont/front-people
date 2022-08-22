import { Form, Input, Row, Col } from "antd";
import { useEffect } from "react";
import SelectWorkTitle from "../../selects/SelectWorkTitle";
import { onlyNumeric, ruleRequired, ruleWhiteSpace } from "../../../utils/rules";

const LegalRepresentative = ({ form, legalRepresentative, pushed, ...props }) => {
  useEffect(() => {
    if (legalRepresentative) setForm(legalRepresentative);
  }, [legalRepresentative]);

  const setForm = (data) => {
    form.setFieldsValue({
      name: data.name,
      // work_title: data.work_title,
      position: data.position,
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
          <Form.Item name="name" label="Nombre" rules={[ruleRequired, ruleWhiteSpace]}>
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22} offset={1}>
          {/* <SelectWorkTitle /> */}
          <Form.Item name="position" label="Puesto de trabajo">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22} offset={1}>
          <Form.Item name="email" label="Email" rules={[ruleRequired, ruleWhiteSpace]}>
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="phone" label="Teléfono" rules={[ruleRequired,onlyNumeric, ruleWhiteSpace]}>
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

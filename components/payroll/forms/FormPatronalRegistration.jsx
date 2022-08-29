import { Form, Input, Row, Col, Select } from "antd";
import {
  onlyNumeric,
  ruleRequired,
  ruleWhiteSpace,
} from "../../../utils/rules";
import SelectImssDelegation from "../../../components/selects/SelectImssDelegation";
import SelectImssSubdelegation from "../../../components/selects/SelectImssSubdelegation";

const FormPatronalRegistration = ({
  node,
  form,
  patronalRegistration = {},
  pushed,
  ...props
}) => {
  return (
    <Form layout={"vertical"} form={form} id="formGeneric">
      <Row gutter={20}>
        <Col lg={6} xs={22}>
          <Form.Item
            name="code"
            label="Clave de registro patronal"
            rules={[ruleRequired, ruleWhiteSpace]}
          >
            <Input maxLength={11} />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item
            name="economic_activity"
            label="Actividad economica"
            rules={[ruleRequired, ruleWhiteSpace]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item
            name="social_reason"
            label="Razón social"
            rules={[ruleRequired, ruleWhiteSpace]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item
            name="subsidy_reimbursement_agreement"
            label="Convenio de reembolso de subsidio"
            rules={[ruleRequired, ruleWhiteSpace]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item
            name="phone"
            label="Teléfono"
            rules={[ruleRequired, onlyNumeric, ruleWhiteSpace]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="state" label="Tipo de contribución">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="geographic_area" label="Area geografica">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <SelectImssDelegation />
        </Col>
        <Col lg={6} xs={22}>
          <SelectImssSubdelegation />
        </Col>
      </Row>
    </Form>
  );
};
export default FormPatronalRegistration;

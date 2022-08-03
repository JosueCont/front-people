import { Form, Input, Row, Col, Select } from "antd";
import { onlyNumeric } from "../../../utils/rules";

const FormPatronalRegistration = ({
  node,
  form,
  patronalRegistration = {},
  ...props
}) => {
  return (
    <Form layout={"vertical"} form={form}>
      <Row gutter={20}>
        <Col lg={6} xs={22}>
          <Form.Item name="code" label="Clave de registro patronal">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="economic_activity" label="Actividad economica">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item
            name="subsidy_reimbursement_agreement"
            label="Convenio de reembolso de subsidio"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="phone" label="Teléfono" rules={[onlyNumeric]}>
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="state" label="Tipo de contribución">
            <Select
              options={[]}
              notFoundContent={"No se encontraron resultados."}
            />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="geographic_area" label="Area geografica">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="imss_delegation" label="Delegacion del IMSS">
            <Select
              options={[]}
              notFoundContent={"No se encontraron resultados."}
            />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="imss_subdelegation" label="Subdelegacion del IMSS">
            <Select
              options={[]}
              notFoundContent={"No se encontraron resultados."}
            />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="ledger_account" label="Cuenta contable">
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default FormPatronalRegistration;

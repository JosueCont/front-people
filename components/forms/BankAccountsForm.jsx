import React from "react";
import { withAuthSync } from "../../libs/auth";
import { Form, Input, Row, Col, Typography } from "antd";

const BankAccountsForm = (props) => {
  const { form } = Form.useForm();
  const { Title } = Typography;

  return (
    <>
      <Col span={24}>
        <Form.Item label="Colaborador">
          <Input value={props.data ? props.data.employee : null} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Número de cuenta">
          <Input value={props.data ? props.data.account_number : null} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Cuenta clabe">
          <Input value={props.data ? props.data.interbank_key : null} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Banco">
          <Input value={props.data ? props.data.bank : null} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Número de tarjeta">
          <Input value={props.data ? props.data.card_number : null} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Mes">
          <Input value={props.data ? props.data.expiration_month : null} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Año">
          <Input value={props.data ? props.data.expiration_year : null} />
        </Form.Item>
      </Col>
    </>
  );
};

export default withAuthSync(BankAccountsForm);

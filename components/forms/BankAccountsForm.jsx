import React from "react";
import { withAuthSync } from "../../libs/auth";
import { Form, Input, Row, Col, Typography } from "antd";

const BankAccountsForm = (props) => {
  const { form } = Form.useForm();
  const { Title } = Typography;

  return (
    <>
      <Form.Item label="Colaborador" labelCol={{ span: 7 }} labelAlign={"left"}>
        <Input value={props.data ? props.data.employee : null} />
      </Form.Item>
      <Form.Item
        label="Numero de cuenta"
        labelCol={{ span: 7 }}
        labelAlign={"left"}
      >
        <Input value={props.data ? props.data.account_number : null} />
      </Form.Item>
      <Form.Item
        label="Cuenta clabe"
        labelCol={{ span: 7 }}
        labelAlign={"left"}
      >
        <Input value={props.data ? props.data.interbank_key : null} />
      </Form.Item>
      <Form.Item label="Banco" labelCol={{ span: 7 }} labelAlign={"left"}>
        <Input value={props.data ? props.data.bank : null} />
      </Form.Item>
      <Form.Item
        label="Número de tarjeta"
        labelCol={{ span: 7 }}
        labelAlign={"left"}
      >
        <Input value={props.data ? props.data.card_number : null} />
      </Form.Item>
      <Form.Item label="Mes" labelCol={{ span: 7 }} labelAlign={"left"}>
        <Input value={props.data ? props.data.expiration_month : null} />
      </Form.Item>
      <Form.Item label="Año" labelCol={{ span: 7 }} labelAlign={"left"}>
        <Input value={props.data ? props.data.expiration_year : null} />
      </Form.Item>
    </>
  );
};

export default withAuthSync(BankAccountsForm);

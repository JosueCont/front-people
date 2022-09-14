import { Form, Input, Button, Spin, Typography } from "antd";
import { ruleRequired } from "../utils/rules";
import React from "react";
const { Text, Title } = Typography;

const RecoveryPasswordForm = (props) => {
  const validatePassword = ({ getFieldValue }) => ({
    validator(rule, value) {
      if (!value || getFieldValue("passwordOne") === value) {
        return Promise.resolve();
      }
      return Promise.reject("Las contraseñas no coinciden");
    },
  });

  return (
    <>
      <Spin tip="Cargando..." spinning={props.loading}>
        <Title level={3} className={"font-color-khor"}>
          Ingresa tu nueva contraseña
        </Title>
        <br/>
        <Form
          name="recoverPasswordform"
          layout="vertical"
          onFinish={props.onFinish}
        >
          <Form.Item
            name="passwordOne"
            rules={[ruleRequired]}
            label={"Nueva contraseña"}
            labelAlign={"left"}
            className="font-color-khor"
          >
            <Input
              style={{ marginTop: "5px" }}
              type="password"
              placeholder="Correo electrónico"
            />
          </Form.Item>
          <Form.Item
            name="passwordTwo"
            rules={[ruleRequired, validatePassword]}
            label={"Confirmar contraseña"}
            labelAlign={"left"}
            className="font-color-khor"
          >
            <Input
              style={{ marginTop: "5px" }}
              type="password"
              placeholder="Contraseña"
            />
          </Form.Item>

          <Form.Item>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={props.loading}
            >
              Cambiar contraseña
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};

export default RecoveryPasswordForm;

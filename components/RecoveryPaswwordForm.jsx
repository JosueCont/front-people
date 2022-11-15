import { Form, Input, Button, Spin, Typography } from "antd";
import { ruleRequired } from "../utils/rules";
import React from "react";
import { css, Global } from "@emotion/core";
const { Text, Title } = Typography;

const RecoveryPasswordForm = (props) => {
  const ruleRequired = { required: true, message: "Este campo es requerido" };

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
      <Global
        styles={css`
          .login-form-title {
            font-size: 30px !important;
            text-align: center;
            color: #F99543;
            letter-spacing: 0;
            font-weight: 700;
            margin-bottom: 30px;
            line-height: 35px;
          }
          
          .login-form-font-color label {
            color: #F99543 !important;
            font-weight: bold;
          }
          
          .login-form input {
            text-align: center !important;
          }

          .recover-form input::placeholder {
            text-align: center !important;
          }

          .recover-form input {
            text-align: center !important;
            border-color: "#F99543" !important;
          }

          .recover-form-button-in.ant-btn-primary {
            background-color: #F99543 !important;
            color: white !important;
            border-color: #F99543 !important;
            font-weight: bold !important;
          }

          .recover-form-button-in:disabled {
            opacity: 0.5;
            color: #fff;
          }
        `}
      />
      <Spin tip="Cargando..." spinning={props.loading}>
        <p className={"login-form-title"}>
          Ingresa tu nueva contraseña
        </p>
        <br/>
        <Form
          name="recoverPasswordform"
          layout="vertical"
          onFinish={props.onFinish}
          className="recover-form"
        >
          <Form.Item
            /* name="passwordOne"
            rules={[ruleRequired]}
            label={"Nueva contraseña"}
            labelAlign={"left"}
            className="login-form-font-color" */
          >
            <Input.Password
              style={{ borderColor: "#F99543" }}
              placeholder="Nueva contraseña"
            />
          </Form.Item>
          <Form.Item
            /* name="passwordTwo"
            rules={[ruleRequired, validatePassword]}
            label={"Confirmar contraseña"}
            labelAlign={"left"}
            className="font-color-khor" */
          >
            <Input.Password
              style={{ borderColor: "#F99543" }}
              placeholder="Confirmar contraseña"
            />
          </Form.Item>

          <Form.Item>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              className="recover-form-button-in"
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

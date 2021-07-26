import {
  Form,
  Input,
  Button,
  Checkbox,
  Spin,
  Alert,
  Typography,
  message,
} from "antd";
const { Text } = Typography;
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LOGIN_URL, APP_ID } from "../config/config";
import Axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

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
      <Spin tip="Cargando..." spinning={props.loading}>
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

          {/* {errorLogin && (
                        <Alert
                            message="Error al iniciar sesión,"
                            description="la contraseña y/o correo electrónico son incorrectos"
                            type="error"
                            style={{ textAlign: "center", marginBottom: "10px" }}
                            closable
                        />
                    )} */}
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

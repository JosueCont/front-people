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
const { Text, Title } = Typography;
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LOGIN_URL, APP_ID } from "../config/config";
import Axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

const PasswordRecover = (props) => {
  const router = useRouter();

  const [errorResponse, setErrorResponse] = useState(false);
  const [loading, setLoading] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  const onFinish = (values) => {
    sendEmail(values.email);
  };

  const sendEmail = async (email) => {
    try {
      setLoading(true);
      const headers = {
        "client-id": APP_ID,
        "Content-Type": "application/json",
      };
      const data = {
        email: email,
        send_via_email: true,
      };
      /* router.push({ pathname: "/home" }); */
      let response = await Axios.post(
        LOGIN_URL + "/password/reset/token/",
        data,
        { headers: headers }
      );

      setSendSuccess(true);
    } catch (e) {
      setErrorResponse(true);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const ruleRequired = { required: true, message: "Este campo es requerido" };

  return (
    <>
      <Spin tip="Cargando..." spinning={loading}>
        <Form
          name="normal_login"
          className="login-form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          {sendSuccess ? (
            <Title level={4} className={"font-color-khor"}>
              Correo electrónico enviado correctamente
            </Title>
          ) : (
            <>
              <Form.Item
                name="email"
                rules={[ruleRequired]}
                label="Correo electrónico"
                className="font-color-khor"
              >
                <Input
                  style={{ marginTop: "5px" }}
                  placeholder="Correo electrónico"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Enviar
                </Button>
              </Form.Item>
            </>
          )}

          {errorResponse && (
            <Alert
              message="Error al iniciar sesión,"
              description="la contraseña y/o correo electrónico son incorrectos"
              type="error"
              style={{ textAlign: "center", marginBottom: "10px" }}
              closable
            />
          )}

          <Form.Item style={{ textAlign: "right" }}>
            <Text
              className={"font-color-khor pointer"}
              onClick={() => props.setRecoverPasswordShow(false)}
            >
              Regresar al Login
            </Text>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};

export default PasswordRecover;

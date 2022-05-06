import { Form, Input, Button, Spin, Alert, Typography } from "antd";
const { Text, Title } = Typography;
import { useState } from "react";
import { useRouter } from "next/router";
import Axios from "axios";
import { ruleRequired } from "../utils/rules";
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
        "client-id": props.generalConfig.client_khonnect_id,
        "Content-Type": "application/json",
      };
      const data = {
        email: email,
        send_via_email: true,
      };
      /* router.push({ pathname: "/home/persons/" }); */
      let response = await Axios.post(
        props.generalConfig.url_server_khonnect + "/password/reset/token/",
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
          <Form.Item>
            <p className={"form-title"}>A new people management system</p>
            <p className={"form-subtitle"}>Recuperar contraseña</p>
          </Form.Item>
          {sendSuccess ? (
            <Alert
              message="Correo electrónico enviado correctamente"
              description="Seguir las instrucciones para poder recuperar la contraseña"
              type="success"
              style={{ textAlign: "center", marginBottom: "10px" }}
              closable
            />
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

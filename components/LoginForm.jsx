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

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [errorLogin, setErrorLogin] = useState(false);
  const onFinish = (values) => {
    login(values.email, values.password);
  };

  const login = async (email, password) => {
    try {
      setErrorLogin(false);
      setLoading(true);
      const headers = {
        "client-id": APP_ID,
        "Content-Type": "application/json",
      };
      const data = {
        email: email,
        password: password,
      };
      Axios.post(LOGIN_URL + "/login/", data, { headers: headers })
        .then(function (response) {
          if (response.status === 200) {
            let token = jwt_decode(response.data.token);
            if (token) {
              message.success("Acceso correcto.");
              Cookies.set("token", token);
              setLoading(false);
              router.push({ pathname: "/home" });
            }
          } else {
            setLoading(false);
            setErrorLogin(true);
          }
        })
        .catch(function (error) {
          setLoading(false);
          setErrorLogin(true);
          console.log(error);
        });
    } catch (e) {
      alert(
        "Hubo un  problema al iniciar sesión, por favor verifica tus credenciales"
      );
      console.log(e);
    } finally {
    }
  };

  return (
    <>
      <Spin tip="Loading..." spinning={loading}>
        <Form
          name="normal_login"
          className="login-form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Text className="font-color-khor">Email</Text>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input style={{ marginTop: "5px" }} placeholder="Correo" />
          </Form.Item>
          <Text className="font-color-khor">Password</Text>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              style={{ marginTop: "5px" }}
              type="password"
              placeholder="Contraseña"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="remember"
              valuePropName="checked"
              className="ckeck-khor"
              style={{ float: "right", marginBottom: "5px" }}
            >
              <Checkbox className="font-color-khor">Remember me</Checkbox>
            </Form.Item>
          </Form.Item>
          {errorLogin && (
            <Alert
              message="Error iniciar sesión"
              description="La contraseña y/o correo no son correctos"
              type="error"
              style={{ textAlign: "center" }}
            />
          )}

          <Form.Item>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Iniciar sesión
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};

export default LoginForm;

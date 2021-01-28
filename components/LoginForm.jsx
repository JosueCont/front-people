import { Form, Input, Button, Checkbox, Spin, Alert } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LOGIN_URL } from "../config/config";
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
        "client-id": "5f417a53c37f6275fb614104",
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
              Cookies.set("userToken", token);
              // console.log(
              //   "Obteniendo coockies",
              //   JSON.parse(Cookies.get("userToken"))
              // );
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
      //console.log(e);
    } finally {
    }
  };

  return (
    <>
      <Spin tip="Loading..." spinning={loading}></Spin>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          label="Correo"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Contraseña"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
            className="ckeck-khor"
            noStyle
          >
            <Checkbox>Remember me</Checkbox>
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
            style={{ width: "100%!important" }}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginForm;

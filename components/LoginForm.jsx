import {
  Form,
  Input,
  Button,
  Spin,
  Alert,
  Typography,
  message,
  Checkbox,
} from "antd";
const { Text } = Typography;
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import WebApiPeople from "../api/WebApiPeople";
import { EyeOutlined, MailOutlined, LinkOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { setUserPermissions } from "../redux/UserDuck";
import { getCfdiVersion } from "../redux/fiscalDuck";
import { ruleEmail, ruleRequired } from "../utils/rules";

const LoginForm = ({
  recoveryPsw = true,
  setPerson = null,
  setKhonnectId = null,
  generalConfig,
  ...props
}) => {
  const router = useRouter();
  const [loginForm] = Form.useForm();
  const [loading, setLoading] = useState(null);
  const [errorLogin, setErrorLogin] = useState(false);
  const [infoSite, setInfoSite] = useState({
    privacy_notice_link: null,
    privacy_notice_text: null,
    terms_and_conditions_link: null,
    terms_and_conditions_text: null,
  });
  const [termsAndConditionsAccept, setTermsAndConditionsAccept] =
    useState(false);
  const onFinish = (values) => {
    login(values.email, values.password);
  };

  let data_token = "";

  const saveJWT = async (jwt) => {
    try {
      let data = {
        khonnect_id: jwt.user_id,
        jwt: { ...jwt, metadata: [{ token: data_token }] },
      };

      let response = await WebApiPeople.saveJwt(data);
      if (response.status == 200) {
        if (response.data.is_active) return true;
        return false;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const getIfno = async () => {
    const headers = {
      headers: {
        "client-id": generalConfig.client_khonnect_id,
        "Content-Type": "application/json",
      },
    };
    try {
      await Axios.get(
        generalConfig.url_server_khonnect +
          `/appstore/app/get/id=${generalConfig.client_khonnect_id}`,
        headers
      )
        .then((res) => {
          let info = res.data.data;
          setInfoSite({
            privacy_notice_link: info.privacy_notice_link,
            privacy_notice_text: info.privacy_notice_text,
            terms_and_conditions_link: info.terms_and_conditions_link,
            terms_and_conditions_text: info.terms_and_conditions_text,
          });
        })
        .catch((err) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (generalConfig) {
      getIfno();
    }
  }, [generalConfig]);

  const login = async (email, password) => {
    try {
      setErrorLogin(false);
      setLoading(true);
      const headers = {
        "client-id": generalConfig.client_khonnect_id,
        "Content-Type": "application/json",
      };
      const data = {
        email: email,
        password: password,
      };
      Axios.post(generalConfig.url_server_khonnect + "/login/", data, {
        headers: headers,
      })
        .then(function (response) {
          if (response.status === 200) {
            data_token = response["data"]["token"];
            let token = jwt_decode(response.data.token);
            if (setKhonnectId) {
              setKhonnectId(token.user_id);
              return;
            }
            if (token) {
              saveJWT(token).then(function (responseJWT) {
                if (responseJWT) {
                  props.getCfdiVersion();
                  props
                    .setUserPermissions(token.perms)
                    .then((response) => {
                      message.success("Acceso correcto.");
                      delete token.perms;
                      Cookies.set("token", token);
                      setTimeout(() => {
                        setLoading(false);
                        router.push({
                          pathname: "/select-company",
                        });
                      }, 2000);
                    })
                    .catch((error) => {
                      message.error("Acceso denegado");
                    });
                } else {
                  message.error("Acceso denegado");
                  setLoading(false);
                }
              });
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
      <Spin tip="Cargando..." spinning={loading}>
        <Form
          name="normal_login"
          className="login-form"
          // layout="vertical"
          form={loginForm}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item>
            <p className={"form-title"}>A new people management system</p>
            <p className={"form-subtitle"}>Inicio de sesión</p>
          </Form.Item>
          <Form.Item
            name="email"
            rules={[ruleRequired, ruleEmail]}
            className="font-color-khor"
          >
            <Input
              style={{ marginTop: "5px" }}
              placeholder="Correo electrónico"
              onBlur={(value) =>
                loginForm.setFieldsValue({
                  email: value.target.value.toLowerCase(),
                })
              }
              prefix={<MailOutlined />}
            />
          </Form.Item>
          <Text className="font-color-khor"></Text>
          <Form.Item
            name="password"
            rules={[ruleRequired]}
            className="font-color-khor"
          >
            <Input.Password
              style={{ marginTop: "5px" }}
              type="password"
              placeholder="Contraseña"
              prefix={<EyeOutlined />}
            />
          </Form.Item>

          {errorLogin && (
            <Alert
              message="Error al iniciar sesión."
              description="La contraseña y/o correo electrónico son incorrectos."
              type="error"
              style={{ textAlign: "center", marginBottom: "10px" }}
              closable
            />
          )}
          {recoveryPsw && (
            <Form.Item className={"font-color-khor"}>
              <b>¿Olvidaste tu contraseña? </b>
              <span
                onClick={() => props.setRecoverPasswordShow(true)}
                className={"pointer text-link"}
                style={{ color: "blue", textDecoration: "underline" }}
              >
                haz clic aquí
              </span>
            </Form.Item>
          )}
          {infoSite.terms_and_conditions_link && (
            <Form.Item style={{ marginBottom: 5 }}>
              <Checkbox
                onChange={(e) => setTermsAndConditionsAccept(e.target.checked)}
              >
                Acepto los términos y condiciones
              </Checkbox>
              |
              <a href={infoSite.terms_and_conditions_link} target="_blank">
                <LinkOutlined size={"small"} />
              </a>
            </Form.Item>
          )}
          <Form.Item>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              className="login-form-button"
              disabled={
                infoSite.terms_and_conditions_link
                  ? !termsAndConditionsAccept
                    ? true
                    : false
                  : false
              }
            >
              Iniciar sesión
            </Button>
          </Form.Item>
          {infoSite.privacy_notice_link && (
            <Form.Item style={{ textAlign: "right" }}>
              <span className="text-link">
                <a target="_blank" href={infoSite.privacy_notice_link}>
                  Aviso de privacidad.
                </a>
              </span>
            </Form.Item>
          )}
        </Form>
      </Spin>
    </>
  );
};

const mapState = () => {
  return {};
};

export default connect(mapState, { setUserPermissions, getCfdiVersion })(
  LoginForm
);

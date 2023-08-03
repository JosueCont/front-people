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
import { urlSocial } from "../config/config";
import { redirectTo, getCurrentURL } from "../utils/constant";

const LoginForm = ({
    recoveryPsw = true,
    setPerson = null,
    setKhonnectId = null,
    generalConfig,
    getCfdiVersion,
    setUserPermissions,
    setRecoverPasswordShow,
}) => {

    let data_token = "";
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
    const [termsAndConditionsAccept, setTermsAndConditionsAccept] = useState(false);

    useEffect(() => {
        if (generalConfig) {
            getIfno();
        }
    }, [generalConfig]);

    const getIfno = async () => {
        try {
            const headers = {
                "client-id": generalConfig.client_khonnect_id,
                "Content-Type": "application/json",
            }
            let response = await Axios.get(
                generalConfig.url_server_khonnect +
                `/appstore/app/get/id=${generalConfig.client_khonnect_id}`,
                { headers }
            )
            let info = response.data.data;
            setInfoSite({
                privacy_notice_link: info.privacy_notice_link,
                privacy_notice_text: info.privacy_notice_text,
                terms_and_conditions_link: info.terms_and_conditions_link,
                terms_and_conditions_text: info.terms_and_conditions_text,
            });
        } catch (error) {
            console.log(error);
        }
    }

    const onFinish = (values) => {
        login(values.email, values.password);
    }

    const saveJWT = async ({ jwt, token }) => {
        try {
            let data = {
                khonnect_id: jwt.user_id,
                jwt: { ...jwt, metadata: [{ token }] },
            };
            let response = await WebApiPeople.saveJwt(data);
            return response.data;
        } catch (error) {
            return null;
        }
    }

    const onLogin = async (values) => {
        try {
            setLoading(true)
            setErrorLogin(false)
            const headers = {
                "client-id": generalConfig.client_khonnect_id,
                "Content-Type": "application/json",
            }
            const url = `${generalConfig.url_server_khonnect}/login/`;
            let response = await Axios.post(url, values, { headers });

            let token = response?.data?.token;
            let jwt = jwt_decode(token);
            if (setKhonnectId) {
                setKhonnectId(token.user_id);
                return;
            }

            let person = await saveJWT({ jwt, token });
            let isReady = await setUserPermissions(jwt.perms);
            if (!person || !isReady || !person?.is_active) {
                setLoading(false)
                message.error("Acceso denegado");
            }

            message.success("Acceso correcto");

            if (!person.is_admin) {
                const url = `${getCurrentURL(true)}.${urlSocial}/validation?token=${token}`;
                setTimeout(() => {
                    redirectTo(url);
                }, 1000)
                return;
            }

            delete jwt.perms;
            Cookies.set("token", jwt);
            localStorage.setItem('token', token);

            getCfdiVersion()
            setTimeout(() => {
                router.push({
                    pathname: "/select-company",
                });
            }, 1000)
        } catch (e) {
            setLoading(false)
            setErrorLogin(true)
            console.log(e)
        }
    }

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
                        localStorage.setItem('token', data_token)
                        let token = jwt_decode(response.data.token);
                        if (setKhonnectId) {
                            setKhonnectId(token.user_id);
                            return;
                        }
                        if (token) {
                            saveJWT(token).then(function (responseJWT) {
                                if (responseJWT) {
                                    getCfdiVersion();
                                    setUserPermissions(token.perms)
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
                    form={loginForm}
                    initialValues={{ remember: true }}
                    onFinish={onLogin}
                >

                    {
                        generalConfig?.concierge_logo ? <p style={{ textAlign: 'center' }}> <img
                            className={"logoKhor"}
                            src={
                                generalConfig?.concierge_logo
                            }
                            width={200}
                            alt=""
                        />
                        </p> : <br />
                    }

                    <Form.Item>
                        <p className={"login-form-title"}>Inicio de sesión</p>
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[ruleRequired, ruleEmail]}
                        className="font-color-khor"
                    >
                        <Input
                            style={{ marginTop: "5px", borderColor: "#F99543" }}
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
                            style={{ marginTop: "5px", borderColor: "#F99543" }}
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
                        <Form.Item style={{ textAlign: "center" }}>
                            ¿Olvidaste tu contraseña? Haz clic
                            <span
                                onClick={() => setRecoverPasswordShow(true)}
                                className={"pointer"}
                            //style={{ color: "blue", textDecoration: "underline" }}
                            >
                                &nbsp;aquí
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
                            className="login-form-button-in"
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

export default connect(
    mapState, {
    setUserPermissions,
    getCfdiVersion
}
)(LoginForm);

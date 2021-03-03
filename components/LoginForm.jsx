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
import { LOGIN_URL, API_URL, APP_ID } from "../config/config";
import Axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

const LoginForm = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(null);
    const [errorLogin, setErrorLogin] = useState(false);
    const onFinish = (values) => {
        login(values.email, values.password);
    };

    const saveJWT = async (jwt) => {
        try {
            let data = {
                khonnect_id: jwt.user_id,
                jwt: jwt
            }
            let response = await Axios.post(API_URL + "/person/person/save_person_jwt/", data)
            console.log('login-response', response);
            if (response.status == 200) {
                return true
            } else {
                return false;
            }
        } catch (error) {
            console.log('login-response-error', error);
            return false;
        }
    }

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
                            saveJWT(token).then(function (responseJWT) {
                                if (responseJWT) {
                                    message.success("Acceso correcto.");
                                    Cookies.set("token", token);
                                    setLoading(false);
                                    router.push({ pathname: "/home" });
                                } else {
                                    message.error("Error al guardar guardar Token de usuario");
                                    setLoading(false);
                                    router.push({ pathname: "/" });
                                }
                            })
                            /* console.log('responseJWT', responseJWT) */


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

    const ruleRequired = { required: true, message: "Este campo es requerido" };

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
                    <Form.Item name="email" rules={[ruleRequired]} label={'Correo electrónico'} labelAlign={'left'} className="font-color-khor">
                        <Input
                            style={{ marginTop: "5px" }}
                            placeholder="Correo electrónico"
                        />
                    </Form.Item>
                    <Text className="font-color-khor"></Text>
                    <Form.Item name="password" rules={[ruleRequired]} label={'Contraseña'} labelAlign={'left'} className="font-color-khor">
                        <Input
                            style={{ marginTop: "5px" }}
                            type="password"
                            placeholder="Contraseña"
                        />
                    </Form.Item>

                    {errorLogin && (
                        <Alert
                            message="Error al iniciar sesión,"
                            description="la contraseña y/o correo electrónico son incorrectos"
                            type="error"
                            style={{ textAlign: "center", marginBottom: "10px" }}
                            closable
                        />
                    )}
                    <Form.Item className={'font-color-khor'}>
                        <b>¿Olvidaste tu contraseña?  </b> <span onClick={() => props.setRecoverPasswordShow(true)} className={'pointer'} style={{ fontWeight: '500', textDecoration: 'underline' }}>  haz click aquí </span>
                    </Form.Item>
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

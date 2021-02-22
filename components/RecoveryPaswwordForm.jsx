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

    const ruleRequired = { required: true, message: "Este campo es requerido" };

    const validatePassword = ({ getFieldValue }) => ({
        validator(rule, value) {
        if (!value || getFieldValue('passwordOne') === value) {
            return Promise.resolve();
        }
            return Promise.reject(
                "Las contraseñas no coinciden"
            );  
        },
    
    })

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
                    <Form.Item name="passwordOne" rules={[ruleRequired]} label={'Nueva contraseña'} labelAlign={'left'} className="font-color-khor">
                        <Input
                            style={{ marginTop: "5px" }}
                            type="password"
                            placeholder="Correo electrónico"
                        />
                    </Form.Item>
                    <Form.Item name="passwordTwo" rules={[ruleRequired, validatePassword]} label={'Confirmar contraseña'} labelAlign={'left'} className="font-color-khor"
                    >
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
                    <Form.Item>
                        <Button
                            style={{ width: "100%" }}
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
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

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

const NewPasswordForm = (props) => {
    const router = useRouter();
    const { token } = router.query;

    const [loading, setLoading] = useState(false);
    const [responseSuccess, setResponseSuccess] = useState(false);
    const [responseError, setResponseError] = useState(false);


    const onFinish = (values) => {
        RecoveryPassword(values.passwordOne);
    };

    const RecoveryPassword = async (newPassword =null ) => {
        try {
            setLoading(true);
            const headers = {
                "client-id": APP_ID,
                "Content-Type": "application/json",
            };
            const data = {
                new_password: newPassword,
                token: token,
            };
            let response = await Axios.post(LOGIN_URL + "/user/password/change/", data, { headers: headers });

            /* console.log(promise) */
            if(response.data.level == 'sucess'){
                setResponseSuccess(true);
            }else{
                setResponseError(true);
            }
        } catch (e) {
            setResponseError(true);
            console.log(e);
        } finally {
            setLoading(false);
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
                    name="recoverPasswordform"
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item name="passwordOne" rules={[ruleRequired]} label={'Nueva contraseña'} labelAlign={'left'} className="font-color-khor">
                        <Input
                            style={{ marginTop: "5px" }}
                            type="password"
                            placeholder="Correo electrónico"
                        />
                    </Form.Item>
                    <Form.Item name="passwordTwo" rules={[ruleRequired, validatePassword]} label={'Confirmar contraseña'} labelAlign={'left'} className="font-color-khor">
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
                            loading={loading}
                        >
                            Cambiar contraseña
            </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </>
    );
};

export default NewPasswordForm;

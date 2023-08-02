import React, { useRef, useMemo } from 'react';
import { Row, Col, Input, Form, Button, message, Alert } from 'antd';
import { ruleRequired, ruleWhiteSpace, ruleURL } from '../../../../utils/rules';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import BtnLoginLK from '../../BtnLoginLK';
import FormConnection from '../FormConnection';

const FormLK = ({
    infoConnection,
    loading,
    formConnection
}) => {

    const btnSubmit = useRef(null);
    const url_redirect = typeof window !== "undefined" ? window.location.origin + "/linkedin" : "https://www.linkedin.com/developers/tools/oauth/redirect";

    const onSuccess = async (resp) =>{
        const key = 'updatable';
        let msgError = 'Acceso no obtenido';
        message.loading({content: 'Guardando acceso...', key})
        try {
            let response = await WebApiJobBank.getTokenLK({
                code: resp,
                client_id: infoConnection.data_config?.app_id,
                client_secret: infoConnection.data_config?.secret_key,
                redirect_uri: url_redirect
            });
            if(!response.data?.access_token || !response.data?.user_code){
                message.error({content: msgError, key});
                return;
            }
            formConnection.setFieldsValue({
                is_valid: true,
                'data_config|user_access_token': response.data?.access_token,
                'data_config|ig_user_id': response.data?.user_code
            });
            setTimeout(()=>{
                btnSubmit.current.click();
            },1000) 
        }
        catch (e) {
            console.log(e)
            let txtError = e.response?.data?.message;
            let msg = txtError ?? msgError;
            message.error({content: msg, key})
       }
    }

    const msgConfig = useMemo(()=>{
        let msgSuccess = `La configuración actual se encuentra en funcionamiento,
            se recomienda no actualizar ningún parámetro en caso de ser necesario.`
        let msgError = `La configuración actual ha fallado, se recomienda iniciar sesión de nuevo
            y conceder todos los permisos requeridos.`
        let message = infoConnection.is_valid ? msgSuccess : msgError;
        let type = infoConnection.is_valid ? 'success' : 'error';
        return { message, type };
    },[infoConnection.is_valid])

    return (
        <>
            {infoConnection.data_config?.user_access_token && (
                <Col span={24}>
                    <Form.Item>
                        <Alert {...msgConfig} showIcon />
                    </Form.Item>
                </Col>
            )}
            <FormConnection showActive={infoConnection.is_valid}/>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='data_config|app_url'
                    label='URL de la conexión'
                    rules={[
                        ruleURL,
                        ruleRequired,
                        ruleWhiteSpace
                    ]}
                >
                    <Input placeholder='Ej. https://api.linkedin.com'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='data_config|app_id'
                    label='Identificador (ClientID)'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input placeholder='ID de la aplicación'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='data_config|secret_key'
                    label='Identificador (ClientSecret)'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input.Password placeholder='Llave secreta de la aplicación'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='data_config|ig_user_id'
                    label='Identificador (OpenID)'
                    tooltip='Parámetro necesario para publicar en LinkedIn'
                >
                    <Input disabled placeholder='ID del usuario'/>
                </Form.Item>
            </Col>
            <Col span={24}>
                <Row gutter={[24,0]}>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name='data_config|user_access_token'
                            label='Token de acceso (usuario)'
                            tooltip='Para obtener el token es necesario iniciar sesión en la red con sus credenciales.'
                        >
                            <Input.TextArea
                                disabled
                                autoSize={{minRows: 4, maxRows: 4}}
                                placeholder='Token de acceso'
                            />
                        </Form.Item>
                    </Col>  
                </Row>
            </Col>
            <Col span={24} style={{display: 'flex', alignItems: 'center'}}>
                {!infoConnection.is_valid && (
                    <BtnLoginLK
                        loading={loading}
                        clientID={infoConnection.data_config?.app_id}
                        redirectURL={url_redirect}
                        onSuccess={onSuccess}
                    />  
                )}
                <Button
                    loading={loading}
                    ref={btnSubmit}
                    htmlType='submit'
                    style={{marginLeft: 'auto'}}
                >
                    Actualizar
                </Button>
            </Col>
        </>
    )
}

export default FormLK;
import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Row, Col, Input, Form, Button, message, Alert } from 'antd';
import { ruleRequired, ruleWhiteSpace, ruleURL } from '../../../../utils/rules';
import { useSelector } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { useRouter } from 'next/router';
import BtnLoginLK from '../../BtnLoginLK';
import FormConnection from '../FormConnection';
import { useInfoConnection } from '../../hook/useInfoConnection';

const FormLK = ({
    infoConnection,
    loading,
    formConnection
}) => {

    const getNode = state => state.userStore.current_node;
    const currentNode = useSelector(getNode);
    const router = useRouter();
    const btnSubmit = useRef(null);
    const [infoConfig, setInfoConfig] = useState({});
    const { formatData } = useInfoConnection();
    const userKey = 'user_access_token';
    const url_redirect = typeof window !== "undefined" ? window.location.origin + "/linkedin" : "https://www.linkedin.com/developers/tools/oauth/redirect";

    const existPreConfig = useMemo(()=>{
        let current = infoConnection?.data_config ?? {};
        let exist = infoConfig?.data_config ?? {}; 
        if(current[userKey]) return false;
        if(!exist[userKey]) return false;
        return true;
    },[infoConnection, infoConfig])

    useEffect(()=>{
        if(!currentNode) return;
        getExistConfig(currentNode.id, `&code='LK'`);
    },[currentNode, router.query?.code])

    useEffect(()=>{
        if(Object.keys(infoConnection).length <= 0) return;
        setValuesForm()
    },[infoConnection, infoConfig])

    const setValuesForm = () =>{
        formConnection.resetFields();
        let details = existPreConfig
            ? {...infoConnection,
                data_config: infoConfig.data_config,
                is_valid: infoConfig.is_valid,
            } : infoConnection;
        let values = formatData(details);
        formConnection.setFieldsValue({...values});
    }

    const getExistConfig = async (node, query) =>{
        try {
            let response = await WebApiJobBank.getConnections(node, query);
            setInfoConfig(response.data?.results?.at(-1))
        } catch (e) {
            console.log(e)
        }
    }

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
            console.log(response);
            if(!response.data?.acess_token || !response.data?.user_code){
                message.error({content: msgError, key});
                return;
            }
            formConnection.setFieldsValue({
                is_valid: true,
                'data_config|user_access_token': response.data?.acess_token,
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

    const msgPreConfig = {
        message: `Se han precargado algunos parámetros de
            isLinkedin, ya que la mayoría son similares
            para esta conexión, para guardarlos es necesario "Actualizar" y posteriormente
            llenar los datos faltantes para completar la configuración.`,
        type: 'warning'
    };

    return (
        <>
            {infoConnection.data_config?.user_access_token && (
                <Col span={24}>
                    <Form.Item>
                        <Alert {...msgConfig} showIcon />
                    </Form.Item>
                </Col>
            )}
            {existPreConfig && (
                <Col span={24}>
                    <Form.Item>
                        <Alert {...msgPreConfig} showIcon/>
                    </Form.Item>
                </Col>
            )}
            <FormConnection/>
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
import React, {
    useRef,
    useEffect,
    useMemo,
    useState
} from 'react';
import {
    Row,
    Col,
    Input,
    Form,
    Select,
    Checkbox,
    Button,
    message,
    Alert
} from 'antd';
import {
    ruleRequired,
    ruleWhiteSpace,
    ruleURL
} from '../../../../utils/rules';
import { useSelector } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import { useRouter } from 'next/router';
import FileUpload from '../../FileUpload';
import BtnLoginFB from '../../BtnLoginFB';
import FormConnection from '../FormConnection';
import { useInfoConnection } from '../../hook/useInfoConnection';

const FormFBIG = ({
    infoConnection,
    loading,
    formConnection,
    setFileImg
}) => {

    const getNode = state => state.userStore.current_node;
    const currentNode = useSelector(getNode);
    const router = useRouter();
    const btnSubmit = useRef(null);
    const [infoConfig, setInfoConfig] = useState({});
    const { formatData } = useInfoConnection();
    const pageKey = 'page_access_token';
    const userKey = 'user_access_token';

    const isInstagram = useMemo(()=>{
        return router.query?.code == 'IG'
    },[router.query?.code])

    const existPreConfig = useMemo(()=>{
        let current = infoConnection?.data_config ?? {};
        let exist = infoConfig?.data_config ?? {}; 
        if(current[pageKey] && current[userKey]) return false;
        if(!exist[pageKey] && !exist[userKey]) return false;
        return true;
    },[infoConnection, infoConfig])

    useEffect(()=>{
        if(!currentNode) return;
        let code = router.query?.code == 'IG' ? 'FB' : 'IG';
        getExistConfig(currentNode.id, `&code=${code}`);
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
        let name_file = infoConnection.default_image
            ? infoConnection.default_image.split('/').at(-1)
            : null; 
        formConnection.setFieldsValue({...values, name_file});
    }

    const getExistConfig = async (node, query) =>{
        try {
            let response = await WebApiJobBank.getConnections(node, query);
            setInfoConfig(response.data?.results?.at(-1))
        } catch (e) {
            console.log(e)
        }
    }

    const onSuccess = async (response) =>{
        const key = 'updatable';
        let msgError = 'Acceso no obtenido';
        message.loading({content: 'Guardando acceso...', key})
        try {
            let resp = await WebApiJobBank.getTokenFB({
                token: response.accessToken,
                app_id: infoConnection.data_config?.app_id,
                secret_key: infoConnection.data_config?.secret_key
            });
            if(!resp.data?.page_token || !resp.data?.user_token){
                message.error({content: msgError, key});
                deletePermissions();
                return;
            }
            formConnection.setFieldsValue({
                is_valid: true,
                'data_config|user_access_token': resp.data.user_token,
                'data_config|page_access_token': resp.data.page_token
            });
            setTimeout(()=>{
                btnSubmit.current.click();
            },1000)
        } catch (e) {
            console.log(e)
            let txtError = e.response?.data?.message;
            let msg = txtError ?? msgError;
            message.error({content: msg, key})
            deletePermissions();
        }
    }

    const deletePermissions = () =>{
        window.FB.api('/me/permissions', 'delete', (res)=>{
            console.log('delete')
        })
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
            ${isInstagram ? 'Facebook' : 'Instagram'}, ya que la mayoría son similares
            para esta conexión, para guardarlos es necesario "Actualizar" y posteriormente
            llenar los datos faltantes para completar la configuración.`,
        type: 'warning'
    };

    return (
        <>
            {infoConnection.data_config?.page_access_token &&
                infoConnection.data_config?.user_access_token && (
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
            <FormConnection showActive={infoConnection.is_valid}/>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <FileUpload
                    label='Imagen predeterminada'
                    tooltip={`Esta imagen será utilizada en caso de que
                    no se haya seleccionado ninguna antes de realizar la publicación.`}
                    isRequired={isInstagram}
                    setFile={setFileImg}
                    typeFile={['png','jpg','jpeg']}
                    urlPreview={infoConnection?.default_image}
                    setNameFile={e=> formConnection.setFieldsValue({
                        name_file: e
                    })}
                />
            </Col>
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
                    <Input placeholder='Ej. https://graph.facebook.com/'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='data_config|app_id'
                    label='Identificador (App ID)'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input placeholder='ID de la aplicación'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='data_config|page_id'
                    label='Identificador (Page ID)'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input placeholder='ID de la página'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='data_config|ig_user_id'
                    label='Identificador (User ID)'
                    tooltip='Parámetro necesario para publicar en Instagram'
                >
                    <Input placeholder='ID del usuario'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} xl={8} xxl={6}>
                <Form.Item
                    name='data_config|secret_key'
                    label='Llave secreta'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input.Password placeholder='Llave secreta de la aplicación'/>
                </Form.Item>
            </Col>
            <Col span={24}>
                <Row gutter={[24,0]}>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name='data_config|page_access_token'
                            label='Token de acceso (página)'
                            tooltip='Para obtener el token es necesario iniciar sesión en la red con sus credenciales.'
                        >
                            <Input.TextArea
                                disabled
                                autoSize={{minRows: 4, maxRows: 4}}
                                placeholder='Token de acceso'
                            />
                        </Form.Item>
                    </Col>
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
                    <BtnLoginFB
                        loading={loading}
                        appID={infoConnection.data_config?.app_id}
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

export default FormFBIG;
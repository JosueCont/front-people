import React, {
    useRef,
    useEffect,
    useContext,
    useMemo
} from 'react';
import {
    Row,
    Col,
    Input,
    Form,
    Select,
    Checkbox,
    Divider,
    Button,
    message,
    Alert
} from 'antd';
import {
    ruleRequired,
    ruleWhiteSpace,
    ruleURL
} from '../../../utils/rules';
import {
    FacebookFilled,
    ToTopOutlined,
    EyeOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { FacebookLoginClient } from '@greatsumini/react-facebook-login';
import { redirectTo } from '../../../utils/constant';
import { getFileExtension } from '../../../utils/functions';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { ConnectionContext } from '../context/ConnectionContext';
import { useRouter } from 'next/router';

const FormFBIG = () => {

    const config_success = {
        msg: `La configuración actual se encuentra en funcionamiento,
        se recomienda no actualizar ningún parámetro en caso de ser necesario.`,
        type: 'success'
    };
    const config_error = {
        msg: `La configuración actual ha fallado, se recomienda iniciar sesión de nuevo
            y conceder todos los permisos requeridos.`,
        type: 'error'
    };
    const validate_config = {
        'true': config_success,
        'false': config_error
    };
    const {
        infoConnection,
        loading,
        formConnection,
        setFileImg
    } = useContext(ConnectionContext);
    const router = useRouter();
    const btnSubmit = useRef(null);
    const inputFile = useRef(null);
    const typeFile = ['png','jpg','jpeg'];

    useEffect(()=>{
        (async ()=>{
            await FacebookLoginClient.loadSdk('en_US', false);
        })();
    },[])

    useEffect(()=>{
        if(Object.keys(infoConnection).length <= 0) return;
        initFacebook();
    },[infoConnection])

    const isInstagram = useMemo(()=>{
        return router.query?.code == 'IG'
    },[router.query?.code])

    const initFacebook = async () =>{
        let app_id = infoConnection.data_config?.app_id;
        if(!app_id) return;
        FacebookLoginClient.init({
            appId: infoConnection.data_config.app_id,
            version: 'v14.0',
            localStorage: false,
            xfbml: true
        });
    }

    const setMessage = (type, msg) => message[type]({
        content: msg,
        key: 'updatable'
    });
    const setMessageSucces = (msg = '') => setMessage('success', msg);
    const setMessageError = (msg = '') => setMessage('error', msg);
    const setMessageLoading = (msg = '') => setMessage('loading', msg);

    const onSuccess = async (response) =>{
        let msgError = 'Acceso no obtenido';
        try {
            setMessageLoading('Guardando acceso...');
            let resp = await WebApiJobBank.getTokenFB({
                token: response.accessToken,
                app_id: infoConnection.data_config?.app_id,
                secret_key: infoConnection.data_config?.secret_key
            });
            if(!resp.data?.page_token || !resp.data?.user_token){
                setMessageError(msgError);
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
            let msgSelected = txtError ?? msgError;
            setMessageError(msgSelected);
            deletePermissions();
        }
    }

    const onFail = (response) =>{
        let msgError = {
            'facebookNotLoaded': 'No fue posible cargar la configuración de facebook, actualizar la página',
            'loginCancelled': 'Inicio de sesión cancelado/fallido'
        }
        let txtMsg = msgError[response.status];
        if(txtMsg) message.error(txtMsg);
    }

    const onLogout = (response) =>{
        console.log('logout', response)
    }

    const validateResp = (resp) =>{
        if(!resp.authResponse){
            onFail({status: 'loginCancelled'});
            return;
        }
        onSuccess(resp.authResponse);
        FacebookLoginClient.logout(onLogout);
    }

    const validateLogin = () =>{
        if (!window.FB){
            onFail({status: 'facebookNotLoaded'});
            return;
        }
        FacebookLoginClient.login(validateResp, {
            scope: `email,
                public_profile,
                pages_show_list,
                pages_manage_posts,
                instagram_basic,
                instagram_content_publish,
            `
        });
    }

    const deletePermissions = () =>{
        window.FB.api('/me/permissions', 'delete', (res)=>{
            console.log('delete', res)
        })
    }

    const openFile = () =>{
        inputFile.current.value = null;
        inputFile.current.click();
    }

    const setFileSelected = ({target : { files }}) =>{
        if(Object.keys(files).length <= 0){
            let msg = 'No se pudo cargar el archivo, intente de nuevo';
            message.error(msg)
            return;
        }
        let extension = getFileExtension(files[0].name);
        if(!typeFile.includes(extension.toLowerCase())){
            let msg = 'El archivo seleccionado no es válido';
            message.error(msg);
            return;
        }
        let size = files[0].size / 1024 / 1024;
        if(size > 10){
            message.error(`Archivo pesado: ${size.toFixed(2)}mb`);
            return;
        }
        setFileImg([files[0]]);
        formConnection.setFieldsValue({image_read: files[0].name});
    }

    const resetImg = () =>{
        setFileImg([]);
        formConnection.setFieldsValue({image_read: null});
    }

    return (
        <>
            {infoConnection.data_config?.page_access_token && (
                <Col span={24}>
                    <Form.Item>
                        <Alert
                            message={validate_config[infoConnection.is_valid].msg}
                            type={validate_config[infoConnection.is_valid].type} showIcon />
                    </Form.Item>
                </Col>
            )}
            <Col xs={24} md={12} lg={8} style={{display: 'none'}}>
                <Form.Item name='is_valid' label='¿Es válido?' valuePropName='checked'>
                    <Checkbox/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
                <Form.Item
                    name='is_active'
                    label='¿Activar aplicación?'
                    rules={[ruleRequired]}
                >
                    <Select
                        allowClear
                        placeholder='Seleccionar una opción'
                    >
                        <Select.Option value={true} key={true}>Sí</Select.Option>
                        <Select.Option value={false} key={false}>No</Select.Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
                <Form.Item
                    name='name'
                    label='Nombre'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input
                        maxLength={20}
                        placeholder='Nombre de la conexión'
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
                <Form.Item
                    name='code'
                    label='Código'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input
                        disabled
                        maxLength={10}
                        placeholder='Código de la conexión'
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
                <Form.Item
                    label='Imagen predeterminada'
                    tooltip={`Esta imagen (${typeFile.join(', ')}) será utilizada en caso de que
                    no se haya seleccionado ninguna antes de realizar la publicación.`}
                    required={isInstagram}
                >
                    <Input.Group compact>
                        <Form.Item
                            noStyle
                            name='image_read'
                            rules={[isInstagram ? ruleRequired : {}]}
                        >
                            <Input
                                readOnly
                                placeholder='Ningún archivo seleccionado'
                                style={{
                                    width: 'calc(100% - 64px)',
                                    borderTopLeftRadius: 10,
                                    borderBottomLeftRadius: 10
                                }}
                            />
                        </Form.Item>
                        {infoConnection.default_image ? (
                            <Button
                                className='custom-btn'
                                onClick={()=> redirectTo(infoConnection.default_image, true)}
                                icon={<EyeOutlined />}
                            />
                        ): (
                            <Button
                                className='custom-btn'
                                onClick={()=> resetImg()}
                                icon={<DeleteOutlined />}
                            />
                        )}
                        <Button
                            icon={<ToTopOutlined />}
                            onClick={()=> openFile()}
                            style={{
                                borderTopRightRadius: 10,
                                borderBottomRightRadius: 10
                            }}
                        />
                        <input
                            type='file'
                            style={{display: 'none'}}
                            accept={typeFile.reduce((acc, item) => acc +=`.${item}, `,'')}
                            ref={inputFile}
                            onChange={setFileSelected}
                        />
                    </Input.Group>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
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
            <Col xs={24} md={12} lg={8}>
                <Form.Item
                    name='data_config|app_id'
                    label='Identificador (App ID)'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input placeholder='ID de la aplicación'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
                <Form.Item
                    name='data_config|page_id'
                    label='Identificador (Page ID)'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input placeholder='ID de la página'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
                <Form.Item
                    name='data_config|ig_user_id'
                    label='Identificador (User ID)'
                    tooltip='Parámetro necesario para publicar en Instagram'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input placeholder='ID del usuario'/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
                <Form.Item
                    name='data_config|secret_key'
                    label='Llave secreta'
                    rules={[ruleRequired, ruleWhiteSpace]}
                >
                    <Input placeholder='Llave secreta de la aplicación'/>
                </Form.Item>
            </Col>
            <Col span={24}>
                <Row gutter={[24,0]}>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name='data_config|page_access_token'
                            label='Token de acceso (página)'
                            tooltip='Para obtener el token es necesario iniciar sesión en la red con sus credenciales.'
                            // rules={[ruleWhiteSpace]}
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
                            // rules={[ruleWhiteSpace]}
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
                    <Button
                        className='btn-login-facebook'
                        onClick={()=> validateLogin()}
                        disabled={loading}
                        icon={<FacebookFilled />}
                    >
                        Iniciar sesión
                    </Button>
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
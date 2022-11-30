import React, {
    useEffect,
    useLayoutEffect,
    useState,
    useRef
} from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Spin,
    Space,
    Tag,
    message,
    Checkbox,
    Select
} from 'antd';
import {
    ruleRequired,
    ruleURL,
    ruleWhiteSpace
} from '../../../utils/rules';
import { getConnections } from '../../../redux/jobBankDuck';
import { connect } from 'react-redux';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { FacebookFilled } from '@ant-design/icons';
import { useProcessInfo } from './hook/useProcessInfo';
import { FacebookLoginClient } from '@greatsumini/react-facebook-login';
import { useRouter } from 'next/router';

const TabFacebook = ({
    infoConnection = {},
    currentNode,
    getConnections
}) => {

    const router = useRouter();
    const btnSubmit = useRef(null);
    const [formFacebook] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { createData, formatData } = useProcessInfo();

    useLayoutEffect(()=>{
        (async ()=>{
            await FacebookLoginClient.loadSdk('en_US', false);
        })();
    },[])

    useEffect(()=>{
        if(Object.keys(infoConnection).length <= 0) return;
        setValuesForm();
        initFacebook();
    },[infoConnection])

    const setMessage = (type, msg) => message[type]({
        content: msg,
        key: 'updatable'
    });
    const setMessageSucces = (msg = '') => setMessage('success', msg);
    const setMessageError = (msg = '') => setMessage('error', msg);
    const setMessageLoading = (msg = '') => setMessage('loading', msg); 

    const setValuesForm = () =>{
        formFacebook.resetFields();
        let values = formatData(infoConnection);
        formFacebook.setFieldsValue(values);
    }

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

    const onSuccess = async (response) =>{
        let msgError = 'Acceso no obtenido';
        try {
            setMessageLoading('Guardando acceso...');
            let body = { token: response.accessToken };
            let resp = await WebApiJobBank.getTokenFB(body);
            if(!resp.data?.token) return setMessageError(msgError);
            let obj = {'data_config|page_access_token': resp.data.token};
            formFacebook.setFieldsValue(obj);
            setTimeout(()=>{
                btnSubmit.current.click();
            },1000)
        } catch (e) {
            console.log(e)
            console.log('error get token', e.response)
            setMessageError(msgError);
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

    const onProfileSuccess = (response) =>{
        console.log('profile', response)
    }

    const onLogout = (response) =>{
        console.log('logout', response)
    }

    const validateResp = (resp) =>{
        console.log('response', resp)
        if(!resp.authResponse) return onFail(resp);
        onSuccess(resp.authResponse);
        FacebookLoginClient.logout(onLogout);
        // const fields = 'name,email,picture';
        // FacebookLoginClient.getProfile(onProfileSuccess, { fields });
    }

    const validateLogin = () =>{
        if (!window.FB) return onFail({status: 'facebookNotLoaded'});
        FacebookLoginClient.login(validateResp, {
            scope: 'public_profile, email'
        });
    }

    const onFinish = async (values) =>{
        try {
            setLoading(true)
            let body = createData(values);
            await WebApiJobBank.updateConnection(infoConnection.id, {...body, node: currentNode.id});
            setMessageSucces('Conexión actualizada');
            setLoading(false)
            getConnections(currentNode.id);
        } catch (e) {
            console.log(e)
            setLoading(false)
            setMessageError('Conexión no actualizada');
        }
    }

    const revoqueSession = () =>{
        if (!window.FB) return onFail({status: 'facebookNotLoaded'});
        window.FB.api('/me/permissions', 'delete', (res)=>{
            console.log('delete', res)
        })
    }

    const btnLogin = ({onClick}) => (
        <Button
            className='btn-login-facebook'
            onClick={()=> onClick()}
            icon={<FacebookFilled />}
        >
            Iniciar sesión
        </Button>
    )

    return (
        <Form
            form={formFacebook}
            onFinish={onFinish}
            id='form-facebook'
            layout='vertical'
            initialValues={{
                code: 'FB',
                is_active: false
            }}
        >
            <Row gutter={[24,0]}>
                <Col xs={24} xxl={16}>
                    <Row gutter={[24,0]}>
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
                                name='data_config|app_url'
                                label='URL de la conexión'
                                rules={[
                                    ruleURL,
                                    ruleRequired,
                                    ruleWhiteSpace
                            ]}
                            >
                                <Input
                                    // maxLength={10}
                                    placeholder='Ej. https://graph.facebook.com/'
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item
                                name='data_config|app_id'
                                label='Identificador (App ID)'
                                rules={[ruleRequired, ruleWhiteSpace]}
                            >
                                <Input
                                    maxLength={50}
                                    placeholder='ID de la aplicación'
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item
                                name='data_config|page_id'
                                label='Identificador (Page ID)'
                                rules={[ruleRequired, ruleWhiteSpace]}
                            >
                                <Input
                                    maxLength={50}
                                    placeholder='ID de la página'
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item
                                name='data_config|secret_key'
                                label='Llave secreta'
                                rules={[ruleWhiteSpace]}
                            >
                                <Input
                                    maxLength={50}
                                    placeholder='Llave secreta de la aplicación'
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} xxl={8}>
                    <Form.Item
                        name='data_config|page_access_token'
                        label='Token de acceso'
                        tooltip='Para obtener el token es necesario iniciar sesión en la red con sus credenciales.'
                        rules={[ruleWhiteSpace]}
                    >
                        <Input.TextArea
                            disabled
                            autoSize={{minRows: 5, maxRows: 5}}
                            placeholder='Token de acceso'
                        />
                    </Form.Item>
                </Col>
                <Col span={24} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    {/* <FacebookLogin
                        appId='637006797889798'
                        autoLoad={true}
                        onSuccess={onSuccess}
                        onFail={onFail}
                        onProfileSuccess={onProfileSuccess}
                        render={btnLogin}
                    /> */}
                    <Button
                        className='btn-login-facebook'
                        onClick={()=> validateLogin()}
                        disabled={loading}
                        icon={<FacebookFilled />}
                    >
                        Iniciar sesión
                    </Button>
                    <Button
                        loading={loading}
                        ref={btnSubmit}
                        htmlType='submit'
                    >
                        Guardar
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState, { getConnections })(TabFacebook);
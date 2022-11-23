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

const TabFacebook = ({
    infoConnection = {},
    currentNode,
    getConnections
}) => {

    const btnSubmit = useRef(null);
    const [formFacebook] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { createData, formatData } = useProcessInfo();
    const appId = Form.useWatch('data_config|app_id', formFacebook);

    useLayoutEffect(()=>{
        (async ()=>{
            await FacebookLoginClient.loadSdk('en_US');
        })();
    },[])

    useEffect(()=>{
        setValuesForm()
    },[infoConnection])

    const setMessage = (type, msg) => message[type]({
        content: msg,
        key: 'updatable'
    });
    const setMessageSucces = (msg = '') => setMessage('success', msg);
    const setMessageError = (msg = '') => setMessage('error', msg);
    const setMessageLoading = (msg = '') => setMessage('loading', msg); 

    const setValuesForm = () =>{
        if(Object.keys(infoConnection).length <= 0) return;
        formFacebook.resetFields();
        let values = formatData(infoConnection);
        formFacebook.setFieldsValue(values);
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
            setMessageError(msgError);
        }
    }
    
    const onFail = (response) =>{
        console.log('error', response)
    }

    const onProfileSuccess = (response) =>{
    }

    const validateResp = (resp) =>{
        let validation = resp.status == 'connected';
        if(validation) onSuccess(resp.authResponse);
        else onFail(resp);
    }

    const validateLogin = () =>{
        if(!appId){
            message.error('Ingrese el ID de la aplicaión');
            return;
        }
        const scopes = {scope: 'public_profile, email'};
        FacebookLoginClient.init({
            appId: appId,
            version: 'v14.0',
            cookie: false,
            xfbml: false,
            localStorage: false
        })
        FacebookLoginClient.login(validateResp, scopes);
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
                                label='Identificador (ID)'
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
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Spin,
    Space,
    Tag,
    message
} from 'antd';
import {
    ruleRequired,
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

    const [loading, setLoading] = useState(false);
    const [formFacebook] = Form.useForm();
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

    const setValuesForm = () =>{
        if(Object.keys(infoConnection).length <= 0) return;
        let values = formatData(infoConnection);
        formFacebook.setFieldsValue(values);
    }

    const onSuccess = async (response) =>{
        try {
            let body = { token: response.accessToken };
            let resp = await WebApiJobBank.getTokenFB(body);
            let token = resp.data.token ?? null;
            formFacebook.setFieldsValue({'data_config|page_access_token': token});
            message.success('Acceso obtenido');
        } catch (e) {
            console.log(e)
            message.error('Acceso no obtenido');
        }
    }
    
    const onFail = (response) =>{
        console.log('el error--->', response)
    }

    const onProfileSuccess = (response) =>{
    }

    const validateResp = (resp) =>{
        let validation = resp.status == 'connected';
        if(validation) onSuccess(resp.authResponse);
        else onFail(resp);
    }

    const validateLogin = () =>{
        if(!appId) return;
        const scopes = {scope: 'public_profile, email'};
        FacebookLoginClient.init({
            appId: appId,
            version: 'v15.0',
            cookie: true,
            xfbml: true
        })
        FacebookLoginClient.login(validateResp, scopes);
    }

    const onFinish = async (values) =>{
        try {
            setLoading(true)
            let body = createData(values);
            await WebApiJobBank.updateConnection(infoConnection.id, {...body, node: currentNode.id});
            getConnections(currentNode.id)
            message.success('Conexión actualizada');
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Conexión no actualizada');
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
        <Row>
            <Col span={24}>
                <Spin spinning={loading}>
                    <Form
                        form={formFacebook}
                        onFinish={onFinish}
                        id='form-facebook'
                        layout='vertical'
                    >
                        <Row gutter={[24,0]}>
                            <Col span={16}>
                                <Row gutter={[24,0]}>
                                    <Col span={12}>
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
                                    <Col span={12}>
                                        <Form.Item
                                            name='code'
                                            label='Código'
                                            rules={[ruleRequired, ruleWhiteSpace]}
                                        >
                                            <Input
                                                maxLength={10}
                                                placeholder='Código de la conexión'
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name='data_config|app_id'
                                            label='Identificador (ID)'
                                            rules={[ruleWhiteSpace]}
                                        >
                                            <Input
                                                maxLength={50}
                                                placeholder='ID de la aplicación'
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
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
                            <Col span={8}>
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
                        </Row>
                    </Form>
                </Spin>
            </Col>
            <Col span={24} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                {/* <FacebookLogin
                    appId='637006797889798'
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
                    form='form-facebook'
                    htmlType='submit'
                >
                    Guardar
                </Button>
            </Col>
        </Row>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState, { getConnections })(TabFacebook);
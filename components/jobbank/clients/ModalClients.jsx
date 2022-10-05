import React, {useState, useEffect} from 'react';
import MyModal from '../../../common/MyModal';
import { Form, Input, Select, Row, Col, Button, Tabs } from 'antd';
import { rulePhone, ruleRequired, ruleURL, ruleWhiteSpace, ruleEmail } from '../../../utils/rules';
import { validateNum } from '../../../utils/functions';

const ModalClients = ({
    actionForm = ()=> {}, //function
    title = '', //string
    visible = false, //boolean
    close = ()=> {}, //function
    itemToEdit = {}, //object
}) => {

    const [formClient] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState('tab_1');
    const options = [
        {key: '9c5b2a3edf694717a04ffdda0fca13e7', value: '9c5b2a3edf694717a04ffdda0fca13e7', label: 'Sector 1'},
        {key: '21bba3f0ae434e84810346f8f52bff24', value: '21bba3f0ae434e84810346f8f52bff24', label: 'Sector 2'},
        {key: 'fb23dbe189074a0a83c0b10c427c3e1f', value: 'fb23dbe189074a0a83c0b10c427c3e1f', label: 'Sector 3'},
        {key: '6e641b9e43f34ae4aa1ebd3aab074c70', value: '6e641b9e43f34ae4aa1ebd3aab074c70', label: 'Sector 4'}
    ]

    useEffect(()=>{
        if(Object.keys(itemToEdit).length > 0) setValuesForm();
    },[itemToEdit])


    const setValuesForm = () =>{
        formClient.setFieldsValue(itemToEdit);
    }

    const onFinish = (values) =>{
        setLoading(true)
        setTimeout(()=>{
            onCloseModal()
            setLoading(false)
            actionForm(values)
            formClient.resetFields();
        },2000)
    }

    const onCloseModal = ()=>{
        close()
        setCurrentTab('tab_1')
        formClient.resetFields();
    }

    const onFailure = ({errorFields}) =>{
        if(errorFields.length <= 0) return false;
        
        let errosTab1 = 0
        let errosTab2 = 0;
        let keysTab1 = [
            'name',
            'description',
            'sector',
            'website',
            'business_name',
            'comments'
        ];
        let keysTab2 = [
            'contact_name',
            'job_contact',
            'email_contact',
            'phone_contact'
        ]

        errorFields.map(item => {
            if(keysTab1.includes(item.name.at(-1))) errosTab1 +=1;
            if(keysTab2.includes(item.name.at(-1))) errosTab2 +=1;
        })

        if(errosTab2 <= 0 && errosTab1 > 0) setCurrentTab('tab_1');
        if(errosTab1 <= 0 && errosTab2 > 0) setCurrentTab('tab_2');
    }

    return (
        <MyModal
            title={title}
            widthModal={700}
            close={onCloseModal}
            visible={visible}
        >
            <Form
                form={formClient}
                onFinish={onFinish}
                onFinishFailed={onFailure}
            >
                <Row>
                    <Col span={24}>
                        <Tabs
                            activeKey={currentTab}
                            onChange={e=> setCurrentTab(e)}
                            type={'card'}
                        >
                            <Tabs.TabPane tab={'Información del cliente'} key={'tab_1'}>
                                <Row gutter={[24,0]} style={{margin: '24px 12px'}}>
                                    <Col span={12}>
                                        <Form.Item
                                            name={'name'}
                                            rules={[ruleRequired, ruleWhiteSpace]}
                                        >
                                            <Input maxLength={50} placeholder={'Escriba un nombre'}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name={'description'}
                                            rules={[ruleRequired, ruleWhiteSpace]}
                                        >
                                            <Input maxLength={50} placeholder={'Escriba una descripción'}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item rules={[ruleRequired]} name={'sector'}>
                                            <Select
                                                placeholder={'Seleccione un sector'}
                                                notFoundContent={'No se encontraron resultados'}
                                                options={options}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item 
                                            name={'website'}
                                            rules={[ruleRequired, ruleURL]}
                                        >
                                            <Input placeholder={'Escriba la url de su sitio'}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name={'business_name'}
                                            rules={[ruleRequired, ruleWhiteSpace]}
                                            style={{marginBottom: 0}}
                                        >
                                            <Input maxLength={50} placeholder={'Razón social'}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name={'comments'}
                                            rules={[ruleRequired, ruleWhiteSpace]}
                                            style={{marginBottom: 0}}
                                        >
                                            <Input placeholder={'Comentarios'}/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={'Información de contacto'} key={'tab_2'} forceRender>
                                <Row gutter={[24,0]} style={{margin: '24px 12px'}}>
                                    <Col span={12}>
                                        <Form.Item
                                            name={'contact_name'}
                                            rules={[ruleRequired, ruleWhiteSpace]}
                                        >
                                            <Input maxLength={50} placeholder={'Nombre del contacto'}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name={'job_contact'}
                                            rules={[ruleRequired, ruleWhiteSpace]}
                                        >
                                            <Input placeholder={'Ocupación del contacto'}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name={'email_contact'}
                                            rules={[ruleRequired, ruleEmail]}
                                            style={{marginBottom: 0}}
                                        >
                                            <Input maxLength={50} placeholder={'Correo del contacto'}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name={'phone_contact'}
                                            rules={[ruleRequired, rulePhone]}
                                            style={{marginBottom: 0}}
                                        >
                                            <Input
                                                placeholder={'Teléfono del contacto'}
                                                maxLength={10}
                                                onKeyPress={validateNum}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Tabs.TabPane>
                        </Tabs>
                    </Col>
                    <Col
                        span={24}
                        style={{
                            display: 'flex',
                            gap: 8,
                            marginTop: '24px',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <Button onClick={()=> onCloseModal()}>Cancelar</Button>
                        <Button htmlType={'submit'} loading={loading}>Guardar</Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalClients
import React, {useState, useEffect} from 'react';
import MyModal from '../../../common/MyModal';
import {
    Form,
    Row,
    Col,
    Button,
    Tabs
} from 'antd';
import TabClient from './TabClient';
import TabContact from './TabContact';
import TabDocuments from './TabDocuments';

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
    const [listDocs, setListDocs] = useState([]);

    useEffect(()=>{
        if(Object.keys(itemToEdit).length > 0) setValuesForm();
    },[itemToEdit])


    const setValuesForm = () =>{
        formClient.setFieldsValue(itemToEdit);
    }

    const onFinish = (values) =>{
        let dataClient = new FormData();
        dataClient.append('is_active', true);
        // if(listDocs.length > 0) dataClient.append('documents', listDocs);
        Object.entries(values).map(([key, val])=>{
            if(val) dataClient.append(key, val);
        });
        setLoading(true)
        setTimeout(()=>{
            onCloseModal()
            setLoading(false)
            actionForm(dataClient)
            formClient.resetFields();
        },2000)
    }

    const onCloseModal = ()=>{
        close()
        setListDocs([])
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
                    <Col span={24} className='modal-tabs-clients'>
                        <Tabs
                            activeKey={currentTab}
                            onChange={e=> setCurrentTab(e)}
                            type={'card'}
                        >
                            <Tabs.TabPane
                                tab={'Información del cliente'}
                                key={'tab_1'}
                            >
                                <TabClient/>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab={'Información de contacto'}
                                key={'tab_2'}
                                forceRender
                            >
                                <TabContact/>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab={'Documentos'}
                                key={'tab_3'}
                                forceRender
                            >
                                <TabDocuments
                                    listDocs={listDocs}
                                    setListDocs={setListDocs}
                                />
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
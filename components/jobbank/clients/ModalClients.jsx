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
    const [prevDocs, setPrevDocs] = useState([]);
    const [newDocs, setNewDocs] = useState([]);

    useEffect(()=>{
        if(Object.keys(itemToEdit).length > 0){
            setPrevDocs(itemToEdit.files);
            setValuesForm();
        }
    },[itemToEdit])

    const setValuesForm = () =>{
        formClient.setFieldsValue(itemToEdit);
    }

    const createData = (obj) =>{
        let dataClient = new FormData();
        if(newDocs.length > 0) newDocs.map(item => dataClient.append('files', item));
        Object.entries(obj).map(([key, val])=>{ if(val) dataClient.append(key, val) });
        let toDelete = prevDocs.filter(item => item.is_deleted);
        const saveToDelete = (item, idx) => dataClient.append(`delete_files_id[${idx}]`, item.id);
        if(toDelete.length > 0) toDelete.map(saveToDelete);
        return dataClient;
    }

    const onFinish = (values) =>{
        const bodyData = createData(values);
        setLoading(true)
        setTimeout(()=>{
            onCloseModal()
            setLoading(false)
            actionForm(bodyData)
            formClient.resetFields();
        },2000)
    }

    const onCloseModal = ()=>{
        close()
        setPrevDocs([])
        setNewDocs([])
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
                                    newDocs={newDocs}
                                    prevDocs={prevDocs}
                                    setNewDocs={setNewDocs}
                                    setPrevDocs={setPrevDocs}
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
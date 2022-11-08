import React, {useState, useEffect} from 'react';
import MyModal from '../../../common/MyModal';
import {
    Form,
    Row,
    Col,
    Button,
    Tabs,
    message,
    Spin
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
    textSave = 'Guardar'//string
}) => {

    const [formClient] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState('tab_1');
    const [prevDocs, setPrevDocs] = useState([]);
    const [newDocs, setNewDocs] = useState([]);

    useEffect(()=>{
        if(Object.keys(itemToEdit).length > 0){
            setPrevDocs(itemToEdit.files);
            formClient.setFieldsValue(itemToEdit);
        }
    },[itemToEdit])

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
        setTimeout(async ()=>{
            let resp = await actionForm(bodyData);
            setLoading(false)
            if (resp == 'RFC_EXIST') return;
            onCloseModal()
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
            'comments',
            'rfc'
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
            closable={!loading}
        >
            <Form
                form={formClient}
                onFinish={onFinish}
                onFinishFailed={onFailure}
                initialValues={{is_active: true}}
            >
                <Row gutter={[0,16]}>
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
                                <Spin spinning={loading}>
                                    <TabClient/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab={'Información de contacto'}
                                key={'tab_2'}
                                forceRender
                            >
                                <Spin spinning={loading}>
                                    <TabContact/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab={'Documentos'}
                                key={'tab_3'}
                                forceRender
                            >
                                <Spin spinning={loading}>
                                    <TabDocuments
                                        newDocs={newDocs}
                                        prevDocs={prevDocs}
                                        setNewDocs={setNewDocs}
                                        setPrevDocs={setPrevDocs}
                                        showPrevDocs={Object.keys(itemToEdit).length > 0}
                                    />
                                </Spin>
                            </Tabs.TabPane>
                        </Tabs>
                    </Col>
                    <Col
                        span={24}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            // justifyContent: 'flex-end'
                        }}
                    >
                        {newDocs.length > 0 && loading && (
                            <span style={{display: 'flex', marginRight: 'auto'}}>
                                Espere un momento por favor, subiendo archivos.
                            </span>
                        )}
                        <div style={{display: 'flex', gap: 8, marginLeft: 'auto'}}>
                            <Button disabled={loading} onClick={()=> onCloseModal()}>Cancelar</Button>
                            <Button htmlType={'submit'} loading={loading}>
                                {textSave}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalClients
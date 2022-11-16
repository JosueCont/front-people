import React, {
    useEffect,
    useState,
    useRef,
    useLayoutEffect
} from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Tabs,
    Form,
    Spin,
    message
} from 'antd';
import { connect } from 'react-redux';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import WebApiJobBank from '../../../api/WebApiJobBank';
import TabClient from './TabClient';
import TabContact from './TabContact';
import TabDocuments from './TabDocuments';
import {
    setLoadClients,
    setInfoClient,
    getInfoClient
} from '../../../redux/jobBankDuck';

const DetailsClients = ({
    action,
    user,
    currentNode,
    load_clients,
    info_client,
    setLoadClients,
    setInfoClient,
    getInfoClient
}) => {

    const fetchingItem = { loading: false, disabled: true };
    const fetchingParams = {
        back: fetchingItem,
        create: fetchingItem,
        edit: fetchingItem
    };
    const router = useRouter();
    const btnSave = useRef(null);
    const [formClients] = Form.useForm();
    const [loading, setLoading] = useState({});
    const [prevDocs, setPrevDocs] = useState([]);
    const [newDocs, setNewDocs] = useState([]);
    const [actionType, setActionType] = useState('');
    const [contactList, setContactList] = useState([]);

    useLayoutEffect(()=>{
        setInfoClient()
    },[])

    useEffect(()=>{
        if(Object.keys(info_client).length > 0 && action == 'edit'){
            formClients.resetFields();
            let prev = info_client.files ?? [];
            let contact = info_client.contact_list ?? [];
            setPrevDocs(prev);
            setContactList(contact);
            formClients.setFieldsValue(info_client);
        }
    },[info_client])

    const createData = (obj) =>{
        let dataClient = new FormData();
        Object.entries(obj).map(([key, val])=>{ if(val) dataClient.append(key, val) });
        if(newDocs.length > 0) newDocs.map(item => dataClient.append('files', item));
        if(contactList.length > 0) dataClient.append('contact_list', JSON.stringify(contactList));
        let toDelete = prevDocs.filter(item => item.is_deleted);
        const saveToDelete = (item, idx) => dataClient.append(`delete_files_id[${idx}]`, item.id);
        if(toDelete.length > 0) toDelete.map(saveToDelete);
        
        return dataClient;
    }

    const onFinishCreate = async (values) =>{
        try {
            values.append('node', currentNode.id);
            values.append('registered_by', user.id);
            let response = await WebApiJobBank.createClient(values);
            actionSaveAnd(response.data.id);
            message.success('Cliente registrado');
        } catch (e) {
            console.log(e)
            setLoadClients(false)
            setLoading({})
            if(e.response?.data['rfc']) message.error('RFC ya registrado');
            else message.error('Cliente no registrado');
        }
    }

    const successUpdate = () =>{
        setNewDocs([])
        setPrevDocs([])
        getInfoClient(info_client.id);    
    }

    const onFinisUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateClient(info_client.id, values);
            successUpdate();
            message.success('Cliente actualizado');
        } catch (e) {
            console.log(e)
            setLoadClients(false);
            if(e.response?.data['rfc']) message.error('RFC ya registrado');
            else message.error('Cliente no actualizado');
        }
    }

    const onFinish = (values) => {
        setLoadClients(true);
        const bodyData = createData(values);
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](bodyData);
    }

    const onFinishFailed = () =>{
        setLoading({})
    }

    const actionCreate = () =>{
        formClients.resetFields();
        setLoadClients(false)
        setLoading({})
    }

    const actionBack = () =>{
        router.push('/jobbank/clients')
    }

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: ()=> actionBack,
            create: actionCreate,
            edit: ()=> router.replace({
                pathname: '/jobbank/clients/edit',
                query: { id }
            })
        }
        actionFunction[actionType](id);
    }

    const getSaveAnd = (type) =>{
        setActionType(type)
        const item = { loading: true, disabled: false };
        setLoading({...fetchingParams, [type]: item });
        btnSave.current.click();
    }

    return (
        <Card>
            <Row gutter={[16,16]}>
                <Col span={24} className='title-action-content'>
                    <p className='title-action-text'>
                        {action == 'add'
                            ? 'Registrar nuevo cliente'
                            : 'Información del cliente'
                        }
                    </p>
                    <Button
                        onClick={()=> actionBack()}
                        icon={<ArrowLeftOutlined />}
                    >
                        Regresar
                    </Button>
                </Col>
                <Col span={24}>
                    <Form
                        className='tabs-vacancies'
                        form={formClients}
                        id='form-clients'
                        layout='vertical'
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Tabs type='card'>
                            <Tabs.TabPane
                                tab='Información del cliente'
                                key='tab_1'
                            >
                                <Spin spinning={load_clients}>
                                    <TabClient/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab='Información de contacto'
                                key='tab_2'
                                forceRender
                            >
                                <Spin spinning={load_clients}>
                                    <TabContact
                                        formClients={formClients}
                                        contactList={contactList}
                                        setContactList={setContactList}
                                    />
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab='Carga de documentos'
                                key='tab_3'
                                forceRender
                            >
                                <Spin spinning={load_clients}>
                                    <TabDocuments
                                        newDocs={newDocs}
                                        prevDocs={prevDocs}
                                        setNewDocs={setNewDocs}
                                        setPrevDocs={setPrevDocs}
                                        showPrevDocs={action == 'edit'}
                                    />
                                </Spin>
                            </Tabs.TabPane>
                        </Tabs>
                    </Form>
                </Col>
                <Col span={24} className='tab-vacancies-btns'>
                    {action == 'add' ? (
                        <>
                            <button
                                htmlType='submit'
                                form='form-clients'
                                ref={btnSave}
                                style={{display:'none'}}
                            />
                            <Button
                                onClick={()=>getSaveAnd('back')}
                                disabled={loading['back']?.disabled}
                                loading={loading['back']?.loading}
                            >
                                Guardar y regresar
                            </Button>
                            <Button
                                onClick={()=>getSaveAnd('create')}
                                disabled={loading['create']?.disabled}
                                loading={loading['create']?.loading}
                            >
                                Guardar y registrar otro
                            </Button>
                            <Button
                                onClick={()=>getSaveAnd('edit')}
                                disabled={loading['edit']?.disabled}
                                loading={loading['edit']?.loading}
                            >
                                Guardar y editar
                            </Button>
                        </>
                    ):(
                        <Button
                            form='form-clients'
                            htmlType='submit'
                            loading={load_clients}
                        >
                            Actualizar
                        </Button>
                    )}
                </Col>
            </Row>
        </Card>
    )
}

const mapState = (state) =>{
    return{
        load_clients: state.jobBankStore.load_clients,
        info_client: state.jobBankStore.info_client,
        currentNode: state.userStore.current_node,
        user: state.userStore.user
    }
}

export default connect(
    mapState, {
        setLoadClients,
        getInfoClient,
        setInfoClient
    }
)(DetailsClients);
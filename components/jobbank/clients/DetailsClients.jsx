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

const DetailsClients = ({
    action,
    user,
    currentNode,
    newFilters = {},
    isAutoRegister = false
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
    const [infoClient, setInfoClient] = useState({});
    const [fetching, setFetching] = useState(false);
    const [currentKey, setCurrentKey] = useState('1');

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoClient(router.query.id)
        }
    },[router.query?.id])

    useEffect(()=>{
        if(Object.keys(infoClient).length > 0 && action == 'edit'){
            formClients.resetFields();
            let prev = infoClient.files ?? [];
            let contact = infoClient.contact_list ?? [];
            let business_name = infoClient.business_name
                ? infoClient.business_name : null;
            setPrevDocs(prev);
            setContactList(contact);
            formClients.setFieldsValue({...infoClient, business_name});
        }
    },[infoClient])

    const getInfoClient = async (id) =>{
        try {
            setFetching(true);
            let response = await WebApiJobBank.getInfoClient(id);
            setInfoClient(response.data);
            setFetching(false);
        } catch (e) {
            console.log(e)
            setFetching(false);
        }
    }

    const createData = (obj) =>{
        let noValid = [undefined, null,""," "];
        let dataClient = new FormData();
        dataClient.append('auto_register', isAutoRegister);
        Object.entries(obj).map(([key, val])=>{
            let value = noValid.includes(val) ? "" : val;
            dataClient.append(key, value);
        });
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
            setFetching(false)
            setLoading({})
            if(e.response?.data['rfc']) message.error('RFC ya registrado');
            else message.error('Cliente no registrado');
        }
    }

    const successUpdate = () =>{
        setNewDocs([])
        setPrevDocs([])
        getInfoClient(infoClient.id);    
    }

    const onFinisUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateClient(infoClient.id, values);
            successUpdate();
            message.success('Cliente actualizado');
        } catch (e) {
            console.log(e)
            setFetching(false);
            if(e.response?.data['rfc']) message.error('RFC ya registrado');
            else message.error('Cliente no actualizado');
        }
    }

    const onFinish = (values) => {
        setFetching(true);
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
        setFetching(false)
        setLoading({})
    }

    const actionBack = () =>{
        router.push({
            pathname: '/jobbank/clients',
            query: newFilters
        })
    }

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: actionBack,
            create: actionCreate,
            edit: ()=> router.replace({
                pathname: '/jobbank/clients/edit',
                query: {...newFilters, id }
            }),
            auto: actionCreate
        }
        let selected = isAutoRegister ? 'auto' : actionType;
        actionFunction[selected]();
    }

    const getSaveAnd = (type) =>{
        setActionType(type)
        const item = { loading: true, disabled: false };
        setLoading({...fetchingParams, [type]: item });
        btnSave.current.click();
    }

    const onChangeTab = (tab) =>{
        if(action == 'add'){
            setCurrentKey(tab)
            return;
        }
        let querys = {...router.query, tab};
        if(querys['tab'] == '1') delete querys['tab'];
        router.replace({
            pathname: router.asPath.split('?')[0],
            query: querys
        }, undefined, {shallow: true})
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
                    {!isAutoRegister && (
                        <Button
                            onClick={()=> actionBack()}
                            icon={<ArrowLeftOutlined />}
                        >
                            Regresar
                        </Button>
                    )}
                </Col>
                <Col span={24}>
                    <Form
                        className='tabs-vacancies'
                        form={formClients}
                        id='form-clients'
                        layout='vertical'
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        initialValues={{is_active: true}}
                    >
                        <Tabs
                            type='card'
                            activeKey={action == 'edit'
                                ? router.query?.tab ?? '1'
                                : currentKey
                            }
                            onChange={onChangeTab}
                        >
                            <Tabs.TabPane
                                tab='Información del cliente'
                                forceRender
                                key='1'
                            >
                                <Spin spinning={fetching}>
                                    <TabClient/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab='Información de contactos'
                                key='2'
                                forceRender
                            >
                                <Spin spinning={fetching}>
                                    <TabContact
                                        formClients={formClients}
                                        contactList={contactList}
                                        setContactList={setContactList}
                                    />
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab='Carga de documentos'
                                key='3'
                                forceRender
                            >
                                <Spin spinning={fetching}>
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
                    {action == 'add' && !isAutoRegister ? (
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
                            loading={fetching}
                        >
                           {isAutoRegister && action == 'add' ? 'Guardar' : 'Actualizar'}
                        </Button>
                    )}
                </Col>
            </Row>
        </Card>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
        user: state.userStore.user
    }
}

export default connect(mapState)(DetailsClients);
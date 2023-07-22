import React, {
    useEffect,
    useState,
    useMemo
} from 'react';
import {
    Tabs,
    Form,
    Spin,
    message
} from 'antd';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import WebApiJobBank from '../../../api/WebApiJobBank';
import Expedient from './Expedient';
import TabClient from './TabClient';
import TabContact from './TabContact';
import TabDocuments from './TabDocuments';
import DetailsCustom from '../DetailsCustom';

const DetailsClients = ({
    action,
    user,
    currentNode,
    newFilters = {},
    isAutoRegister = false
}) => {
    
    const router = useRouter();
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
        dataClient.append('contact_list', JSON.stringify(contactList));
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
            let msg = e.response?.data?.rfc ? 'RFC ya registrado' : 'Cliente no registrado'; 
            message.error(msg);
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
        let url = router.query?.back
            ? `/jobbank/${router.query?.back}`
            : '/jobbank/clients';
        router.push({
            pathname: url,
            query: newFilters
        })
    }

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: actionBack,
            create: actionCreate,
            edit: ()=> router.push({
                pathname: '/jobbank/clients/edit',
                query: {...newFilters, id }
            }),
            auto: actionCreate
        }
        let selected = isAutoRegister ? 'auto' : actionType;
        actionFunction[selected]();
    }

    const onChangeTab = (tab) =>{
        if(action == 'add'){
            setCurrentKey(tab)
            return;
        }
        router.replace({
            pathname: '/jobbank/clients/edit',
            query: {...router.query, tab}
        }, undefined, {shallow: true})
    }

    const activeKey = useMemo(()=>{
        let tab = router.query?.tab;
        return action == 'edit'
            ? tab ? tab : '1'
            : currentKey;
    },[router.query, currentKey, action])

    const propsCustom = {
        action,
        loading,
        fetching,
        setLoading,
        actionBack,
        setActionType,
        isAutoRegister,
        idForm: 'form-clients',
        titleCard: action == 'add'
            ? 'Registrar nuevo cliente'
            : 'Información del cliente',
    }

    return (
        <DetailsCustom {...propsCustom}>
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
                    activeKey={activeKey}
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
                            />
                        </Spin>
                    </Tabs.TabPane>
                </Tabs>
            </Form>
        </DetailsCustom>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
        user: state.userStore.user
    }
}

export default connect(mapState)(DetailsClients);
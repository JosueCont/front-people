import React, {
  useEffect,
  useState
} from 'react';
import {
  Form,
  Spin,
  message
} from 'antd';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import DetailsCustom from '../../DetailsCustom';
import FormMessages from './FormMessages';
import { getTagsNotification, getConnectionsOptions } from '../../../../redux/jobBankDuck';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';

const DetailsMessages = ({
    action,
    currentNode,
    newFilters = {},
    getTagsNotification,
    getConnectionsOptions
}) => {

    const router = useRouter();
    const [formMessage] = Form.useForm();
    const [infoNotification, setInfoNotification] = useState({});
    const [actionType, setActionType] = useState('');
    const [loading, setLoading] = useState({});
    const [fetching, setFetching] = useState(false);
    const [msgHTML, setMsgHTML] = useState("<p></p>");
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(()=>{
        if(!currentNode) return;
        getTagsNotification(currentNode.id);
        getConnectionsOptions(currentNode.id, '&conection_type=2');
    },[currentNode])

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoNotification(router.query.id);
        }
    },[router.query?.id])

    useEffect(()=>{
        if(Object.keys(infoNotification).length <= 0) return;
        formMessage.resetFields();
        let notification_source = Array.isArray(infoNotification.notification_source) ?
            infoNotification.notification_source : [];
        formMessage.setFieldsValue({...infoNotification, notification_source});
        if(!infoNotification.message) return;
        setMsgHTML(infoNotification.message);
        let convert = convertFromHTML(infoNotification.message);
        let htmlMsg = ContentState.createFromBlockArray(convert);
        let template = EditorState.createWithContent(htmlMsg);
        setEditorState(template);
    },[infoNotification])

    const getInfoNotification = async (id) =>{
        try {
            setFetching(true)
            let response = await WebApiJobBank.getInfoNotification(id);
            setInfoNotification(response.data)
            setFetching(false)
        } catch (e) {
            console.log(e)
            setFetching(false)
        }
    }

    const onFinishCreate = async (values) =>{
        try {
            let response = await WebApiJobBank.createTemplateNotification({...values, node: currentNode.id})
            actionSaveAnd(response.data?.id)
            message.success('Notificación registrada');
            setFetching(false)
        } catch (e) {
            console.log(e)
            message.error('Notificación no registrada');
            setFetching(false)
            setLoading({})
        }
    }

    const onFinisUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateTemplateNotification(router.query?.id, values);
            getInfoNotification(router.query?.id)
            setFetching(false)
            message.success('Notificación actualizada')
        } catch (e) {
            console.log(e)
            setFetching(false)
            message.error('Notificación no actualizada')
        }
    }

    const onFinish = (values) =>{
        let isEmpty = editorState.getCurrentContent().getPlainText() == "";
        if(isEmpty){
            message.error('Mensaje vacío');
            setLoading({})
            return;
        }
        setFetching(true)
        values.message = msgHTML;
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](values);
    }

    const actionBack = () =>{
        router.push({
            pathname: '/jobbank/settings/catalogs/messages',
            query: newFilters
        })
    }

    const actionCreate = () =>{
        formMessage.resetFields();
        setMsgHTML('<p></p>');
        setFetching(false)
        setLoading({})
        setEditorState(EditorState.createEmpty())
    }

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: actionBack,
            create: actionCreate,
            edit: () => router.replace({
                pathname: '/jobbank/settings/catalogs/messages/edit',
                query: {...newFilters, id }
            }),
        }
        actionFunction[actionType]();
    }

    const propsCustom = {
        action,
        loading,
        fetching,
        setLoading,
        actionBack,
        setActionType,
        idForm: 'form-messages',
        titleCard: action == 'add'
            ? 'Registrar nuevo mensaje'
            : 'Información del mensaje',
    }

    return (
        <DetailsCustom {...propsCustom}>
            <Spin spinning={fetching}>
                <Form
                    form={formMessage}
                    layout='vertical'
                    id='form-messages'
                    onFinish={onFinish}
                    onFinishFailed={()=> setLoading({})}
                    initialValues={{draft: true}}
                >
                    <FormMessages
                        setMsgHTML={setMsgHTML}
                        formMessage={formMessage}
                        editorState={editorState}
                        setEditorState={setEditorState}
                    />
                </Form>
            </Spin>
        </DetailsCustom>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        getTagsNotification,
        getConnectionsOptions
    }
)(DetailsMessages);
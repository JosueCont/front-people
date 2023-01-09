import React, {
  useEffect,
  useState,
  useRef
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
import WebApiJobBank from '../../../../api/WebApiJobBank';
import CustomDetails from './CustomDetails';
import FormMessages from './FormMessages';
import { getTagsNotification } from '../../../../redux/jobBankDuck';

const DetailsMessages = ({
    action,
    currentNode,
    newFilters = {},
    getTagsNotification
}) => {

    const router = useRouter();
    const [formMessage] = Form.useForm();
    const [actionType, setActionType] = useState('');
    const [loading, setLoading] = useState({});

    useEffect(()=>{
        if(!currentNode) return;
        getTagsNotification(currentNode.id);
    },[currentNode])

    const actionBack = () =>{
        router.push({
            pathname: '/jobbank/settings/catalogs/messages',
            query: newFilters
        })
    }

    const actionCreate = () =>{

    }

    const actionEdit = () =>{

    }

    return (
        <CustomDetails
            idForm='form-messages'
            action={action}
            textTitle={action == 'add' ? 'Registrar nuevo mensaje' : 'Información del mensaje'}
            actionBack={actionBack}
            setActionType={setActionType}
            setLoading={setLoading}
            loading={loading}
        >
            <Form
                form={formMessage}
                layout='vertical'
                id='form-messages'
                onFinishFailed={()=> setLoading({})}
            >
                <FormMessages formMessage={formMessage}/>
            </Form>
        </CustomDetails>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState, {getTagsNotification})(DetailsMessages);
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
  message,
  Divider
} from 'antd';
import { ConnectionProvider } from './context/ConnectionContext';
import { connect } from 'react-redux';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import WebApiJobBank from '../../../api/WebApiJobBank';
import GetForm from './GetForm';
import { useProcessInfo } from './hook/useProcessInfo';

const DetailsConnections = ({
    action,
    currentNode,
    newFilters
}) => {

    const router = useRouter();
    const [formConnection] = Form.useForm();
    const [fileImg, setFileImg] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [infoConnection, setInfoConnection] = useState({});
    const { createData, formatData } = useProcessInfo();

    useEffect(()=>{
        if(router.query?.id && action == 'edit'){
            getInfoConnection(router.query.id)
        }
    },[router.query?.id])

    useEffect(()=>{
        if(Object.keys(infoConnection).length <= 0) return;
        setValuesForm();
    },[infoConnection])

    const setValuesForm = () =>{
        formConnection.resetFields();
        let values = formatData(infoConnection);
        let image_read = infoConnection.default_image
            ? infoConnection.default_image.split('/').at(-1)
            : null; 
        formConnection.setFieldsValue({...values, image_read});
    }

    const getInfoConnection = async (id) =>{
        try {
            setFetching(true)
            let response = await WebApiJobBank.getDetailsConnection(id);
            setInfoConnection(response.data)
            setFetching(false)
        } catch (e) {
            console.log(e)
            setFetching(false)
        }
    }

    const onFinishCreate = async (values) =>{

    }

    const onFinisUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateConnection(router.query?.id, values);
            message.success('Conexión actualizada');
            setFetching(false)
            setFileImg([])
            getInfoConnection(router.query?.id);
        } catch (e) {
            console.log(e)
            setFetching(false)
            message.error('Conexión no actualizada');
        }
    }

    const passFormData = (values) =>{
        let objValues = createData(values);
        let dataFacebook = new FormData();
        dataFacebook.append('node', currentNode.id);
        if(fileImg.length > 0) dataFacebook.append('default_image', fileImg[0]);
        Object.entries(objValues).map(item =>{
            let value = typeof item[1] == 'object'
                ? JSON.stringify(item[1])
                : item[1];
            dataFacebook.append(item[0], value)
        });
        return dataFacebook;
    }

    const onFinish = (values) =>{
        setFetching(true);
        const bodyData = passFormData(values);
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](bodyData);
    }

    const actionBack = () =>{
        router.push({
            pathname: '/jobbank/settings/connections',
            query: newFilters
        })
    }

    return (
        <Card>
            <Row gutter={[16,16]}>
                <Col span={24} className='title-action-content title-action-border'>
                    <p className='title-action-text'>
                        {action == 'add'
                            ? 'Registrar nueva conexión'
                            : 'Información de la conexión'
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
                    <Spin spinning={fetching}>
                        <Form
                            layout='vertical'
                            form={formConnection}
                            onFinish={onFinish}
                        >
                            <Row gutter={[24,0]}>
                                <ConnectionProvider
                                    infoConnection={infoConnection}
                                    loading={fetching}
                                    formConnection={formConnection}
                                    setFileImg={setFileImg}
                                >
                                    <GetForm/>
                                </ConnectionProvider>
                            </Row>
                        </Form>
                    </Spin>
                </Col>
            </Row>
        </Card>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState)(DetailsConnections);
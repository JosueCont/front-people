import React, {
  useEffect,
  useState,
  useMemo
} from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Spin,
  message,
} from 'antd';
import { connect } from 'react-redux';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import WebApiJobBank from '../../../api/WebApiJobBank';
import GetForm from './GetForm';
import { useInfoConnection } from '../hook/useInfoConnection';

const DetailsConnections = ({
    currentNode,
    newFilters
}) => {

    const router = useRouter();
    const [formConnection] = Form.useForm();
    const [fileImg, setFileImg] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [infoConfig, setInfoConfig] = useState({});
    const [infoConnection, setInfoConnection] = useState({});
    const { createData, formatData } = useInfoConnection();

    useEffect(()=>{
        if(!currentNode) return;
        let code = router.query?.code;
        if(!['FB','IG'].includes(code)) return;
        let param = code == 'IG' ? 'FB' : 'IG';
        getConfigByCode(currentNode.id, `&code=${param}`)
    },[currentNode, router.query?.code])

    useEffect(()=>{
        if(router.query?.id){
            getInfoConnection(router.query.id)
        }
    },[router.query?.id])

    const existPreConfig = useMemo(()=>{
        let current = infoConnection?.data_config ?? {};
        let exist = infoConfig?.data_config ?? {};
        let existKeys = Object.keys(current).length > 0;
        let othersKeys = Object.keys(exist).length > 0; 
        if(existKeys || infoConnection.data_config) return false;
        if(!othersKeys || !infoConfig.data_config) return false;
        return true;
    },[infoConnection, infoConfig])

    useEffect(()=>{
        let code = router.query?.code;
        if(['FB','IG'].includes(code) && existPreConfig){
            setConfigExist();
            return;
        }
        setValuesForm();
    },[infoConnection, infoConfig, router.query?.code])

    const setConfigExist = () =>{
        formConnection.resetFields();
        let values = formatData({...infoConnection, data_config: infoConfig.data_config});
        let name_file = infoConnection.default_image
            ? infoConnection.default_image.split('/').at(-1)
            : null; 
        formConnection.setFieldsValue({...values, name_file});
    }

    const setValuesForm = () =>{
        formConnection.resetFields();
        let values = formatData(infoConnection);
        let name_file = infoConnection.default_image
            ? infoConnection.default_image.split('/').at(-1)
            : null; 
        formConnection.setFieldsValue({...values, name_file});
    }

    const getConfigByCode = async (node, query) =>{
        try {
            let response = await WebApiJobBank.getConnections(node, query);
            let config = response.data?.results?.at(-1) ?? {};
            setInfoConfig(config)
        } catch (e) {
            console.log(e)
        }
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
        onFinisUpdate(bodyData);
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
                        Información de la conexión
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
                                <GetForm
                                    infoConnection={infoConnection}
                                    infoConfig={infoConfig}
                                    loading={fetching}
                                    formConnection={formConnection}
                                    existPreConfig={existPreConfig}
                                    setFileImg={setFileImg}
                                />
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
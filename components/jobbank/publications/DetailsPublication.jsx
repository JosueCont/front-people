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
import FormPublications from './FormPublications';
// import { useProcessInfo } from './hook/useProcessInfo';
import {
    setLoadStrategies,
    getInfoStrategy,
    setInfoStrategy,
    setLoadPublications,
    getInfoPublication,
    setInfoPublication
} from '../../../redux/jobBankDuck';

const DetailsPublication = ({
    action,
    currentNode,
    load_publications,
    info_publication,
    setLoadPublications,
    getInfoPublication,
    setInfoPublication
}) => {

    const fetchingItem = { loading: false, disabled: true };
    const fetchingParams = {
        back: fetchingItem,
        create: fetchingItem,
        edit: fetchingItem
    };
    const btnSave = useRef(null);
    const router = useRouter();
    const [formPublications] = Form.useForm();
    const [loading, setLoading] = useState({});
    const [actionType, setActionType] = useState('');

    useLayoutEffect(()=>{
        setInfoStrategy()
    },[])

    // useEffect(()=>{
    //     if(router.query.customer && action == 'add'){
    //         formPublications.resetFields()
    //         keepCustomer()
    //     }else setDisabledClient(false);
    // },[router])

    // useEffect(()=>{
    //     if(Object.keys(info_strategy).length > 0 && action == 'edit'){
    //         formPublications.resetFields();
    //         setValuesForm()
    //     }
    // },[info_strategy])

    const keepVacant = () =>{
        formPublications.setFieldsValue({
            vacant: router.query.vacant
        })
    }

    const createData = (values) =>{
        return values;
    }

    const onFinishUpdate = async (values) =>{
        
    }

    const onFinishCreate = async (values) =>{
        
    }

    const onFinish = (values) =>{
        setLoadPublications(true)
        const bodyData = createData(values);
        const actionFunction = {
            edit: onFinishUpdate,
            add: onFinishCreate
        }
        actionFunction[action](bodyData);
    }

    const actionBack = () =>{
        if(router.query?.vacant) router.push('/jobbank/vacancies');
        else router.push('/jobbank/publications');
    }

    const actionCreate = () =>{
        formPublications.resetFields();
        if (router.query?.vacant) keepVacant();
        setLoadStrategies(false)
        setLoading({})
    }

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: actionBack,
            create: actionCreate,
            edit: ()=> router.replace({
                pathname: '/jobbank/publications/edit',
                query: { id }
            })
        }
        actionFunction[actionType]();
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
                <Col span={24} className='title-action-content title-action-border'>
                    <p className='title-action-text'>
                        {action == 'add'
                            ? 'Registrar nueva publicación'
                            : 'Información de la publicación'
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
                    <Spin spinning={load_publications}>
                        <Form
                            id='form-publications'
                            form={formPublications}
                            layout='vertical'
                            onFinish={onFinish}
                            onFinishFailed={()=> setLoading({})}
                        >
                            <FormPublications formPublications={formPublications}/>
                        </Form>
                    </Spin>
                </Col>
                <Col span={24} className='tab-vacancies-btns'>
                    {action == 'add' ? (
                        <>
                            <button
                                htmlType='submit'
                                form='form-publications'
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
                                Guardar y registrar otra
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
                            form='form-publications'
                            htmlType='submit'
                            loading={load_publications}
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
        load_publications: state.jobBankStore.load_publications,
        info_publication: state.jobBankStore.info_publication,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        setLoadPublications,
        getInfoPublication,
        setInfoPublication
    }
)(DetailsPublication);
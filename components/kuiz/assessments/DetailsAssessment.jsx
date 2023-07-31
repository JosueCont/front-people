import React, {
    useEffect,
    useState
} from 'react';
import {
    Row,
    Col,
    Card,
    Button,
    Form,
    Input,
    Select,
    Spin,
    message
} from 'antd';
import {
    ArrowLeftOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { ruleRequired } from '../../../utils/rules';
import { EditorState } from 'draft-js';
import WebApiAssessment from '../../../api/WebApiAssessment';
const EditorHTML = dynamic(() => import('../../jobbank/EditorHTML'), { ssr: false });

const DetailsAssessment = ({
    action,
    newFilters = {},
    currentNode,
    list_categories,
    load_categories
}) => {

    const router = useRouter();
    const [formAssessment] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [valueHTML, setValueHTML] = useState({});
    const [infoAssessment, setInfoAssessment] = useState({});

    const emptyHTML = EditorState.createEmpty();
    const initialHTML = {
        description_es: emptyHTML,
        instructions_es: emptyHTML
    }
    const [editorState, setEditorState] = useState(initialHTML);
    const propsEditor = {
        wrapperStyle: {
            marginBottom: '24px'
        },
        editorStyle: {
            minHeight: '200px',
            maxHeight: '200px',
            backgroundColor: '#f5f5f5'
        }
    }

    useEffect(()=>{
        if(router.query?.id && action == 'edit'){
            getInfoAssessment()
        }
    },[router.query?.id])

    useEffect(()=>{
        if(Object.keys(infoAssessment)?.length <=0) return;
        setValuesForm()
    },[infoAssessment])

    const getInfoAssessment = async (id) =>{
        try {
            setLoading(true)
            let response = await WebApiAssessment.getDetailsAssessment(router.query?.id);
            setInfoAssessment(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }
    
    const setValuesForm = () =>{
        let values = {};
        values.code = infoAssessment?.code ? infoAssessment?.code : null;
        values.name = infoAssessment?.name ? infoAssessment?.name : null;
        values.categories = infoAssessment?.categories?.length > 0
            ? infoAssessment.categories : null;
        formAssessment.setFieldsValue(values)
    }

    const onFinishCreate = async (values) =>{
        try {
            let body = {...values, node: currentNode?.id};
            let response = await WebApiAssessment.createAssessments(body);
            let txt = response?.data?.code;
            if(Array.isArray(txt)){
                setLoading(false)
                formAssessment.setFields([{name: 'code', errors: txt}]);
                return;
            }
            message.success('Evaluación registrada')
            actionBack()
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Evaluación no registrada')
        }
    }

    const onFinisUpdate = async (values) =>{
        try {
            let response = await WebApiAssessment.updateAssessments(router.query?.id, values);
            let txt = response?.data?.code;
            if(Array.isArray(txt)){
                setLoading(false)
                formAssessment.setFields([{name: 'code', errors: txt}]);
                return;
            }
            message.success('Evaluación actualizada')
            getInfoAssessment()
        } catch (e) {
            console.log(e)
            message.error('Evaluación no actualizada')
        }
    }

    const onFinish = (values) =>{
        setLoading(true);
        let body = {...values, ...valueHTML};
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](body);
    }

    const actionBack = () =>{
        router.push({
            pathname: '/kuiz/assessments',
            query: newFilters
        })
    }

    return (
        <Row gutter={[24, 12]}>
            <Col span={24} className='header-card'>
                <div className='title-action-content'>
                    <p className='title-action-text'>
                        {action == 'add'
                            ? 'Registrar evaluación'
                            : 'Información de la evaluación'}
                    </p>
                    <div className='content-end' style={{ gap: 8 }}>
                        <Button
                            onClick={() => actionBack()}
                            icon={<ArrowLeftOutlined />}
                            disabled={loading}
                        >
                            Regresar
                        </Button>
                    </div>
                </div>
            </Col>
            <Col span={24} className='ant-spinning'>
                <Spin spinning={loading}>
                    <Card bodyStyle={{ padding: 18 }}>
                        <Form
                            layout='vertical'
                            form={formAssessment}
                            onFinish={onFinish}
                        >
                            <Row gutter={[24, 0]}>
                                <Col xs={24} md={12} xl={8}>
                                    <Form.Item
                                        name='code'
                                        label='Código'
                                        rules={[ruleRequired]}
                                    >
                                        <Input
                                            allowClear
                                            className='input-with-clear'
                                            placeholder='Código'
                                            maxLength={200}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} xl={8}>
                                    <Form.Item
                                        name='name'
                                        label='Nombre'
                                        rules={[ruleRequired]}
                                    >
                                        <Input
                                            allowClear
                                            className='input-with-clear'
                                            placeholder='Nombre'
                                            maxLength={200}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} xl={8}>
                                    <Form.Item
                                        name='categories'
                                        label='Categorías'
                                        rules={[ruleRequired]}
                                    >
                                        <Select
                                            allowClear
                                            showSearch
                                            mode='multiple'
                                            disabled={load_categories}
                                            loading={load_categories}
                                            placeholder='Seleccionar una opción'
                                            notFoundContent='No se encontraron resultados'
                                            optionFilterProp='children'
                                        >
                                            {list_categories?.length > 0 && list_categories.map(item => (
                                                <Select.Option value={item.id} key={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <EditorHTML
                                        label='Descripción'
                                        placeholder='Descripción'
                                        textHTML={infoAssessment?.description_es}
                                        setValueHTML={e => setValueHTML(prev => ({ ...prev, description_es: e }))}
                                        editorState={editorState?.description_es}
                                        setEditorState={e => setEditorState(prev => ({ ...prev, description_es: e }))}
                                        {...propsEditor}
                                    />
                                </Col>
                                <Col span={24}>
                                    <EditorHTML
                                        label='Instrucciones'
                                        placeholder='Instrucciones'
                                        textHTML={infoAssessment?.instructions_es}
                                        setValueHTML={e => setValueHTML(prev => ({ ...prev, instructions_es: e }))}
                                        editorState={editorState?.instructions_es}
                                        setEditorState={e => setEditorState(prev => ({ ...prev, instructions_es: e }))}
                                        {...propsEditor}
                                    />
                                </Col>
                                <Col span={24} className='content-end'>
                                    <Button htmlType='submit'>
                                        {action == 'add' ? 'Guardar' : 'Actualizar'}
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Spin>
            </Col>
        </Row>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
        list_categories: state.kuizStore.list_categories,
        load_categories: state.kuizStore.load_categories
    }
}

export default connect(mapState)(DetailsAssessment);
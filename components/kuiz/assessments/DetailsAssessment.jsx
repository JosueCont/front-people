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
    Spin
} from 'antd';
import {
    ArrowLeftOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { ruleRequired } from '../../../utils/rules';
import { EditorState } from 'draft-js';
import WebApiAssessment from '../../../api/WebApiAssessment';
const EditorHTML = dynamic(() => import('../../jobbank/EditorHTML'), { ssr: false });

const DetailsAssessment = ({
    action
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

    }

    const onFinisUpdate = async (values) =>{

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
                            // onClick={() => actionBack()}
                            icon={<ArrowLeftOutlined />}
                            disabled={loading}
                        >
                            Regresar
                        </Button>
                    </div>
                </div>
            </Col>
            <Col span={24} className='ant-spinning'>
                <Spin spinning={false}>
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
                                            placeholder='Seleccionar una opción'
                                            notFoundContent='No se encontraron resultados'
                                            optionFilterProp='children'
                                        >
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

export default DetailsAssessment
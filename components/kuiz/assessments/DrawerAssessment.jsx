import React, {
    useEffect,
    useState,
    useMemo
} from 'react';
import {
    Row,
    Col,
    Button,
    Form,
    Input,
    Spin,
    message,
    Drawer,
    Space,
    Select
} from 'antd';
import {
    LoadingOutlined
} from '@ant-design/icons';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ruleRequired, ruleWhiteSpace } from '../../../utils/rules';
import { EditorState } from 'draft-js';
import WebApiAssessment from '../../../api/WebApiAssessment';
import { useSelector } from 'react-redux';
const EditorHTML = dynamic(() => import('../../jobbank/EditorHTML'), { ssr: false });

const DrawerAssessment = ({
    visible = false,
    itemToEdit = {},
    close = () => { },
    onReady = () => { },
}) => {

    const {
        current_node
    } = useSelector(state => state.userStore)
    const {
        list_categories,
        load_categories
    } = useSelector(state => state.kuizStore);

    const router = useRouter();
    const [formAssessment] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [valueHTML, setValueHTML] = useState({});

    const options = ['inline', 'list', 'textAlign', 'image'];
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

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit])

    useEffect(() => {
        if (Object.keys(itemToEdit).length <= 0) return;
        let values = {};
        values.code = itemToEdit?.code ? itemToEdit?.code : null;
        values.name = itemToEdit?.name ? itemToEdit?.name : null;
        formAssessment.setFieldsValue(values)
    }, [itemToEdit])

    const actionCreate = async (values) => {
        try {
            let body = { ...values, node: current_node?.id };
            let response = await WebApiAssessment.createAssessments(body);
            let txt = response?.data?.code;
            setTimeout(() => {
                if (Array.isArray(txt)) {
                    setLoading(false)
                    formAssessment.setFields([{ name: 'code', errors: txt }]);
                    return;
                }
                message.success('Evaluación registrada')
                onClose()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Evaluación no registrada')
        }
    }

    const actionUpdate = async (values) => {
        try {
            let response = await WebApiAssessment.updateAssessments(itemToEdit?.id, values);
            let txt = response?.data?.code;
            setTimeout(() => {
                if (Array.isArray(txt)) {
                    setLoading(false)
                    formAssessment.setFields([{ name: 'code', errors: txt }]);
                    return;
                }
                message.success('Evaluación actualizada')
                onClose()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Evaluación no actualizada')
        }
    }

    const onFinish = (values) => {
        setLoading(true)
        let body = { ...values, ...valueHTML };
        if (isEdit) actionUpdate(body);
        else actionCreate(body);
    }

    const onClose = () => {
        close()
        setValueHTML({})
        setLoading(false)
        setEditorState(initialHTML)
        formAssessment.resetFields()
    }

    return (
        <Drawer
            title={isEdit ? 'Editar evaluación' : 'Agregar evaluación'}
            width={600}
            visible={visible}
            placement='right'
            maskClosable={false}
            closable={!loading}
            keyboard={false}
            onClose={() => onClose()}
            footer={
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button
                        disabled={loading}
                        onClick={() => onClose()}
                    >
                        Cancelar
                    </Button>
                    <Button
                        htmlType='submit'
                        disabled={loading}
                        form='form-assessment'
                    >
                        {isEdit ? 'Actualizar' : 'Guardar'}
                    </Button>
                </Space>
            }
        >
            <Spin
                spinning={loading}
                indicator={<LoadingOutlined style={{ color: 'rgba(0,0,0,0.5)' }} />}
            >
                <Form
                    id='form-assessment'
                    layout='vertical'
                    form={formAssessment}
                    onFinish={onFinish}
                >
                    <Row gutter={[24, 0]}>
                        <Col span={24}>
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
                        <Col span={12}>
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
                        <Col span={12}>
                            <Form.Item
                                name='categories'
                                label='Categorías'
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    mode='multiple'
                                    maxTagCount='responsive'
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
                                options={options}
                                textHTML={itemToEdit?.description_es}
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
                                options={options}
                                textHTML={itemToEdit?.instructions_es}
                                setValueHTML={e => setValueHTML(prev => ({ ...prev, instructions_es: e }))}
                                editorState={editorState?.instructions_es}
                                setEditorState={e => setEditorState(prev => ({ ...prev, instructions_es: e }))}
                                {...propsEditor}
                            />
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Drawer>
    )
}

export default DrawerAssessment
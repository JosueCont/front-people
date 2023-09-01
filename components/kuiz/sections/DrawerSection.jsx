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
    Space
} from 'antd';
import {
    LoadingOutlined
} from '@ant-design/icons';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ruleRequired, ruleWhiteSpace } from '../../../utils/rules';
import { EditorState } from 'draft-js';
import WebApiAssessment from '../../../api/WebApiAssessment';
const EditorHTML = dynamic(() => import('../../jobbank/EditorHTML'), { ssr: false });

const DrawerSection = ({
    visible = false,
    itemToEdit = {},
    close = () => { },
    onReady = () => { },
}) => {

    const router = useRouter();
    const [formSection] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [valueHTML, setValueHTML] = useState({});

    const options = ['inline', 'list', 'textAlign', 'image'];
    const emptyHTML = EditorState.createEmpty();
    const initialHTML = {
        instructions_es: emptyHTML,
        short_instructions_es: emptyHTML
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
        formSection.setFieldsValue(values)
    }, [itemToEdit])

    const actionCreate = async (values) => {
        try {
            let body = { ...values, assessment: router.query?.assessment };
            await WebApiAssessment.createSection(body);
            setTimeout(() => {
                message.success('Sección registrada')
                onClose()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Sección no registrada')
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiAssessment.updateSection(itemToEdit?.id, values);
            setTimeout(() => {
                message.success('Sección actualizada')
                onClose()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Sección no actualizada')
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
        formSection.resetFields()
    }

    return (
        <Drawer
            title={isEdit ? 'Editar sección' : 'Agregar sección'}
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
                        form='form-section'
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
                    id='form-section'
                    layout='vertical'
                    form={formSection}
                    onFinish={onFinish}
                >
                    <Row gutter={[24, 0]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name='name'
                                label='Nombre'
                                rules={[ruleRequired, ruleWhiteSpace]}
                            >
                                <Input
                                    allowClear
                                    className='input-with-clear'
                                    placeholder='Nombre'
                                    maxLength={200}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name='code'
                                label='Código'
                                rules={[ruleWhiteSpace]}
                            >
                                <Input
                                    allowClear
                                    className='input-with-clear'
                                    placeholder='Código'
                                    maxLength={200}
                                />
                            </Form.Item>
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
                        <Col span={24}>
                            <EditorHTML
                                label='Instrucciones corta'
                                placeholder='Instrucciones corta'
                                options={options}
                                textHTML={itemToEdit?.short_instructions_es}
                                setValueHTML={e => setValueHTML(prev => ({ ...prev, short_instructions_es: e }))}
                                editorState={editorState?.short_instructions_es}
                                setEditorState={e => setEditorState(prev => ({ ...prev, short_instructions_es: e }))}
                                {...propsEditor}
                            />
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Drawer>
    )
}

export default DrawerSection
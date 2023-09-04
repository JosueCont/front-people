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
const EditorHTML = dynamic(() => import('../../jobbank/EditorHTML'), { ssr: false });

const DrawerQuestion = ({
    visible = false,
    itemToEdit = {},
    close = () => { },
    onReady = () => { },
}) => {

    const router = useRouter();
    const [formQuestion] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [valueHTML, setValueHTML] = useState('');
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const isEdit = useMemo(() => Object.keys(itemToEdit).length > 0, [itemToEdit])

    useEffect(() => {
        if (Object.keys(itemToEdit).length <= 0) return;
        let values = {};
        values.title = itemToEdit?.title ? itemToEdit?.title : null;
        values.type = itemToEdit?.type ? itemToEdit?.type : null;
        formQuestion.setFieldsValue(values)
    }, [itemToEdit])

    const actionCreate = async (values) => {
        try {
            let body = { ...values, section: router.query?.section };
            await WebApiAssessment.createQuestion(body);
            setTimeout(() => {
                message.success('Pregunta registrada')
                onClose()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Pregunta no registrada')
        }
    }

    const actionUpdate = async (values) => {
        try {
            await WebApiAssessment.updateQuestion(itemToEdit?.id, values);
            setTimeout(() => {
                message.success('Pregunta actualizada')
                onClose()
                onReady()
            }, 1000)
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Pregunta no actualizada')
        }
    }

    const onFinish = (values) => {
        setLoading(true)
        if (valueHTML) values.description_es = valueHTML;
        if (isEdit) actionUpdate(values);
        else actionCreate(values);
    }

    const onClose = () => {
        close()
        setValueHTML('')
        setLoading(false)
        setEditorState(EditorState.createEmpty())
        formQuestion.resetFields()
    }

    return (
        <Drawer
            title={isEdit ? 'Editar pregunta' : 'Agregar pregunta'}
            width={500}
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
                        form='form-question'
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
                    id='form-question'
                    layout='vertical'
                    form={formQuestion}
                    onFinish={onFinish}
                >
                    <Row gutter={[24, 0]}>
                        <Col span={24}>
                            <Form.Item
                                name='title'
                                label='Título'
                                rules={[ruleRequired, ruleWhiteSpace]}
                            >
                                <Input
                                    allowClear
                                    className='input-with-clear'
                                    placeholder='Título'
                                    maxLength={200}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name='type'
                                label='Tipo'
                                rules={[ruleRequired]}
                            >
                                <Select placeholder='Seleccionar una opción'>
                                    <Select.Option value='MULTI'>Opción Múltiple</Select.Option>
                                    <Select.Option value='TXT-LG'>Texto largo</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <EditorHTML
                                label='Descripción'
                                placeholder='Descripción'
                                options={['inline', 'list', 'textAlign', 'image']}
                                textHTML={itemToEdit?.description_es}
                                setValueHTML={setValueHTML}
                                editorState={editorState}
                                setEditorState={setEditorState}
                                editorStyle={{
                                    minHeight: '300px',
                                    maxHeight: '300px',
                                    backgroundColor: '#f5f5f5'
                                }}
                            />
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Drawer>
    )
}

export default DrawerQuestion
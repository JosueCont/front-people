import React, {
    useEffect,
    useState
} from 'react';
import MyModal from '../../../common/MyModal';
import {
    Form,
    Row,
    Col,
    Input,
    Select,
    Button,
    Switch
} from 'antd';
import {
    ruleRequired,
    ruleURL,
    ruleWhiteSpace
} from '../../../utils/rules';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { EditorState } from 'draft-js';
const EditorHTML = dynamic(() => import('../EditorHTML'), { ssr: false });

const ModalEvaluations = ({
    title = '',
    visible = false,
    close = () => { },
    itemToEdit = {},
    actionForm = () => { },
    textSave = 'Guardar'
}) => {

    const {
        list_group_assessments,
        load_group_assessments,
    } = useSelector(state => state.assessmentStore);

    const [formTest] = Form.useForm();
    const [loading, setLoaing] = useState(false);

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [valueHTML, setValueHTML] = useState('<p></p>');

    const type = Form.useWatch('source', formTest);

    useEffect(() => {
        if (Object.keys(itemToEdit)?.length <= 0) return;
        setValuesForm()
    }, [itemToEdit])

    const onFinish = (values) => {
        setLoaing(true)
        values.instructions = valueHTML;
        values.url = values.source == 1
            ? null : values.url;
        values.group_assessment = values.source == 2
            ? [] : values.group_assessment;
        setTimeout(() => {
            setLoaing(false)
            actionForm(values)
            onClose()
        }, 2000)
    }

    const setValuesForm = () => {
        let values = { ...itemToEdit };
        values.group_assessment = itemToEdit.group_assessment?.length > 0
            ? values.group_assessment?.map(item => item.id) : [];
        formTest.setFieldsValue(values)
    }

    const onClose = () => {
        formTest.resetFields()
        setValueHTML('<p></p>')
        setEditorState(EditorState.createEmpty())
        close()
    }

    return (
        <MyModal
            title={title}
            visible={visible}
            widthModal={500}
            close={onClose}
            closable={!loading}
        >
            <Form
                form={formTest}
                layout='vertical'
                onFinish={onFinish}
                initialValues={{
                    source: 1,
                    is_active: true
                }}
            >
                <Row>
                    <Col span={24} style={{ display: 'none' }}>
                        <Form.Item
                            name='is_active'
                            label='¿Está activo?'
                            valuePropName='checked'
                        >
                            <Switch
                                checkedChildren="Activo"
                                unCheckedChildren="Inactivo"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name='name'
                            label='Nombre'
                            rules={[ruleRequired, ruleWhiteSpace]}
                        >
                            <Input
                                maxLength={50}
                                placeholder='Nombre'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name='source'
                            label='Tipo'
                            rules={[ruleRequired]}
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                            >
                                <Select.Option key='1' value={1}>
                                    KHOR+
                                </Select.Option>
                                <Select.Option key='2' value={2}>
                                    Cliente
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        {type == 1 ? (
                            <Form.Item
                                name='group_assessment'
                                label='Grupo'
                                rules={[ruleRequired]}
                            >

                                <Select
                                    mode='multiple'
                                    maxTagCount={1}
                                    disabled={load_group_assessments}
                                    loading={load_group_assessments}
                                    placeholder='Seleccionar una opción'
                                    notFoundContent='No se encontraron resultados'
                                    optionFilterProp='children'
                                >
                                    {list_group_assessments.length > 0 && list_group_assessments.map(item => (
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        ) : (
                            <Form.Item
                                name='url'
                                label={'URL'}
                                rules={[ruleURL]}
                            >
                                <Input placeholder='URL' />
                            </Form.Item>
                        )}

                    </Col>
                    <Col span={24} style={{ marginBottom: 24 }}>
                        <EditorHTML
                            label='Instrucciones'
                            placeholder='Escriba las instrucciones...'
                            textHTML={itemToEdit?.instructions}
                            setValueHTML={setValueHTML}
                            editorState={editorState}
                            setEditorState={setEditorState}
                            wrapperStyle={{
                                backgroundColor: 'transparent'
                            }}
                        />
                    </Col>
                    <Col span={24}
                        className='content-end'
                        style={{ gap: 8 }}
                    >
                        <Button htmlType='button' disabled={loading} onClick={() => onClose()}>Cancelar</Button>
                        <Button htmlType='submit' loading={loading}>
                            {textSave}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalEvaluations
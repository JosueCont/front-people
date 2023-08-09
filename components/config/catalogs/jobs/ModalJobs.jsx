import React, {
    useState,
    useEffect
} from 'react';
import { useSelector } from 'react-redux';
import MyModal from '../../../../common/MyModal';
import { Row, Col, Input, Form, Button, Select } from 'antd';
import { ruleRequired, ruleWhiteSpace } from '../../../../utils/rules';

const ModalJobs = ({
    title = '',
    textSave = 'Guardar',
    visible = false,
    itemToEdit = {},
    close = () => { },
    actionForm = () => { }
}) => {

    const {
        load_cost_center,
        cat_cost_center,
        load_tags,
        cat_tags
    } = useSelector(state => state.catalogStore)
    const {
        profiles,
        load_profiles
    } = useSelector(state => state.assessmentStore)
    const {
        general_config
    } = useSelector(state => state.userStore)
    const [formJob] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (Object.keys(itemToEdit).length <= 0) return;
        let values = { ...itemToEdit };
        values.skill_profile_id = itemToEdit?.skill_profile
            ? itemToEdit?.skill_profile?.id : null;
        formJob.setFieldsValue(values);
    }, [itemToEdit])

    const onFinish = (values) => {
        setLoading(true)
        setTimeout(() => {
            actionForm(values)
            setLoading(false)
            onClose()
        }, 1000)
    }

    const onClose = () => {
        close()
        formJob.resetFields();
    }

    return (
        <MyModal
            title={title}
            visible={visible}
            closable={!loading}
            widthModal={700}
            close={() => onClose()}
        >
            <Form
                layout='vertical'
                onFinish={onFinish}
                form={formJob}
            >
                <Row gutter={[24, 0]}>
                    <Col span={12}>
                        <Form.Item
                            name='name'
                            label='Nombre'
                            rules={[
                                ruleRequired,
                                ruleWhiteSpace
                            ]}
                        >
                            <Input maxLength={100} placeholder='Nombre' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='code'
                            label='Código'
                            rules={[
                                ruleRequired,
                                ruleWhiteSpace
                            ]}
                        >
                            <Input maxLength={100} placeholder='Código' />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Centros de costos'
                            name='cost_center'
                        >
                            <Select
                                allowClear
                                showSearch
                                mode='multiple'
                                maxTagCount='responsive'
                                disabled={load_cost_center}
                                loading={load_cost_center}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {cat_cost_center.length > 0 && cat_cost_center.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.code}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Etiquetas'
                            name='tag'
                        >
                            <Select
                                allowClear
                                showSearch
                                mode='multiple'
                                maxTagCount='responsive'
                                disabled={load_tags}
                                loading={load_tags}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {cat_tags.length > 0 && cat_tags.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {general_config.kuiz_enabled && (
                        <Col span={12}>
                            <Form.Item
                                label='Perfil de competencias'
                                name='skill_profile_id'
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    disabled={load_profiles}
                                    loading={load_profiles}
                                    placeholder='Seleccionar una opción'
                                    notFoundContent='No se encontraron resultados'
                                    optionFilterProp='children'
                                >
                                    {profiles.length > 0 && profiles.map(item => (
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    )}
                    <Col span={24} className='content-end' style={{ gap: 8 }}>
                        <Button
                            htmlType='button'
                            disabled={loading}
                            onClick={() => onClose()}
                        >
                            Cancelar
                        </Button>
                        <Button loading={loading} htmlType='submit'>
                            {textSave}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalJobs
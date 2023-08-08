import React, {
    useState,
    useEffect
} from 'react';
import { useSelector } from 'react-redux';
import MyModal from '../../../../common/MyModal';
import { Row, Col, Input, Form, Button, Select } from 'antd';
import { ruleRequired, ruleWhiteSpace } from '../../../../utils/rules';

const ModalGroup = ({
    title = '',
    textSave = 'Guardar',
    visible = false,
    itemToEdit = {},
    close = () =>{},
    actionForm = ()=>{}
}) => {

    const {
        fixed_concept,
        load_fixed_concept
    } = useSelector(state => state.payrollStore)

    const [formGrupo] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <=0) return;
        formGrupo.setFieldsValue({...itemToEdit});
    },[itemToEdit])

    const onFinish = (values) =>{
        setLoading(true)
        setTimeout(()=>{
            actionForm(values)
            setLoading(false)
            onClose()
        },1000)
    }

    const onClose = () =>{
        close()
        formGrupo.resetFields();
    }

    return (
        <MyModal
            title={title}
            visible={visible}
            widthModal={500}
            closable={!loading}
            close={()=> onClose()}
        >
            <Form
                layout='vertical'
                onFinish={onFinish}
                form={formGrupo}
            >
                <Row>
                    <Col span={24}>
                        <Form.Item
                            name='name'
                            label='Nombre'
                            rules={[
                                ruleRequired,
                                ruleWhiteSpace
                            ]}
                        >
                            <Input placeholder='Nombre'/>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label='Concepto'
                            name='fixed_concept'
                            rules={[ruleRequired]}
                        >
                            <Select
                                allowClear
                                showSearch
                                mode='multiple'
                                maxTagCount='responsive'
                                disabled={load_fixed_concept}
                                loading={load_fixed_concept}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {fixed_concept.length > 0 && fixed_concept.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24} className='content-end' style={{gap: 8}}>
                        <Button
                            htmlType='button'
                            disabled={loading}
                            onClick={()=> onClose()}
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

export default ModalGroup
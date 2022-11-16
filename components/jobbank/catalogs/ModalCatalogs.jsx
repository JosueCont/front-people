import React, { useState, useEffect } from 'react';
import MyModal from '../../../common/MyModal';
import { useSelector } from 'react-redux';
import {
    Form,
    Row,
    Col,
    Button,
    Tabs,
    message,
    Spin,
    Input,
    Select
} from 'antd';
import {
    ruleRequired,
    ruleWhiteSpace
} from '../../../utils/rules';

const ModalCatalogs = ({
    actionForm = ()=> {}, //function
    title = '', //string
    visible = false, //boolean
    close = ()=> {}, //function
    itemToEdit = {}, //object
    textSave = 'Guardar'//string
}) => {

    const [formCatalog] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const {
        list_main_categories,
        load_main_categories
    } = useSelector(state => state.jobBankStore);

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        formCatalog.setFieldsValue(itemToEdit);
    },[itemToEdit])

    const onCloseModal = ()=>{
        close()
        formCatalog.resetFields();
    }

    const onFinish = (values) =>{
        setLoading(true)
        setTimeout(() => {
            onCloseModal();
            setLoading(false)
            actionForm(values)
        }, 2000);
    }

    return (
        <MyModal
            title={title}
            widthModal={500}
            close={onCloseModal}
            visible={visible}
            closable={!loading}
        >
            <Form
                form={formCatalog}
                onFinish={onFinish}
                layout='vertical'
            >
                <Row gutter={[0,16]}>
                    <Col span={24}>
                        <Form.Item
                            name='name'
                            label='Nombre'
                            rules={[ruleRequired, ruleWhiteSpace]}
                        >
                            <Input placeholder='Nombre' maxLength={100}/>
                        </Form.Item>
                        {/* <Form.Item
                            name='category'
                            label='Categoría'
                            rules={[ruleRequired]}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una categoría'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                                disabled={load_main_categories}
                                loading={load_main_categories}
                            >
                                {list_main_categories?.length > 0 && list_main_categories.map(item => (
                                    <Select.Option value={item.id} key={item.name}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item> */}
                    </Col>
                    <Col span={24} style={{display: 'flex', justifyContent: 'flex-end', gap: 8}}>
                        <Button disabled={loading} onClick={()=> onCloseModal()}>Cancelar</Button>
                        <Button htmlType='submit' loading={loading}>
                            {textSave}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalCatalogs
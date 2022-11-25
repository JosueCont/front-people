import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Select, Input, Button, DatePicker } from 'antd';
import { ruleRequired, ruleWhiteSpace } from '../../../utils/rules';
import { useSelector } from 'react-redux';
import MyModal from '../../../common/MyModal';
import moment from 'moment';

const ModalPositions = ({
    title = '',
    close = () =>{},
    itemToEdit = {},
    visible = false,
    textSave = '',
    actionForm = () =>{}
}) => {

    const {
        list_sectors,
        load_sectors
    } = useSelector(state => state.jobBankStore);
    const [formPosition] = Form.useForm();
    const [loading, setLoading] = useState();

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        if(itemToEdit.end_date) itemToEdit.end_date = moment(itemToEdit.end_date);
        if(itemToEdit.start_date) itemToEdit.start_date = moment(itemToEdit.start_date);
        formPosition.setFieldsValue(itemToEdit);
    },[itemToEdit])

    const onCloseModal = () =>{
        close();
        formPosition.resetFields();
    }

    const onFinish = (values) =>{
        if(values.end_date) values.end_date = values.end_date.format('YYYY-MM-DD');
        if(values.start_date) values.start_date = values.start_date.format('YYYY-MM-DD');
        setLoading(true)
        setTimeout(()=>{
            setLoading(false)
            actionForm(values)
            onCloseModal()
        },2000)
    }

    return (
        <MyModal
            title={title}
            visible={visible}
            widthModal={800}
            close={onCloseModal}
            closable={!loading}
        >
            <Form
                form={formPosition}
                layout='vertical'
                onFinish={onFinish}
            >
                <Row gutter={[24,0]}>
                    <Col span={12}>
                        <Form.Item
                            name='position_name'
                            label='Título de la posición'
                            rules={[ruleRequired, ruleWhiteSpace]}
                        >
                            <Input maxLength={200} placeholder='Título de la posición'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='company'
                            label='Empresa'
                            rules={[ruleRequired, ruleWhiteSpace]}
                        >
                            <Input maxLength={200} placeholder='Empresa'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='start_date'
                            label='Fecha de inicio'
                            rules={[ruleRequired]}
                        >
                            <DatePicker
                                style={{width: '100%'}}
                                placeholder='Seleccionar una fecha'
                                format='DD-MM-YYYY'
                                inputReadOnly
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='end_date'
                            label='Fecha de finalización'
                        >
                            <DatePicker
                                style={{width: '100%'}}
                                placeholder='Seleccionar una fecha'
                                format='DD-MM-YYYY'
                                inputReadOnly
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='sector'
                            label='Sector'
                        >
                            <Select
                                disabled={load_sectors}
                                loading={load_sectors}
                                placeholder='Sector'
                                notFoundContent='No se encontraron resultados'
                            >
                                {list_sectors.length > 0 && list_sectors.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
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

export default ModalPositions
import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
    const startDate = Form.useWatch('start_date', formPosition);

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        let values = {...itemToEdit};
        values.end_date = itemToEdit.end_date ? moment(itemToEdit.end_date) : null;
        values.start_date = itemToEdit.start_date ? moment(itemToEdit.start_date) : null;
        values.sector = itemToEdit.sector?.id ?? null;
        formPosition.setFieldsValue(values);
    },[itemToEdit])

    const onCloseModal = () =>{
        close();
        formPosition.resetFields();
    }

    const setValue = (key, val) => formPosition.setFieldsValue({[key]: val});
    const setEndDate = (val = null) => setValue('end_date', val);

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
    
    const onChangeStart = (value) =>{
        setEndDate();
    }

    const disabledStart = (current) =>{
        return current && current > moment().endOf("day");
    }

    const disabledEnd = (current) =>{
        let valid_start = current < startDate?.startOf("day");
        let valid_end = current > moment().endOf("day");
        return current && (valid_start || valid_end);
    }

    return (
        <MyModal
            title={title}
            visible={visible}
            widthModal={700}
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
                            <Input maxLength={200} placeholder='Nombre la empresa'/>
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
                                disabledDate={disabledStart}
                                format='DD-MM-YYYY'
                                inputReadOnly
                                onChange={onChangeStart}
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
                                disabled={!startDate}
                                placeholder='Seleccionar una fecha'
                                disabledDate={disabledEnd}
                                format='DD-MM-YYYY'
                                inputReadOnly
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name='sector'
                            label='Sector'
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled={load_sectors}
                                loading={load_sectors}
                                placeholder='Seleccionar un sector'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {list_sectors.length > 0 && list_sectors.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name='main_responsibilities'
                            label='Principales responsabilidades'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input.TextArea
                                placeholder='Principales responsabilidades y logros en el puesto'
                                autoSize={{
                                    minRows: 5,
                                    maxRows: 5,
                                }}
                            />
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
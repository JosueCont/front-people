import React, { useState, useEffect, useMemo } from "react";
import MyModal from "../../../../common/MyModal";
import { ruleRequired } from "../../../../utils/rules";
import { Col, Form, Input, Row, Select, DatePicker, Button } from "antd";
import { optionsStatusAsignament } from "../../../../utils/constant";
import moment from "moment";

const ModalCustomer = ({
    title = '',
    close = () =>{},
    visible = false,
    textSave = '',
    actionForm = () =>{},
    clientAssets = [],
    itemToEdit = {},
    fetching = false,
}) => {

    const formatDate = 'DD-MM-YYYY';
    const [formAsignament] = Form.useForm()
    const [loading, setLoading ] = useState(false);

    useEffect(() => {
        if(Object.keys(itemToEdit).length <= 0) return;
        let values = {...itemToEdit};
        values.vacant_assessment = itemToEdit.vacant_assessment?.id;
        values.assignment_timestamp = itemToEdit.assignment_timestamp
            ? moment(itemToEdit.assignment_timestamp) : null;
        values.sent_timestamp = itemToEdit.sent_timestamp
            ? moment(itemToEdit.sent_timestamp) : null;
        values.finished_timestamp = itemToEdit.finished_timestamp
            ? moment(itemToEdit.finished_timestamp) : null;
        formAsignament.setFieldsValue(values)
    },[itemToEdit])   
    
    const onCloseModal = () =>{
        close();
        formAsignament.resetFields();
    }

    const onFinish = (values) =>{
        setLoading(true)
        setTimeout(()=>{
            setLoading(false)
            actionForm(values)
            onCloseModal()
        },1000)
    }

    const isEdit = useMemo(()=> Object.keys(itemToEdit).length > 0, [itemToEdit]);

    return (
        <MyModal
            title={title}
            visible={visible}
            widthModal={700}
            close={onCloseModal}
            closable={!loading}
        >
            <Form
                form={formAsignament}
                layout='vertical'
                onFinish={onFinish}
            >
                <Row gutter={[24,0]}>
                    <Col span={12}>
                        <Form.Item
                            name='vacant_assessment'
                            label='Evaluación cliente'
                            rules={[ruleRequired]}
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled={isEdit}
                                loading={fetching}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {clientAssets?.length > 0 && clientAssets.map((item) => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='user'
                            label='Usuario'
                            rules={[ruleRequired]}
                        >
                            <Input
                                disabled= {isEdit}
                                placeholder='Ingresa un usuario'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='password'
                            label='Contraseña'
                            rules={[ruleRequired]}
                        >
                            <Input.Password 
                                placeholder = 'Ingresa una contraseña'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='status'
                            label='Estatus'
                            rules={[ruleRequired]}
                        >
                            <Select
                                showSearch
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                                placeholder="Seleccionar una opción"
                            >
                                {optionsStatusAsignament.map(item => (
                                    <Select.Option disabled={itemToEdit?.status > item.value} value={item.value} key={item.key}>
                                        {item.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='assignment_timestamp'
                            label='Fecha de asignación'
                            rules={[ruleRequired]}
                        >
                            <DatePicker
                                style={{width: '100%'}}
                                placeholder="Selecciona una fecha"
                                format={formatDate}
                            />
                        </Form.Item>
                    </Col>
                    {isEdit && itemToEdit?.assignment_timestamp && (
                        <Col span={12}>
                            <Form.Item
                                name='sent_timestamp'
                                label='Fecha de envío'
                                rules={[ruleRequired]}
                            >
                                <DatePicker
                                    style={{width: '100%'}}
                                    placeholder="Seleccionar una fecha"
                                    format={formatDate}
                                />
                            </Form.Item>
                        </Col>
                    )}
                    {isEdit && itemToEdit?.sent_timestamp && (
                        <Col span={12}>
                            <Form.Item
                                name='finished_timestamp'
                                label='Fecha de finalización'
                                rules={[ruleRequired]}
                            >
                                <DatePicker
                                    style={{width: '100%'}}
                                    placeholder="Seleccionar una fecha"
                                    format={formatDate}
                                />
                            </Form.Item>
                        </Col>
                    )}
                    <Col span={24}>
                        <Form.Item
                            label='Información adicional'
                            name='additional_information'
                        >
                            <Input.TextArea
                                placeholder="Escriba un comentario"
                                autoSize={{minRows: 5, maxRows: 5}}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} className='content-end' style={{gap: 8}}>
                        <Button disabled={loading} onClick={()=> onCloseModal()}>Cancelar</Button>
                        <Button htmlType='submit' loading={loading}>{textSave}</Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalCustomer
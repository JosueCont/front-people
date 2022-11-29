import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Select, Input, Button, DatePicker } from 'antd';
import { useSelector } from 'react-redux';
import MyModal from '../../../common/MyModal';
import { optionsLevelAcademic, optionsStatusAcademic } from '../../../utils/constant';
import { ruleRequired, ruleWhiteSpace } from '../../../utils/rules';
import moment from 'moment';

const ModalEducation = ({
    title = '',
    close = () =>{},
    visible,
    actionForm = () =>{},
    itemToEdit = {},
    textSave = ''
}) => {

    const {
        list_specialization_area,
        load_specialization_area
    } = useSelector(state => state.jobBankStore);
    const [formEducation] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        if(itemToEdit.end_date) itemToEdit.end_date = moment(itemToEdit.end_date);
        formEducation.setFieldsValue(itemToEdit);
    },[itemToEdit])

    const onCloseModal = () =>{
        close()
        formEducation.resetFields();
    }

    const onFinish = (values) =>{
        if(values.end_date) values.end_date = values.end_date.format('YYYY-MM-DD');
        setLoading(true);
        setTimeout(()=>{
            setLoading(false)
            onCloseModal()
            actionForm(values)
        },2000)
    }

    return (
        <MyModal
            title={title}
            widthModal={800}
            close={onCloseModal}
            visible={visible}
            closable={!loading}
        >
            <Form
                form={formEducation}
                onFinish={onFinish}
                layout='vertical'
            >
                <Row gutter={[24,0]}>
                    <Col span={12}>
                        <Form.Item
                            name='study_level'
                            label='Escolaridad'
                            rules={[ruleRequired]}
                        >
                            <Select
                                placeholder='Seleccionar una opción'
                                options={optionsLevelAcademic}
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
                                placeholder='Seleccionar una opción'
                                options={optionsStatusAcademic}
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
                            name='institution_name'
                            label='Nombre de la institución'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input maxLength={200} placeholder='Nombre de la institución'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='specialitation_area'
                            label='Área de especialización'
                            rules={[ruleRequired]}
                        >
                            <Select
                                placeholder='Área de especialización'
                                notFoundContent='No se encontraron resultados'
                                disabled={load_specialization_area}
                                loading={load_specialization_area}
                            >
                                {list_specialization_area?.length > 0 && list_specialization_area.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='specialitation_area_other'
                            label='Otra área de especialización'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input maxLength={200} placeholder='Otra área de especialización'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='languajes'
                            label='Idiomas'
                            rules={[ruleRequired, ruleWhiteSpace]}
                        >
                            <Input maxLength={150} placeholder='Idiomas'/>
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

export default ModalEducation
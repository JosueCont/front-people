import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import MyModal from '../../../common/MyModal';
import { Row, Col, Form, Select, Input, Button, DatePicker} from 'antd';
import { optionsLevelAcademic, optionsStatusAcademic } from '../../../utils/constant';
import { ruleRequired, ruleWhiteSpace } from '../../../utils/rules';
import ListLangs from './ListLangs';

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
    const status = Form.useWatch('status', formEducation);

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        if(itemToEdit.end_date) itemToEdit.end_date = moment(itemToEdit.end_date);
        formEducation.setFieldsValue(itemToEdit);
    },[itemToEdit])


    const onCloseModal = () =>{
        close()
        setRuleLanguages(rule_languages)
        setListLangDomain([])
        setCurrentValue([])
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

    const onChangeStatus = (value) =>{
        if(value == 1) formEducation.setFieldsValue({end_date: null});
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
                                allowClear
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
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={optionsStatusAcademic}
                                onChange={onChangeStatus}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='end_date'
                            label='Fecha de finalización'
                            dependencies={['status']}
                            rules={[status == 3 ? ruleRequired : {validator: (_, value) => Promise.resolve()}]}
                        >
                            <DatePicker
                                style={{width: '100%'}}
                                disabled={![2,3].includes(status)}
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
                            <Input maxLength={200} placeholder='Escriba el nombre de la institución'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='specialitation_area'
                            label='Área de especialización'
                            rules={[ruleRequired]}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                disabled={load_specialization_area}
                                loading={load_specialization_area}
                                optionFilterProp='children'
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
                            <Input maxLength={200} placeholder='Especifica la especialización'/>
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
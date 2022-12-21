import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import MyModal from '../../../common/MyModal';
import { Row, Col, Form, Select, Input, Button, DatePicker, Checkbox} from 'antd';
import { optionsLevelAcademic, optionsStatusAcademic } from '../../../utils/constant';
import { ruleRequired, ruleWhiteSpace } from '../../../utils/rules';

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
        load_specialization_area,
        list_specialization_sub_area,
        load_specialization_sub_area
    } = useSelector(state => state.jobBankStore);
    const [formEducation] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const status = Form.useWatch('status', formEducation);
    const currentArea = Form.useWatch('specialitation_area', formEducation);
    const otherArea = Form.useWatch('other_area', formEducation);
    const otherSubArea = Form.useWatch('other_sub_area', formEducation);

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        if(itemToEdit.end_date) itemToEdit.end_date = moment(itemToEdit.end_date);
        let other_area = itemToEdit.specialitation_area
            ? false : itemToEdit.specialitation_area_other
            ? true: false;
        let other_sub_area = itemToEdit.specialitation_sub_area
            ? false : itemToEdit.specialitation_sub_area_other
            ? true : false;
        formEducation.setFieldsValue({...itemToEdit, other_area, other_sub_area});
    },[itemToEdit])


    const onCloseModal = () =>{
        close()
        formEducation.resetFields();
    }

    const setValue = (key, val) => formEducation.setFieldsValue({[key]: val});
    const setEndDate = (val = null) => setValue('end_date', val);
    const setArea = (val = null) => setValue('specialitation_area', val);
    const setOtherArea = (val = null) => setValue('specialitation_area_other', val);
    const setSubArea = (val = null) => setValue('specialitation_sub_area', val);
    const setOtherSubArea = (val = null) => setValue('specialitation_sub_area_other', val);

    const onFinish = (values) =>{
        // if(values.end_date) values.end_date = values.end_date.format('YYYY-MM-DD');
        // if(values.other_area) values.specialitation_area = null;
        // else values.specialitation_area_other = null;
        // if(values.other_sub_area) values.specialitation_sub_area = null;
        // else values.specialitation_sub_area_other = null;
        setLoading(true);
        setTimeout(()=>{
            setLoading(false)
            onCloseModal()
            actionForm(values)
        },2000)
    }

    const onChangeStatus = (value) =>{
        if(value == 1) setEndDate();
    }

    const onChangeArea = (value) =>{
        setSubArea();
    }

    const onChangeOtherArea = ({target : { checked }}) =>{
        if(checked) setArea();
        else setOtherArea();
        setSubArea();
    }

    const onChangeOtherSubArea = ({target : { checked }}) =>{
        if(checked) setSubArea();
        else setOtherSubArea();
    }

    const disabledDate = (current) => {
        return current && current > moment().endOf("day");
    };

    const optionsByArea = useMemo(() =>{
        if(!currentArea) return [];
        const options = item => item.area == currentArea;
        return list_specialization_sub_area.filter(options);
    }, [currentArea])

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
                initialValues={{other_area: false}}
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
                                disabledDate={disabledDate}
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
                            dependencies={['other_area']}
                            rules={[otherArea ? {validator: (_, value) => Promise.resolve()} : ruleRequired]}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar un área'
                                notFoundContent='No se encontraron resultados'
                                disabled={otherArea}
                                loading={load_specialization_area}
                                optionFilterProp='children'
                                onChange={onChangeArea}
                            >
                                {list_specialization_area?.length > 0 && list_specialization_area.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12} className='turn_rotative_content'>
                        <div className='turn_rotative'>
                            <label className={`${otherArea ? "custom-required": ""}`}>
                                ¿Otra área de especialización?
                            </label>
                            <Form.Item
                                name='other_area'
                                valuePropName='checked'
                                style={{marginBottom: 0}}
                            >
                                <Checkbox onChange={onChangeOtherArea}/>
                            </Form.Item>
                        </div>
                        <Form.Item
                            name='specialitation_area_other'
                            dependencies={['other_area']}
                            rules={[
                                ruleWhiteSpace,
                                otherArea ? ruleRequired : {validator: (_, value) => Promise.resolve()}
                            ]}
                        >
                             <Input
                                disabled={!otherArea}
                                maxLength={200}
                                placeholder='Especifica el área'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='specialitation_sub_area'
                            label='Subárea de especialización'
                            // dependencies={['other_area','other_sub_area']}
                            // rules={[ otherArea || otherSubArea ? {validator: (_, value) => Promise.resolve()} : ruleRequired]}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una subárea'
                                notFoundContent='No se encontraron resultados'
                                disabled={otherSubArea || optionsByArea.length <= 0}
                                loading={load_specialization_sub_area}
                                optionFilterProp='children'
                            >
                                {optionsByArea.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12} className='turn_rotative_content'>
                        <div className='turn_rotative'>
                            <label className={`${otherSubArea ? "custom-required": ""}`}>
                                ¿Otra subárea de especialización?
                            </label>
                            <Form.Item
                                name='other_sub_area'
                                valuePropName='checked'
                                style={{marginBottom: 0}}
                            >
                                <Checkbox onChange={onChangeOtherSubArea}/>
                            </Form.Item>
                        </div>
                        <Form.Item
                            name='specialitation_sub_area_other'
                            dependencies={['other_sub_area']}
                            rules={[
                                ruleWhiteSpace,
                                otherSubArea ? ruleRequired : {validator: (_, value) => Promise.resolve()}
                            ]}
                        >
                             <Input
                                disabled={!otherSubArea}
                                maxLength={200}
                                placeholder='Especifica la subárea'
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

export default ModalEducation
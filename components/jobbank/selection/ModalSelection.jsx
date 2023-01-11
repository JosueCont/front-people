import React, { useState, useEffect } from 'react';
import MyModal from '../../../common/MyModal';
import {
    Row,
    Col,
    Select,
    Form,
    Button,
    Tabs,
    DatePicker,
    TimePicker,
    Input
} from 'antd';
import { useSelector } from 'react-redux';
import { optionsStatusSelection } from '../../../utils/constant';
import { ruleRequired } from '../../../utils/rules'; 

const ModalSelection = ({
    title = '',
    actionForm = () =>{},
    visible = false,
    close = () =>{},
    itemToEdit = {},
    textSave = 'Guardar'
}) => {

    const {
        list_vacancies_options,
        load_vacancies_options,
        load_candidates_options,
        list_candidates_options
    } = useSelector(state => state.jobBankStore);
    const [formSelection] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const status = Form.useWatch('status_one', formSelection);
    const candidate = Form.useWatch('candidate', formSelection);

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        formSelection.setFieldsValue({
            status: itemToEdit.status ?? null,
            candidate: itemToEdit.candidate?.id ?? null,
            vacant: itemToEdit.vacant?.id ?? null,
        })
    },[itemToEdit])

    useEffect(()=>{
        if(list_candidates_options?.length <=0) return;
        valuesByCandidate();
    },[candidate, list_candidates_options])

    const onFinish = (values) =>{
        if(values.date) values.date = values.date.format('YYYY-MM-DD');
        if(values.time) values.time = values.time.format('HH:mm:ss');
        setLoading(true);
        setTimeout(()=>{
            setLoading(false)
            actionForm(values)
            onClose()
        },2000)
    }

    const onClose = () =>{
        close()
        formSelection.resetFields();
    }

    const onChangeStatus = (value) =>{
        formSelection.setFieldsValue({
            date: null,
            time: null
        });
    }

    const resetValues = (email = null, phone = null) =>{
        formSelection.setFieldsValue({
            email,
            phone,
        });
    }

    const valuesByCandidate = () =>{
        if(!candidate){
            resetValues();
            return;
        }
        const find_ = item => item.id == candidate;
        let result = list_candidates_options.find(find_);
        if(!result){
            resetValues();
            return;
        }
        resetValues(result?.email, result?.cell_phone)
    }

    return (
        <MyModal
            title={title}
            visible={visible}
            close={onClose}
            closable={!loading}
            widthModal={800}
        >
            <Row gutter={[0,16]}>
                <Col span={24}>
                    <Form
                        form={formSelection}
                        layout='vertical'
                        onFinish={onFinish}
                        className='tabs-disabled'
                        id='form-selection'
                    >
                        <Tabs type='card'>
                            <Tabs.TabPane tab='General' key='1'>
                                <Row gutter={[16,16]} style={{padding: 12}}>
                                    <Col span={12}>
                                        <Form.Item
                                            name='candidate'
                                            label='Candidato'
                                            rules={[ruleRequired]}
                                            style={{margin:0}}
                                        >
                                            <Select
                                                allowClear
                                                showSearch
                                                placeholder='Seleccionar una opción'
                                                notFoundContent='No se encontraron resultados'
                                                disabled={load_candidates_options}
                                                loading={load_candidates_options}
                                                optionFilterProp='children'
                                            >
                                                {list_candidates_options?.length > 0 && list_candidates_options.map(item => (
                                                    <Select.Option value={item.id} key={item.id}>
                                                        {item.fisrt_name} {item.last_name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name='email'
                                            label='Correo'
                                            style={{margin:0}}
                                        >
                                            <Input disabled placeholder='Correo'/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name='phone'
                                            label='Teléfono'
                                            style={{margin:0}}
                                        >
                                            <Input disabled placeholder='Teléfono'/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name='vacant'
                                            label='Vacante'
                                            rules={[ruleRequired]}
                                            style={{margin:0}}
                                        >
                                            <Select
                                                allowClear
                                                showSearch
                                                placeholder='Seleccionar una opción'
                                                notFoundContent='No se encontraron resultados'
                                                disabled={load_vacancies_options}
                                                loading={load_vacancies_options}
                                                optionFilterProp='children'
                                            >
                                                {list_vacancies_options?.length > 0 && list_vacancies_options.map(item => (
                                                    <Select.Option value={item.id} key={item.id}>
                                                        {item.job_position}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label='Estatus'
                                            name='status_one'
                                            rules={[ruleRequired]}
                                            style={{margin:0}}
                                        >
                                            <Select
                                                allowClear
                                                showSearch
                                                placeholder='Seleccionar una opción'
                                                options={optionsStatusSelection}
                                                optionFilterProp='label'
                                            />
                                        </Form.Item>
                                    </Col>
                                    {/* <Col span={24} className='content-end' style={{gap: 8}}>
                                        <Button disabled={loading} onClick={()=> onClose()}>Cancelar</Button>
                                        <Button htmlType='submit' loading={loading}>
                                            {textSave}
                                        </Button>
                                    </Col> */}
                                </Row>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab='Agendar evento'
                                disabled={!(status == 2)}
                                forceRender
                                key='2'
                            >
                                <Row gutter={[16,16]} style={{padding: 12}}>
                                    <Col span={12}>
                                        <Form.Item
                                            name='place'
                                            label='Lugar'
                                            style={{margin:0}}
                                        >
                                            <Input placeholder='Lugar'/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name='date'
                                            label='Fecha'
                                            dependencies={['status_one']}
                                            rules={[status == 2 ? ruleRequired : {}]}
                                            style={{margin:0}}
                                        >
                                            <DatePicker
                                                inputReadOnly
                                                placeholder='Seleccionar una fecha'
                                                format='DD-MM-YYYY'
                                                style={{width: '100%'}}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name='time'
                                            label='Hora'
                                            dependencies={['status_one']}
                                            rules={[status == 2 ? ruleRequired : {}]}
                                            style={{margin:0}}
                                        >
                                            <TimePicker
                                                inputReadOnly
                                                placeholder='Seleccionar una hora'
                                                format='hh:mm a'
                                                style={{width: '100%'}}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label='Estatus'
                                            name='status_ttwo'
                                            dependencies={['status_one']}
                                            rules={[status == 2 ? ruleRequired : {}]}
                                            style={{margin:0}}
                                        >
                                            <Select
                                                allowClear
                                                showSearch
                                                placeholder='Seleccionar una opción'
                                                notFoundContent='No se encontraron resultados'
                                                options={[]}
                                                optionFilterProp='label'
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Tabs.TabPane>
                        </Tabs>
                    </Form>
                </Col>
                <Col span={24} className='content-end' style={{gap:8}}>
                    <Button onClick={()=> onClose()}>Cancelar</Button>
                    <Button form='form-selection' htmlType='submit' loading={loading}>{textSave}</Button>
                </Col>
            </Row>
        </MyModal>
    )
}

export default ModalSelection
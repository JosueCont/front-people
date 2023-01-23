import React, { useEffect, useState, useMemo } from 'react';
import {
    Row,
    Col,
    Select,
    Form,
    Button,
    Tabs,
    DatePicker,
    TimePicker,
    Input,
    Space,
    Drawer
} from 'antd';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { ruleEmail, ruleRequired, ruleURL, ruleWhiteSpace } from '../../../utils/rules';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import SelectDropdown from './SelectDropdown';

import { convertToRaw, EditorState, Modifierv, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import moment from 'moment';
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor),{ ssr: false })

const EventForm = ({
    visible = false,
    itemToEdit = {},
    close = ()=>{},
    actionForm = ()=>{}
}) => {

    const {
        load_clients_options,
        load_profiles_types,
        list_profiles_types,
        list_clients_options,
        list_vacancies_fields,
        load_vacancies_options,
        list_vacancies_options,
        load_candidates_options,
        list_candidates_options
    } = useSelector(state => state.jobBankStore);
    const [formEvent] = Form.useForm();
    const [msgHTML, setMsgHTML] = useState("<p></p>");
    const [loading, setLoading] = useState(false);
    const [attendees, setAttendees] = useState([]);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const startDate = Form.useWatch('start_date', formEvent);

    const isEdit = useMemo(()=>{
        return Object.keys(itemToEdit).length > 0;
    },[itemToEdit])

    const onChangeEditor = (value) =>{
        let current = value.getCurrentContent();
        let msg = draftToHtml(convertToRaw(current));
        setMsgHTML(msg)
        setEditorState(value)
    }

    const onFinish = (values) =>{
        let guests = attendees.map(item => ({email:item}));
        values.attendees_list = guests;
        values.description = msgHTML;
        // setLoading(false)
        // setTimeout(()=>{
            // setLoading(false)
            // actionForm(values)
            // close()
        // },2000)
    }

    const disabledEnd = (current) =>{
        let valid_start = current < startDate?.startOf("day");
        let valid_end = current > startDate?.endOf("day");
        return current && (valid_start || valid_end);
    }

    const ruleStart = () =>({
        validator(_, value){
            if(!value) return Promise.reject('Este campo es requerido');
        }
    })

    const getTime = (m) =>{
        return  m.minutes() + m.hours() * 60;
    }

    const ruleEnd = ({getFieldValue}) => ({
        validator(_, value){
            let start = getFieldValue('start_date');
            if(start && !value) return Promise.reject('Este campo es requerido');
            if(!value) return Promise.reject('Este campo es requerido');
            // let validation = getTime(value) < getTime(start);
            // if(validation) return Promise.reject(`Hora mayor o igual a ${start.format('hh:mm a')}`);
            return Promise.resolve();
        }
    })

    return (
        <Drawer
            title={isEdit ? 'Actualizar evento' : 'Agregar evento'}
            width={600}
            visible={visible}
            placement='right'
            maskClosable={false}
            keyboard={false}
            onClose={()=> close()}
            extra={
                <Space>
                    <Button onClick={()=> close()}>Cancelar</Button>
                    <Button form='form-event' htmlType='submit'>
                        {isEdit ? 'Actualizar' : 'Guardar'}
                    </Button>
                </Space>
            }
        >
            <Form
                form={formEvent}
                layout='vertical'
                onFinish={onFinish}
                id='form-event'
            >
                <Row gutter={[24,0]}>
                    <Col span={12}>
                        <Form.Item
                            name='name_event'
                            label='Nombre del evento'
                            rules={[ruleRequired, ruleWhiteSpace]}
                        >
                            <Input
                                allowClear
                                maxLength={50}
                                placeholder='Nombre del evento'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='process'
                            label='Proceso de selección'
                            // rules={[ruleRequired]}
                        >
                            <Select
                                allowClear
                                showSearch
                                className='select-jb'
                                disabled={load_clients_options}
                                loading={load_clients_options}
                                placeholder='Seleccionar un cliente'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {list_clients_options.length > 0 && list_clients_options.map(item => (
                                    <Select.Option value={item.email} key={item.email}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='client'
                            label='Cliente'
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled
                                className='select-jb'
                                loading={load_clients_options}
                                placeholder='Seleccionar un cliente'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {list_clients_options.length > 0 && list_clients_options.map(item => (
                                    <Select.Option value={item.email} key={item.email}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='vacant'
                            label='Vacante'
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled
                                className='select-jb'
                                loading={load_vacancies_options}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {list_vacancies_options.length > 0 && list_vacancies_options.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.job_position}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='candidate'
                            label='Candidato'
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled
                                className='select-jb'
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
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
                            label='Fecha'
                            name='date'
                            rules={[ruleRequired]}
                        >
                            <DatePicker
                                placeholder='Seleccionar una fecha'
                                format='DD-MM-YYYY'
                                inputReadOnly
                                className='picker-jb'
                                style={{width:'100%'}}
                                dropdownClassName='drop-picker-jb'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Horario'
                            name='hour'
                            required
                            // dependencies={['start_date']}
                            // rules={[ruleEnd]}
                        >
                            <TimePicker.RangePicker
                                className='picker-jb'
                                popupClassName='drop-time-picker-jb'
                                use12Hours={true}
                                format='hh:mm a'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} >
                        <Form.Item label='Invitados'>
                            <SelectDropdown
                                items={attendees}
                                setItems={setAttendees}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <label style={{display: 'block', padding: '0px 0px 8px'}}>Descripción</label>
                        <Editor
                            editorState={editorState}
                            onEditorStateChange={onChangeEditor}
                            toolbar={{options: ['inline','textAlign']}}
                            placeholder='Escriba una descripción...'
                            editorStyle={{padding: '0px 12px'}}
                            wrapperStyle={{background: '#f0f0f0'}}
                            toolbarStyle={{
                                background: '#f0f0f0',
                                borderBottom: '1px solid rgba(0,0,0,0.06)'
                            }}
                        />
                    </Col>
                </Row>
            </Form>
        </Drawer>
    )
}

export default EventForm
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
    Space
} from 'antd';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { EventDrawer } from './StyledInterview';
import locale from 'antd/lib/date-picker/locale/es_ES';
import { ruleRequired } from '../../../utils/rules';
import { CloseOutlined } from '@ant-design/icons';

import { convertToRaw, EditorState, Modifierv, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor),{ ssr: false })

const EventForm = ({
    visible = false,
    itemToDetail = {}
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
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const isEdit = useMemo(()=>{
        return Object.keys(itemToDetail).length > 0;
    },[itemToDetail])

    const onChangeEditor = (value) =>{
        let current = value.getCurrentContent();
        let msg = draftToHtml(convertToRaw(current));
        setMsgHTML(msg)
        setEditorState(value)
    }

    return (
        <EventDrawer
            title={isEdit ? 'Actualiar evento' : 'Agregar evento'}
            width={600}
            visible={visible}
            placement='right'
            maskClosable={false}
            keyboard={false}
            extra={
                <Space>
                    <Button>Cancelar</Button>
                    <Button type="primary">
                        {isEdit ? 'Actualizar' : 'Guardar'}
                    </Button>
                </Space>
              }
        >
            <Form
                form={formEvent}
                layout='vertical'
                // onFinish={onFinish}
            >
                <Row gutter={[24,0]}>
                    <Col span={12}>
                        <Form.Item
                            name='process'
                            label='Proceso de selección'
                            rules={[ruleRequired]}
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
                            name='date'
                            label='Fecha'
                            rules={[ruleRequired]}
                        >
                            <DatePicker
                                style={{width: '100%'}}
                                placeholder='Seleccionar una fecha'
                                format='DD-MM-YYYY'
                                inputReadOnly
                                className='picker-jb'
                                dropdownClassName='drop-picker-jb'
                                locale={locale}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='hour'
                            label='Hora'
                            rules={[ruleRequired]}
                        >
                            <TimePicker
                                inputReadOnly
                                className='picker-jb'
                                popupClassName='drop-picker-jb'
                                placeholder='Seleccionar una hora'
                                format='hh:mm a'
                                style={{width: '100%'}}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} style={{marginBottom: 24}}>
                        <label style={{display: 'block', padding: '0px 0px 8px'}}>Invitados</label>
                        <div className='content-list-items'>
                            <div className='body-list-items scroll-bar'>
                                <div className='item-list-row normal'>
                                    <p>uncorreo@gmail.com</p>
                                    <CloseOutlined/>
                                </div>
                            </div>
                        </div>
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
        </EventDrawer>
    )
}

export default EventForm
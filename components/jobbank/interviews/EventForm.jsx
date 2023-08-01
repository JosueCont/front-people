import React, { useEffect, useState, useMemo } from 'react';
import {
    Row,
    Col,
    Select,
    Form,
    Button,
    DatePicker,
    TimePicker,
    Input,
    Space,
    Drawer
} from 'antd';
import { CloseOutlined } from "@ant-design/icons";
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { ruleRequired, ruleWhiteSpace } from '../../../utils/rules';
import SelectDropdown from './SelectDropdown';
import moment from 'moment-timezone';
import { valueToFilter } from '../../../utils/functions';

import { convertToRaw, EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor),{ ssr: false });

const EventForm = ({
    visible = false,
    itemToEdit = {},
    close = ()=>{},
    actionForm = ()=>{}
}) => {

    const {
        load_clients_options,
        list_clients_options,
        list_selection_options,
        load_selection_options
    } = useSelector(state => state.jobBankStore);
    const noValid = [undefined,null,''];
    const [formEvent] = Form.useForm();
    const [msgHTML, setMsgHTML] = useState("<p></p>");
    const [loading, setLoading] = useState(false);
    const [attendees, setAttendees] = useState([]);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [emailCandidate, setEmailCandidate] = useState([]);
    const [emailRecruiter, setEmailRecruiter] = useState("");
    const process = Form.useWatch('process', formEvent);
    const formatDate = 'DD-MM-YYYY';
    const formatTime = 'hh:mm a';
    const formatTz = `${formatDate} ${formatTime}`;
    const conferentData ={
        "createRequest": {
            "requestId": "demobolsa",
            "conferenceSolutionKey": {
                "type": "hangoutsMeet"
            }
        }
    };

    useEffect(()=>{
        if(Object.keys(itemToEdit).length <= 0) return;
        setValuesForm();
    },[itemToEdit])

    useEffect(()=>{
        getClientByProcess()
    },[process])

    const isEdit = useMemo(()=>{
        return Object.keys(itemToEdit).length > 0;
    },[itemToEdit])

    const setValuesForm = () =>{
        formEvent.resetFields();
        let candidate = itemToEdit.process_selection?.candidate;
        let candidateEmail = candidate ? [candidate.email] : [];
        let convert = convertFromHTML(itemToEdit.description);
        let htmlMsg = ContentState.createFromBlockArray(convert);
        let template = EditorState.createWithContent(htmlMsg);
        let values = {name_event: itemToEdit.name_event};
        values.process = itemToEdit.process;
        values.date = moment(itemToEdit.start);
        values.hour = [moment(itemToEdit.start),moment(itemToEdit.end)];

        setEditorState(template);
        formEvent.setFieldsValue(values);
        setMsgHTML(itemToEdit.description);
        // setEmailCandidate(candidateEmail);

        const some_ = (record, item) => valueToFilter(record) == valueToFilter(item.email);
        const filter_ = item => !candidateEmail.some(e => some_(e, item));
        let emails = itemToEdit.attendees_list?.filter(filter_).map(item => item.email);
        setAttendees(emails)
    }

    const resetValues = () =>{
        formEvent.setFieldsValue({client: null});
        setEmailCandidate([])
        setEmailRecruiter("")
    }

    const getClientByProcess = () =>{
        if(!process){
            resetValues()
            return;
        }
        const find_ = item => item.id == process;
        let result = list_selection_options.find(find_);
        if(!result){
            resetValues()
            return;
        }
        let client = result.vacant?.customer?.id ?? null;
        let candidateEmail = result?.candidate ? [result.candidate?.email] : [];
        let recruiterEmail = result.vacant?.recruiter?.email ?? "";
        formEvent.setFieldsValue({client})
        setEmailCandidate(candidateEmail)
        setEmailRecruiter(recruiterEmail)
    }  

    const onChangeEditor = (value) =>{
        let current = value.getCurrentContent();
        let msg = draftToHtml(convertToRaw(current));
        setMsgHTML(msg)
        setEditorState(value)
    }

    const getAttendes = () =>{
        const map_ = item => ({email:item});
        const some_ = item => valueToFilter(item) == valueToFilter(emailRecruiter);
        let list = [...attendees, ...emailCandidate];
        let results = list.some(some_) ? list : [...list, emailRecruiter];
        return results.map(map_);
    }

    const createData = (values) =>{
        let obj = Object.assign({}, values);
        obj.attendees_list = getAttendes();
        obj.description = msgHTML;
        if(obj.date && obj.hour){
            let day = obj.date?.format(formatDate);
            let start = obj.hour[0]?.format(formatTime);
            let end = obj.hour[1]?.format(formatTime);
            obj.start = moment(`${day} ${start}`, formatTz).tz('America/Merida').format();
            obj.end = moment(`${day} ${end}`, formatTz).tz('America/Merida').format();
            delete obj.date;
            delete obj.hour;
        }
        if(obj.client) delete obj.client;
        return obj;
    }

    const onFinish = (values) =>{
        let body = createData(values);
        body.conferentData = conferentData;
        setLoading(true)
        setTimeout(()=>{
            setLoading(false)
            actionForm(body)
            onClose()
        },2000)
    }

    const onClose = () =>{
        formEvent.resetFields()
        setAttendees([])
        setEmailCandidate([])
        setEditorState(EditorState.createEmpty())
        setMsgHTML('<p></p>')
        close()
    }

    const disabledDate = (current) => {
        let date = itemToEdit?.start ? moment(itemToEdit.start) : moment();
        return current && current < date.startOf("day");
    };

    const ruleHour = ({ getFieldValue }) => ({
        validator(_, value){
            if(!value) return Promise.resolve();
            let day = getFieldValue('date');
            let current = day ? moment(day).format(formatDate) : null;
            let isValid = current == value[0].format(formatDate);
            if(isValid && !value[0].isAfter(moment())) return Promise.reject('Hora inicio debe ser mayor a la actual');
            return Promise.resolve();
        }
    })

    return (
        <>
            <Drawer
                title={null}
                width={600}
                visible={visible}
                placement='right'
                maskClosable={false}
                keyboard={false}
                closable={false}
                onClose={()=> onClose()}
            >
                <Form
                    form={formEvent}
                    layout='vertical'
                    onFinish={onFinish}
                    initialValues={{
                        name_event: 'Entrevista con candidato'
                    }}
                >
                    <Row gutter={[24,0]}>
                        <Col span={24}>
                            <div className='header-event-form'>
                                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                                    <CloseOutlined onClick={()=> onClose()}/>
                                    <p>{isEdit ? 'Actualizar evento' : 'Agregar evento'}</p>
                                </div>
                                <Space>
                                    <Button  disabled={loading} onClick={()=> onClose()}>Cancelar</Button>
                                    <Button loading={loading} htmlType='submit'>
                                        {isEdit ? 'Actualizar' : 'Enviar'}
                                    </Button>
                                </Space>
                            </div>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name='process'
                                label='Proceso de selección'
                                rules={[ruleRequired]}
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    className='select-jb'
                                    disabled={load_selection_options}
                                    loading={load_selection_options}
                                    placeholder='Seleccionar una opción'
                                    notFoundContent='No se encontraron resultados'
                                    optionFilterProp='children'
                                >
                                    {list_selection_options.length > 0 && list_selection_options.map(item => (
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.vacant?.job_position} / {item.candidate?.first_name} {item.candidate?.last_name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name='name_event'
                                label='Nombre del evento'
                                rules={[ruleRequired, ruleWhiteSpace]}
                            >
                                <Input
                                    allowClear
                                    maxLength={50}
                                    placeholder='Escriba un nombre'
                                />
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
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.name}
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
                                    disabledDate={disabledDate}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label='Horario'
                                name='hour'
                                rules={[ruleRequired, ruleHour]}
                                dependencies={['date']}
                            >
                                <TimePicker.RangePicker
                                    className='picker-jb'
                                    popupClassName='drop-time-picker-jb'
                                    placeholder={['Empieza','Termina']}
                                    use12Hours={true}
                                    format='hh:mm a'
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24} >
                            <Form.Item label='Invitados'>
                                <SelectDropdown
                                    newList={attendees}
                                    defaultList={emailCandidate}
                                    setNewList={setAttendees}
                                    setDefaultList={setEmailCandidate}
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
                                editorClassName='scroll-bar'
                                wrapperStyle={{border: '1px solid rgba(0,0,0,0.06)'}}
                                editorStyle={{
                                    padding: '0px 12px',
                                    minHeight: '150px',
                                    maxHeight: '150px',
                                    overflow: 'auto'
                                }}
                                toolbarStyle={{
                                    background: '#f0f0f0',
                                    // borderBottom: '1px solid rgba(0,0,0,0.06)'
                                }}
                            />
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    )
}

export default EventForm
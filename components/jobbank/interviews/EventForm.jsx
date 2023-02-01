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
import { convertToRaw, EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import moment from 'moment-timezone';
import { valueToFilter } from '../../../utils/functions';
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor),{ ssr: false });

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
        list_candidates_options,
        list_selection_options,
        load_selection_options
    } = useSelector(state => state.jobBankStore);
    const [formEvent] = Form.useForm();
    const [msgHTML, setMsgHTML] = useState("<p></p>");
    const [loading, setLoading] = useState(false);
    const [attendees, setAttendees] = useState([]);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [emailsDefault, setEmailsDefault] = useState([]);
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
        let size = Object.keys(itemToEdit).length;
        if(size <= 0) return;
        formEvent.resetFields();
        let values = {name_event: itemToEdit.name_event};
        values.process = itemToEdit.process;
        values.date = moment(itemToEdit.start);
        values.hour = [moment(itemToEdit.start),moment(itemToEdit.end)];
        let convert = convertFromHTML(itemToEdit.description);
        let htmlMsg = ContentState.createFromBlockArray(convert);
        let template = EditorState.createWithContent(htmlMsg);
        setMsgHTML(itemToEdit.description);
        formEvent.setFieldsValue(values);
        setEditorState(template);
        // let recruiter = itemToEdit?.process_selection?.vacant?.strategy?.recruiter;
        let candidate = itemToEdit.process_selection?.candidate?.email;
        let exist = candidate ? [candidate] : [];
        const filter_ = item => !exist.some(record => valueToFilter(record) == valueToFilter(item.email));
        let emails = itemToEdit.attendees_list?.filter(filter_).map(item => item.email);
        setEmailsDefault(exist)
        setAttendees(emails)
    },[itemToEdit])

    useEffect(()=>{
        if(!process){
            formEvent.setFieldsValue({client: null});
            setEmailsDefault([])
            return;
        }
        const find_ = item => item.id == process;
        let result = list_selection_options.find(find_);
        if(!result){
            formEvent.setFieldsValue({client: null});
            setEmailsDefault([])
            return;
        }
        let client = result.vacant?.customer?.id;
        // let recruiter = result?.vacant?.strategy?.recruiter;
        let candidate = result?.candidate?.email;
        let email = candidate ? [candidate] : [];
        formEvent.setFieldsValue({client})
        setEmailsDefault(email)
    },[process])

    const isEdit = useMemo(()=>{
        return Object.keys(itemToEdit).length > 0;
    },[itemToEdit])

    const onChangeEditor = (value) =>{
        let current = value.getCurrentContent();
        let msg = draftToHtml(convertToRaw(current));
        setMsgHTML(msg)
        setEditorState(value)
    }

    const getDefaultEmails = (id) =>{
        const find_ = item => item.id == id;
        let result = list_selection_options.find(find_);
        if(!result) return '';
        let recruiter = result?.vacant?.strategy?.recruiter;
        return recruiter ? recruiter.email : '';
    }

    const getAttendes = (process) =>{
        const map_ = item => ({email:item});
        let default_ = getDefaultEmails(process);
        const some_ = item => valueToFilter(item) == valueToFilter(default_);
        let list = [...attendees, ...emailsDefault];
        return list.some(some_) ? list.map(map_) : [...list, default_].map(map_);
    }

    const createData = (values) =>{
        let obj = Object.assign({}, values);
        obj.attendees_list = getAttendes(values.process);
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
        setEmailsDefault([])
        setEditorState(EditorState.createEmpty())
        setMsgHTML('<p></p>')
        close()
    }

    const disabledDate = (current) => {
        let date = itemToEdit?.start ? moment(itemToEdit.start) : moment();
        return current && current < date.startOf("day");
    };

    return (
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
                                        {item.vacant?.job_position} / {item.candidate?.fisrt_name} {item.candidate?.last_name}
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
                    {/* <Col span={12}>
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
                    </Col> */}
                    {/* <Col span={12}>
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
                                    <Select.Option value={item.email} key={item.email}>
                                        {item.fisrt_name} {item.last_name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col> */}
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
                            rules={[ruleRequired]}
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
                                defaultList={emailsDefault}
                                setNewList={setAttendees}
                                setDefaultList={setEmailsDefault}
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
    )
}

export default EventForm
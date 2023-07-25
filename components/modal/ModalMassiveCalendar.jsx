import React,{ useEffect, useState} from "react";
import {  CalendarOutlined, UserOutlined } from '@ant-design/icons';

import {
    Modal, Form, Row, Select, Typography, Input, Radio,
    List, Checkbox, Avatar, Col, Space, Button, message,
    Spin, Steps, Alert
} from "antd";
import { ruleRequired } from "../../utils/rules";
import WebApiPayroll from "../../api/WebApiPayroll";
import {getFiltersJB} from "../../utils/functions";

const {Text} = Typography

const ModalMassiveCalendar = ({visible,setVisible, calendars}) => {
    const [formCalendar] = Form.useForm();
    const [paymentCalendars, setCalendars] = useState([]);
    const [people, setPeople] = useState([]);
    const [idCalendar,setIdCalendar] = useState('');
    const [filterData,setFilterData] = useState([]);
    const [check, setCheck] = useState([]);
    const [loading,setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [countItemsForPagination, setCountItemsForPagination] = useState(0)

    useEffect(() => {
        getCalendars();
        formCalendar.setFieldsValue({payment_calendar:null,search_person:null, add:1})
        setPeople([])
        setIdCalendar('')
        setCheck([]);
        setCurrentStep(0);
    },[visible])

    const getCalendars = () => {
       let calendar = calendars.map(item => {
            return {value:item.id, label:item.name}
        });
        setCalendars(calendar);
    }

    const formFinish = async(value) => {
        try {
            setLoading(true);
            let sendData = {
                calendar_id: value.payment_calendar,
                people: check
            };
            const addCalendars =  await WebApiPayroll.addMassiveCalendar(sendData);
            if(addCalendars.data.massive_assign.success) {
                setLoading(false);
                message.success(`Se ha realizado exitosamente del calendario a ${addCalendars.data.massive_assign.saved_count} personas `);
                setCheck([]);
                getPeopleCompany(value.payment_calendar,null)
            }else{
                message.error("Ocurrio un problema al hacer las inserciones");
            }
            
        } catch (e) {
            setLoading(false);
            console.log('error',e)
        }finally {
            setLoading(false)
        }
    }


    const onChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
          setCheck(prev => [...prev, value]);
        } else {
          setCheck(prev => prev.filter(x => x !== value));
        }
    }

    const handleValuesChange = (value) => {

        //Significa que se capturó el select de calendarios
        if(value?.payment_calendar){
            formCalendar.setFieldsValue({add:1})
            getPeopleCompany(value.payment_calendar,null);
            setIdCalendar(value.payment_calendar)
            setCurrentStep(1);
            setCheck([])
        }

        // significa que cambió los radios
        if(value?.add){
            filterPeople(value.add)
        }

        //Significa que se capturó el search
        if(value?.search_person){

        }

    }

    const checkAll=()=>{
        let ids = people.map(ele=>ele?.person?.id)
        console.log(ids, people)
        setCheck(ids)
    }

    const getPeopleCompany = async(id,search,page=1,filter_type=1) => {
        try {
            setCurrentPage(page)
            setLoading(true);
            const filterStr = getFiltersJB({page,filter_type})
            const people = await WebApiPayroll.getPeople(id,search,filterStr);
            if(people.data.results.length > 0) setLoading(false)
            setPeople(people.data.results);
            setFilterData(people.data.results)
            setCountItemsForPagination(people.data.count)
        } catch (e) {
            console.log('error',e)
        }finally {
            setLoading(false)
        }
    }

    const filterPeople = (val) => {
        let calendar_id=formCalendar.getFieldValue('payment_calendar');
        let search = formCalendar.getFieldsValue().search_person
        getPeopleCompany(calendar_id,search, 1,val)
       setCheck([])
    };

    const onChangePagination=(page)=>{
        let calendar_id=formCalendar.getFieldValue('payment_calendar');
        let search = formCalendar.getFieldsValue().search_person;
        let filter_type=formCalendar.getFieldsValue().add;
        getPeopleCompany(calendar_id,search, page,filter_type)
    }

    const sendClose = () => {
        formCalendar.submit();
        setTimeout(() => {
            setVisible(false);
        },2000)
    }

    return(
        <Modal
            title='Asignación masiva de calendarios'
            centered
            visible={visible}
            onCancel={setVisible}
            footer={
                <Col >
                  <Space>
                      <Button
                        size="large"
                        htmlType="button"
                        onClick={() => setVisible(false)}
                        style={{ paddingLeft: 30, paddingRight: 30 }}
                      >
                        Cancelar
                      </Button>
                    
                      <Button
                        size="large"
                        htmlType="button"
                        onClick={() => sendClose()}
                        disabled={check.length < 1}
                        style={{ paddingLeft: 30, paddingRight: 30 }}
                      >
                        Guardar
                      </Button>

                      <Button
                        size="large"
                        htmlType="button"
                        onClick={() => formCalendar.submit() }
                        disabled={check.length < 1}
                        style={{ paddingLeft: 30, paddingRight: 30 }}
                      >
                        Guardar y continuar
                      </Button>
                  </Space>
                </Col>
              }
            width={"70%"}>
                <Spin tip="Cargando..." spinning={loading}>
                    <Steps style={{marginBottom:'25px',paddingRight:'50px'}} size="small" current={currentStep}>
                        <Steps.Step title="Seleccionar calendario" icon={<CalendarOutlined />}/>
                        <Steps.Step title="Elegir persona (s)" icon={<UserOutlined/>}/>
                    </Steps>
                            
                <Form 
                    form={formCalendar}
                    onFinish={formFinish}
                    layout={'vertical'}
                    onValuesChange={handleValuesChange}
                    className="inputs_form_responsive">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="payment_calendar"
                                label="Calendario de pago"
                                rules={[ruleRequired]}>
                                <Select options={paymentCalendars}
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        notFoundContent={"No se encontraron resultados."}
                                        allowClear>

                                </Select>
                            </Form.Item>
                            <Alert
                                message={`Para asignar un calendario se debe considerar que las personas deben tener su 
                                información básica de Nómina, si no aparece alguna persona por favor revise su información.`}
                                type="warning"
                                showIcon
                                style={{marginBottom: 16}}
                            />
                            <p>Num de personas encontradas: {countItemsForPagination}</p>
                        </Col>
                        <Col span={12} style={{paddingTop:30,paddingLeft:30}}>
                            <Form.Item name="search_person" style={{width:'100%', alignSelf:'center'}}>
                                {/*<Input placeholder="Buscar" allowClear onChange={onChange} />*/}
                                <Input.Search
                                    placeholder="Buscar"
                                    allowClear={false}
                                    onSearch={() =>getPeopleCompany(idCalendar,formCalendar.getFieldsValue().search_person,1)}
                                    enterButton
                                />
                            </Form.Item>
                            <Form.Item name='add'style={{alignSelf:'center'}}>
                                <Radio.Group >
                                    <Radio value={1}>Todos</Radio>
                                    <Radio value={2}>Nueva Asignación</Radio>
                                    <Radio value={3}>Reasignación</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Button onClick={()=> checkAll()}>Elegir todos</Button>
                            <Button onClick={()=> setCheck([])}>Limpiar selección</Button>

                            {people.length > 0 ? (
                                <>

                                    <List
                                        itemLayout="horizontal"
                                        style={{padding:0,margin:0}}
                                        dataSource={filterData}
                                        pagination={{
                                            onChange: (page) => {
                                                onChangePagination(page)
                                            },
                                            pageSize: 10,
                                            total:countItemsForPagination ?? 0,
                                            current:currentPage
                                        }}
                                        renderItem={(item,index) => (
                                            <List.Item >
                                                <Checkbox
                                                    onChange={onChange}
                                                    checked={ check.find(element => element === item.person.id)}
                                                    value={item.person.id}
                                                    style={{margin:'10px 20px'}}
                                                />
                                                <List.Item.Meta
                                                    title={`${item.person.first_name} ${item.person.flast_name} ${item.person.mlast_name}`}
                                                    />
                                            </List.Item>
                                        )}>

                                    </List>
                                </>) : (
                                <Typography.Text
                                    style={{
                                        display:'flex',
                                        alignSelf:'center',
                                        margin:'0 20px',
                                        color:'gray'}}>
                                    No se encontraron resultados
                                </Typography.Text>
                            )}
                        </Col>
                        <div style={{display:'flex',flex:1, flexDirection:'column'}}>
                            {/*<Typography.Title level={5}>Selecciona un calendario</Typography.Title>*/}


                        </div>
                        <div style={{display:'flex',flex:3,flexDirection:'column'}}>

                        </div>
                    </Row>
                </Form>
                </Spin>
        </Modal>
    )
};

export default ModalMassiveCalendar;
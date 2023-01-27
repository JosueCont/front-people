import React,{ useEffect, useState} from "react";
import {  CalendarOutlined, UserOutlined } from '@ant-design/icons';

import {  
    Modal, Form, Row, Select, Typography, Input, Radio, 
    List, Checkbox, Avatar, Col, Space,Button, message,
    Spin, Steps} from "antd";
import { ruleRequired } from "../../utils/rules";
import WebApiPayroll from "../../api/WebApiPayroll";

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
    const defaulPhoto =
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";

    useEffect(() => {
        getCalendars();
        formCalendar.setFieldsValue({payment_calendar:null,search_person:null, add:null})
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
        if(value.payment_calendar){
            formCalendar.setFieldsValue({add:null})
            getPeopleCompany(value.payment_calendar,null);
            setIdCalendar(value.payment_calendar)
            setCurrentStep(1);
        } 
        //if(value.search_person) getPeopleCompany(idCalendar,value.search_person)
        if(value.add) filterPeople(value.add)
    }

    const getPeopleCompany = async(id,search) => {
        try {
            setLoading(true);
            const people = await WebApiPayroll.getPeople({id,search});
            if(people.data.results.length > 0) setLoading(false)
            setPeople(people.data.results);
            setFilterData(people.data.results)
        } catch (e) {
            console.log('error',e)
        }
    }

    const filterPeople = (val) => {
       let newPeope;
       if(val==1){
            newPeope= people.filter((item) => {
                if(item.payment_calendar?.id == '') return item.person
            });
       }else{
         newPeope =people.filter((item) => {
            if(item.payment_calendar?.id) return item.person
        });
       }
       setCheck([])
       setFilterData(newPeope)
    };

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
                        <Steps.Step title="Elegir persona" icon={<UserOutlined/>}/>
                    </Steps>
                            
                <Form 
                    form={formCalendar}
                    onFinish={formFinish}
                    layout={'vertical'}
                    onValuesChange={handleValuesChange}
                    className="inputs_form_responsive">
                    <Row >
                        <div style={{display:'flex',flex:1, flexDirection:'column'}}>
                            {/*<Typography.Title level={5}>Selecciona un calendario</Typography.Title>*/}
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

                        </div>
                        <div style={{display:'flex',flex:3,flexDirection:'column'}}>
                            <Form.Item name="search_person" style={{width:'300px', alignSelf:'center'}}>
                                {/*<Input placeholder="Buscar" allowClear onChange={onChange} />*/}
                                <Input.Search 
                                    placeholder="Buscar" 
                                    onSearch={() =>getPeopleCompany(idCalendar,formCalendar.getFieldsValue().search_person)} 
                                    enterButton disabled={people.length <=0}
                                />
                            </Form.Item>
                            <Form.Item name='add'style={{alignSelf:'center'}}>
                                <Radio.Group disabled={people.length <=0}>
                                    <Radio value={1}>Nueva Asignación</Radio>
                                    <Radio value={2}>Reasignación</Radio>
                                </Radio.Group>
                            </Form.Item>
                            
                            {people.length > 0 ? (
                                <>

                                <List 
                                    itemLayout="horizontal"
                                    dataSource={filterData}
                                    pagination={{
                                        onChange: (page) => {
                                        },
                                        pageSize: 4,
                                      }}
                                    renderItem={(item,index) => (
                                        <List.Item style={{margin:'0 20px' }}>
                                                <Checkbox 
                                                    onChange={onChange} 
                                                    checked={check[index]==item.person.id}
                                                    value={item.person.id} 
                                                    style={{margin:'10px 20px'}}
                                                />
                                            <List.Item.Meta 
                                                title={`${item.person.first_name} ${item.person.flast_name} ${item.person.mlast_name}`}
                                                avatar={<Avatar src={defaulPhoto}></Avatar>}/> 
                                        </List.Item>
                                    )}>

                                </List> </>) : (
                                    <Typography.Text 
                                        style={{
                                            display:'flex', 
                                            alignSelf:'center',
                                            margin:'0 20px', 
                                            color:'gray'}}>
                                                No se encontraron resultados
                                    </Typography.Text>
                                )}
                        </div>
                    </Row>
                </Form>
                </Spin>
        </Modal>
    )
};

export default ModalMassiveCalendar;
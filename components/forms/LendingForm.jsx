import React, { useState, useEffect } from 'react';
import { Typography, Button, Form, Row, Col, Input, Image, Select, InputNumber, DatePicker } from 'antd';
import moment from "moment";
import { useRouter } from "next/router";
import SelectPerson from '../selects/SelectPerson';
import details from '../../pages/holidays/[id]/details';



const Lendingform = (props) => {
    const [form] = Form.useForm();
    const {Title} = Typography;
    const {TextArea} = Input
    const route = useRouter();

    
    const [payment, setPayment] = useState(null);
    const [amount, setAmount] = useState(null);

    /* Options List */
    const TypeOptions = [
        { value: 'EMP', label: "Empresa", key: "type1" },
        { value: 'EPS', label: "E-Pesos", key: "type_2" }
    ]

    const periodicityOptions = [
        { value: 1, label: "Semanal", key: "p1" },
        { value: 2, label: "Catorcenal", key: "p2" },
        { value: 3, label: "Quincenal", key: "p3" },
        { value: 4, label: "Mensual", key: "p4" },
      ]

    const getPayment = () =>{
        let formAmount = form.getFieldValue('amount');
        let formDeadline = form.getFieldValue('deadline')
        
        formAmount = formAmount ? formAmount : 0;
        formDeadline = formDeadline ? formDeadline : 1;

        let paym = formAmount/formDeadline;

        /* PARA TOMAR EN CUENTA EL INTERES */
        /* let paym = 0; */
        /* if (props.interest === 0){
            paym = formAmount/formDeadline;
        }else{
            console.log("no ")
            console.log(formAmount)
            console.log(props.interest)
            console.log(formDeadline)
            paym = (formAmount*(props.config.interest/100))/formDeadline;
        } */
        console.log(paym)

        setPayment(paym)

        console.log(formAmount)
        console.log(formDeadline)

    }

    useEffect(() =>{
        if(props.details){
            console.log('details', props.details);
            form.setFieldsValue({
                khonnect_id: props.details.person.khonnect_id,
                type: props.details.type,  
                amount: parseInt(props.details.amount),
                deadline: parseInt(props.details.deadline),
                periodicity: props.details.periodicity

            })
            //form.setFieldsValue({ type: props.details.type });
        }
    },[route])

    /*  */
    const onNumberChange = (value, e) => {
        if (Number.isNaN(value)) {
          return;
        }
        setAmount(value);
      };

    return(
    <Form form={form} layout="horizontal" onFinish={props.onFinish} >
        <Row justify={'start'}>
            <Col span={24}>
                <Title key="dats_gnrl" level={4}>
                    Nueva solicitud de préstamo
                </Title>
            </Col>
            <Col span="8">
                {/* <Form.Item label="Colaborador" name="khonnect_id" labelCol={{ span: 10 }} labelAlign={'left'}> */}
                    <SelectPerson khonnect_id  withLabel={true} defaultValue={props.details ? props.details.person.khonnect_id : null} />
                {/* </Form.Item> */}
                <Form.Item name="type" label="Tipo de préstamo" labelCol={{ span: 10 }} labelAlign={'left'}>
                    <Select options={TypeOptions} allowClear />
                </Form.Item>
                <Form.Item  name="amount" label="Cantidad solicitada" labelCol={{ span: 10 }} labelAlign={'left'}
                    /* rules={[
                        {pattern: new RegExp("^[0-9,$]*$"), message:'Solo puedes ingresar numeros' }
                    ]} */
                >
                    {/* <InputNumber onChange={getPayment} min={ props.config ? parseInt(props.config.min_amount) : null } max={ props.config ? parseInt(props.config.max_amount) : null }  style={{ width: '100%' }}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                     /> */}
                     <Input />
                </Form.Item>
                <Form.Item name="deadline" label="Plazos" labelCol={{ span: 10 }} labelAlign={'left'}>
                    {/* <InputNumber defaultValue={'2'} onChange={getPayment} min={ props.config ? parseInt(props.config.min_deadline) : null } max={ props.config ? parseInt(props.config.max_deadline) : null } style={{ width: '100%' }} /> */}
                    <Input />
                </Form.Item>
                <Form.Item name="periodicity" label="Periodicidad" labelCol={{ span: 10 }} labelAlign={'left'}>
                    <Select options={periodicityOptions} />
                </Form.Item>
                <Form.Item  label="Pago" labelCol={{ span: 10 }} labelAlign={'left'}>
                    {/* <InputNumber value={payment}  style={{ width: '100%' }} readOnly /> */}
                    <Input/>
                </Form.Item>
            </Col>
            <Col span={19} style={{ textAlign: 'right' }}>
                <Form.Item label="Motivo" labelCol={{ span: 4 }} labelAlign={'left'}>
                    <TextArea rows="4" style={{ marginLeft: 6 }} />
                </Form.Item>
                <Button onClick={() => route.push("/lending")} type="dashed" key="cancel" style={{ padding: "0 50px",  }} >
                    { props.edit ? 'Regresar' : 'Cancelar' }
                </Button>
                { props.edit ? <Button danger onClick={props.onReject} key="reject" type="primary" style={{ padding: "0 50px", marginLeft: 15 }}>
                    Rechazar
                </Button> : null }
                { props.edit ? <Button onClick={props.onApprove} type="primary" key="aprove" style={{ padding: "0 50px", marginLeft: 15 }} >
                    Aprobar préstamo
                </Button> : null }
                
                <Button  key="save" htmlType="submit"  style={{ padding: "0 50px", marginLeft: 15 }}>
                    { props.edit ? 'Actualizar Datos' : 'Guardar' }
                </Button>
            </Col>
        </Row>
    </Form>
    )

}

export default Lendingform;
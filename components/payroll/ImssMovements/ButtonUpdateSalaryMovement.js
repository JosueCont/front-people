import {connect} from "react-redux";
import {CalendarOutlined} from "@ant-design/icons";
import {Button, Modal, Form, Input, DatePicker, Alert} from "antd";
import {downLoadFileBlob, getDomain} from "../../../utils/functions";
import {API_URL_TENANT} from "../../../config/config";
import {useEffect, useState} from "react";
import { useSelector } from 'react-redux';
import {fourDecimal, onlyNumeric, ruleRequired} from "../../../utils/rules";
import locale from "antd/lib/date-picker/locale/es_ES";
import moment from 'moment'


const ButtonUpdateSalaryMovement=({person, node, payrollPerson,...props})=>{
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [form] = Form.useForm();
    //const regPatronal = useSelector(state => state.catalogStore.cat_patronal_registration);

    const onFinish=(values)=>{
        console.log(values)
    }

    useEffect(()=>{
        if(payrollPerson?.daily_salary){
            form.setFieldsValue({
                amount:payrollPerson?.daily_salary,
                date_updated: moment()
            })
        }
    },[payrollPerson])

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current >= moment().endOf('day');
    };


    return (
        <>
            <Button
                style={{ marginBottom: "10px", marginRight:20 }}
                loading={loading}
                icon={<CalendarOutlined />}
                type="link"
                onClick={()=> setShowModal(true)}
            >
                Programar actualización de salario diario
            </Button>

            <Modal
                title="Programar actualización de salario diario"
                visible={showModal}
                onOk={()=> form.submit()}
                onCancel={()=>setShowModal(false)}
                okText="Aceptar"
                cancelText="Cancelar"
            >
                <Form layout={'vertical'}  form={form} name="control-hooks" onFinish={onFinish}>
                    <Form.Item name="amount" label="Nuevo monto" rules={[
                        ruleRequired,
                        fourDecimal,
                        {
                            message: 'Este monto no puede ser menor al salario actual',
                            validator: (_, value) => {
                                if (value>=payrollPerson?.daily_salary) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject();
                                }
                            }
                        }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="date_updated"
                        label="Fecha de actualización"
                        rules={[ruleRequired]}
                    >
                        <DatePicker
                            disabledDate={disabledDate}
                            locale={ locale }
                            defaultValue={moment()}
                            style={{ width: "100%" }}
                            //onChange={onChangeBDFamily}
                            showNow={true}
                            format={"DD/MM/YYYY"}
                        />
                    </Form.Item>

                </Form>

                <Alert  type="info" description={'Al cambiar el salario se aplicará en la fecha programada,\n' +
                    '                    si requieres enviar este movimiento ante el IMSS puedes consultarlo desde la opción "Movimientos del IMSS",\n' +
                    '                    que se encuentra en el listado de personas'} />




            </Modal>

        </>

    )
}


export default ButtonUpdateSalaryMovement;

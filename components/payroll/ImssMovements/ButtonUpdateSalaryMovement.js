import {connect} from "react-redux";
import {CalendarOutlined} from "@ant-design/icons";
import {Button, Modal, Form, Input, DatePicker, Alert, message, Spin} from "antd";
import {downLoadFileBlob, getDomain} from "../../../utils/functions";
import {API_URL_TENANT} from "../../../config/config";
import {useEffect, useState} from "react";
import { useSelector } from 'react-redux';
import {fourDecimal, onlyNumeric, ruleRequired} from "../../../utils/rules";
import locale from "antd/lib/date-picker/locale/es_ES";
import moment from 'moment'
import WebApiPayroll from "../../../api/WebApiPayroll";


const ButtonUpdateSalaryMovement=({person, node, payrollPerson,onRefresh,...props})=>{
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [form] = Form.useForm();
    const user = useSelector(state => state.userStore.user);

    const onFinish=(values)=>{
        let req = {...values}
        req.modified_by = user.id;
        req.update_date  = moment(values.date_updated).format('YYYY-MM-DD');
        req.payroll_person_id = payrollPerson.id;
        changeSalary(req)
    }

    const changeSalary=async (req)=>{
        setLoading(true)
        console.log('payroll person', payrollPerson)
        try{
            const res = await WebApiPayroll.setSalaryModification(req);
            message.success('Actualizado correctamente')
            setShowModal(false)
            onRefresh()
        }catch (e){
            console.log(e.response)
            if(e?.response?.data?.message){
                message.error(`No se pudo realizar la acción: ${e?.response?.data?.message}`)
            }else{
                message.error('Hubo un error, favor de revisar la información o vuelve a intentarlo mas tarde')
            }

        }finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        if(payrollPerson?.daily_salary){
            form.setFieldsValue({
                new_salary:payrollPerson?.daily_salary,
                date_updated: moment()
            })
        }
    },[payrollPerson])

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current <= moment().endOf('day');
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
                <Spin spinning={loading}>
                <Form layout={'vertical'}  form={form} name="control-hooks" onFinish={onFinish}>
                    <Form.Item name="new_salary" label="Nuevo salario diario" rules={[
                        ruleRequired,
                        fourDecimal,
                        {
                            message: 'Este monto no puede ser menor o igual al salario actual',
                            validator: (_, value) => {
                                if (value!==payrollPerson?.daily_salary && value>=payrollPerson?.daily_salary) {
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
                            defaultValue={moment().add(2,'d')}
                            style={{ width: "100%" }}
                            //onChange={onChangeBDFamily}
                            showNow={true}
                            format={"DD/MM/YYYY"}
                        />
                    </Form.Item>


                </Form>
                </Spin>
                <Alert  type="info" description={'Al cambiar el salario se aplicará en la fecha programada,\n' +
                    '                    si requieres enviar este movimiento ante el IMSS puedes consultarlo desde la opción "Movimientos del IMSS",\n' +
                    '                    que se encuentra en el listado de personas'} />




            </Modal>

        </>

    )
}


export default ButtonUpdateSalaryMovement;

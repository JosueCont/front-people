import React, {useEffect, useState} from "react";
import {Button, Col, ConfigProvider, DatePicker, Form, Input, message, Row, Select, Space} from "antd";
import MyModal from "../../common/MyModal";
import {ruleRequired} from "../../utils/rules";
import {CustomInput} from "../assessment/groups/Styled";
import moment from "moment";
import webApiPeople from "../../api/WebApiPeople";
import esES from "antd/lib/locale/es_ES";
import {trim} from "lodash/string";

const { TextArea } = Input;

const ModalNonWorkingDays = ({node_id, nonWorkingDay, title, visible, onCancel, onSave}) =>{
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const disabledDates = (current) => {
        //return current && current < moment().endOf('day');
    }

    const onFinish = async (values) => {
        setLoading(true)
        let data = {
            node: node_id,
            date: values.date.format('YYYY-MM-DD'),
            description: trim(values.description) || '',
            type: values.type
        }
        if(nonWorkingDay){
            await updateItem(data)
        }else{
            await addItem(data)
        }
    }

    const addItem = async (data) =>{
        try{
            let response = await webApiPeople.createNonWorkingDay(data)
            setLoading(false)
            onSave()
        }catch (e) {
            console.log(e.response)
            if (e.response.status === 400) {
                message.error(e.response.data.message)
            }
           // message.error("No se pudo agregar el día");
            setLoading(false)
        }
    }
    const updateItem = async (data) =>{
        try{
            let response = await webApiPeople.updateNonWorkingDay(nonWorkingDay.id, data)
            setLoading(false)
            onSave()
        }catch (e) {
            if (e.response.status === 400) {
                message.error(e.response.data.message)
            }
            //message.error("No se pudo actualizar el día");
            setLoading(false)
        }
    }

    useEffect(()=>{
        if(nonWorkingDay){
            form.setFieldsValue({
                date: moment(nonWorkingDay.date),
                description: nonWorkingDay.description
            })
        }else{
            form.setFieldsValue({
                date: '',
                description: ''
            })
        }
    },[nonWorkingDay])

    return (
        <MyModal
            title={title}
            visible={visible}
            close={onCancel}
            widthModal={450}
        >
            <ConfigProvider locale={esES}>
                <Form
                    onFinish={onFinish}
                    onFinishFailed={(errorInfo) => {
                        console.log('Failed:', errorInfo);
                    }}
                    form={form}
                    requiredMark={false}
                    layout={"vertical"}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name={"date"}
                                label={"Fecha"}
                                style={{ width: '100%' }}
                                rules={[ruleRequired]}
                            >
                                <DatePicker format={'DD-MM-YYYY'} style={{ width: '100%' }} disabledDate={disabledDates} placeholder={'seleccione una fecha'} />
                            </Form.Item>
                        </Col>
                    </Row>
                        <Row gutter={[25, 16]}>
                        <Col span={24}>
                            <Form.Item
                                name={"description"}
                                label={"Descripción"}
                            >
                                <TextArea rows={4} placeholder="Ingresa una descripción" maxLength={250} allowClear={true} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name={"type"}
                                label={"Tipo"}
                            >
                                <Select 
                                    options={[
                                        {label: 'Festivo', value: 1},
                                        {label: 'Empresa', value: 2},
                                        {label: 'Inhábil bancario', value: 3},
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row align={"end"}>
                        <Space>
                            <Button key="back" onClick={onCancel}>
                                Cancelar
                            </Button>
                            <Button htmlType="submit" loading={loading}>
                                Guardar
                            </Button>
                        </Space>
                    </Row>
                </Form>
            </ConfigProvider>
        </MyModal>
    )
}

export default ModalNonWorkingDays
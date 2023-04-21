import React, {useEffect, useState} from "react";
import {Button, Col, Divider, Form, message, Row, Space, Switch} from "antd";
import {CheckOutlined, CloseOutlined} from "@material-ui/icons";
import moment from "moment/moment";
import webApiPeople from "../../api/WebApiPeople";

const daysOfWeek = [
    {key: 'monday', name: 'Lunes'},
    {key: 'tuesday', name: 'Martes'},
    {key: 'wednesday', name: 'Miércoles'},
    {key: 'thursday', name: 'Jueves'},
    {key: 'friday', name: 'Viernes'},
    {key: 'saturday', name: 'Sábado'},
    {key: 'sunday', name: 'Domingo'},
]
const WorkingDays = ({ node_id = null, ...props }) =>{
    const [form] = Form.useForm()

    const [loading, setLoading] = useState(false)
    const [workingDays, setWorkingDays] = useState(null)
    const getDays = async () =>{
        try{
            setLoading(true)
            let response = await webApiPeople.getWorkingWeekDays(node_id)
            const data = response.data
            setWorkingDays(data.results.length > 0 ? data.results[0] : null)
            setLoading(false)
        }catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const onFinish = async (values) => {
        setLoading(true)
        let data = {
            ...values,
            node: node_id
        }
        if(workingDays){
            await update(data)
        }else{
            await save(data)
        }
    }
    const save = async (data) =>{
        try{
            let response = await webApiPeople.createWorkingWeekDay(data)
            setWorkingDays(response.data)
            setLoading(false)
            message.success('Días laborables guardados.')
        }catch (e) {
            console.log(e)
            message.error("No se pudo guardar los días.");
            setLoading(false)
        }
    }
    const update = async (data) =>{
        try{
            let response = await webApiPeople.updateWorkingWeekDay(workingDays.id, data)
            setLoading(false)
            message.success('Días laborables actualizados.')
        }catch (e) {
            console.log(e)
             message.error("No se pudo actualizar los días.");
            setLoading(false)
        }
    }

    useEffect(()=>{
        let fieldValues = {}
        if(workingDays){
            daysOfWeek.forEach(day => {
                console.log(workingDays, workingDays[day.key])
                fieldValues[day.key] = workingDays[day.key]
            })
            form.setFieldsValue(fieldValues)
        }else{
            daysOfWeek.forEach(day => fieldValues[day.key] = false )
            form.setFieldsValue(fieldValues)
        }
    },[workingDays])


    useEffect(() => {
        if(node_id){
            getDays()
        }
    }, [node_id])

    return <>
        <Divider style={{ marginTop: "2px" }} />
        <Form
            onFinish={onFinish}
            form={form}
        >
            <>{daysOfWeek.map((day, idx) =>
                <div key={day.key}>
                    <div style={{display:'flex', alignItems: 'center'}}>
                        <Space size={'middle'}>
                            <Form.Item name={day.key} valuePropName="checked" style={{margin: 0}}>
                                <Switch
                                    onChange={(value) => {}}
                                />
                            </Form.Item>
                            <div>
                                {day.name}
                            </div>
                        </Space>
                    </div>
                    {idx < daysOfWeek.length -1 && <Divider style={{margin: '10px 0'}}/>}
                </div>
            )}</>

            <Row align={"end"} style={{marginTop: 24}}>
                <Space>
                    <Button htmlType="submit" >
                        Guardar
                    </Button>
                </Space>
            </Row>
        </Form>
    </>
}

export default WorkingDays
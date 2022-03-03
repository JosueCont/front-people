import React, { useState, useEffect } from "react";
import {
    Form,
    Input,
    Button,
    Modal,
} from "antd";
import { ruleRequired } from "../../../utils/rules";
import SelectMembers from "./SelectMembers";
import SelectSurveys from "./SelectSurveys";

const FormGroup = ({...props}) =>{

    const [formGroup] = Form.useForm();
    const [listMembers, setListMembers] = useState([]);
    const [listSurveys, setListSurveys] = useState([]);
    const [rulesMembers, setRulesMembers] = useState([]);
    const [rulesSurveys, setRulesSurveys] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(()=>{
        if(Object.keys(props.loadData).length > 0){
            formGroup.setFieldsValue({
                name: props.loadData.name
            })
        }
    },[props.loadData])

    const createData = (object) => {
        let queryObject = Object.assign(object);
        if (listMembers.length > 0) {
            queryObject.persons = listMembers;
        }else if(listMembers.length <= 0 && !props.hiddenMembers){
            queryObject.persons = [];
        }else{
            delete queryObject.persons
        }
        if(listSurveys.length > 0){
            queryObject.assessments = listSurveys;
        }else if(listSurveys.length <= 0 && !props.hiddenSurveys){
            queryObject.assessments = [];
        }else{
            delete queryObject.assessments
        }
        if(queryObject.name == "" || queryObject.name == null){
            delete queryObject.name
        }
        return queryObject;
    };

    const onFinish = (values) =>{
        const data = createData(values)
        setLoading(true)
        setTimeout(()=>{
            props.close()
            setLoading(false)
            props.actionForm(data)
        },2000)
    }

    return(
        <Modal
            title={props.title}
            visible={props.visible}
            onCancel={() => props.close()}
            afterClose={()=> props.close()}
            maskClosable={false}
            width={500}
            footer={[
                <>
                    <Button key="back" onClick={() => props.close()}>
                        Cancelar
                    </Button>
                    <Button
                        form="formGroup"
                        type="primary"
                        key="submit"
                        htmlType="submit"
                        loading={loading}
                    >
                        Guardar
                    </Button>
                </>
            ]}
        >
            <Form
                onFinish={onFinish}
                id="formGroup"
                form={formGroup}
                requiredMark={false}
                layout={'vertical'}
            >

                {!props.hiddenName && (
                    <Form.Item name="name" label={"Nombre del grupo"} rules={[ruleRequired]}>
                        <Input maxLength={50} allowClear={true} placeholder="Ingresa un nombre" />
                    </Form.Item>
                )}
                {!props.hiddenMembers && (
                    <Form.Item name="persons" label="Añadir persona">
                        <SelectMembers
                            multiple={props.multipleMembers}
                            members={props.loadData?.persons}
                            setMembers={setListMembers}
                        />
                    </Form.Item>
                )}
                {!props.hiddenSurveys && (
                    <Form.Item name="assessments" label="Añadir encuesta">
                        <SelectSurveys
                            multiple={props.multipleSurveys}
                            surveys={props.loadData?.assessments}
                            setSurveys={setListSurveys}
                        />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    )
}

export default FormGroup
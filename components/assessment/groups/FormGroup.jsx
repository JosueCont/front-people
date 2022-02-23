import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useRouter } from "next/router";
import {
    Form,
    Input,
    Table,
    Breadcrumb,
    Button,
    Row,
    Col,
    Modal,
    message,
    Switch,
    Checkbox
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SyncOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { withAuthSync } from "../../../libs/auth";
import { connect, useDispatch } from "react-redux";
import { useFilter } from "../useFilter";
import { ruleRequired } from "../../../utils/rules";
import SelectMembers from "./SelectMembers";
import SelectSurveys from "./SelectSurveys";

const FormGroup = ({...props}) =>{

    const [formGroup] = Form.useForm();
    const [listMembers, setListMembers] = useState([]);
    const [listSurveys, setListSurveys] = useState([]);
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
        }else{
            delete queryObject.persons
        }
        if(listSurveys.length > 0){
            queryObject.assessments = listSurveys;
        }else{
            delete queryObject.assessments
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

                <Form.Item name="name" label={"Nombre del grupo"} rules={[ruleRequired]}>
                    <Input maxLength={50} allowClear={true} placeholder="Ingresa un nombre" />
                </Form.Item>
                {!props.hiddenMembers && (
                    <Form.Item name="persons" label="Añadir integrantes">
                        <SelectMembers
                            members={props.loadData?.persons}
                            setMembers={setListMembers}
                        />
                    </Form.Item>
                )}
                {!props.hiddenSurveys && (
                    <Form.Item name="assessments" label="Añadir encuestas">
                        <SelectSurveys
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
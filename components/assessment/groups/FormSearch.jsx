import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    message,
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import FormGroup from "./FormGroup";
import WebApiAssessment from "../../../api/WebApiAssessment";

const FormSearch = ({
    hiddenMembers = true,
    hiddenSurveys = true,
    hiddenCategories = true, 
    hiddenName = true,
    multipleSurveys = true,
    multipleMembers = true,
    multipleCategories = true,
    ...props}) =>{
    const [form] = Form.useForm();
    const permissions = useSelector(state => state.userStore.permissions.person)
    const [showModalCreate, setShowModalCreate] = useState(false);

    const HandleFilterReset = () => {
        form.resetFields();
        props.searchGroup("")
    };

    const HandleCreateGroup = () =>{
        setShowModalCreate(true)
    }

    const HandleClose = ()=>{
        setShowModalCreate(false)
    }

    const onFinishAdd = async (values) =>{
        props.setLoading(true)
        props.createGroup(values)
    }

    const onFinishSearch = (values) =>{
        let name = "";
        if((values.name).trim()){
            name = `&name__icontains=${values.name}`;
        }else{
            name = "";
            form.resetFields();
        }
        props.searchGroup(name)
    }

    return(
        <>
            <Row>
                <Col span={18}>
                    <Form form={form} scrollToFirstError onFinish={onFinishSearch}>
                        <Row>
                            <Col span={16}>
                                <Form.Item name="name" label="Filtrar">
                                    <Input
                                        placeholder={
                                            props.textSearch ?
                                            props.textSearch :
                                            'Nombre del grupo'
                                        }
                                        maxLength={50}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <div style={{ float: "left", marginLeft: "5px" }}>
                                    <Form.Item>
                                        <Button htmlType="submit">
                                            <SearchOutlined />
                                        </Button>
                                    </Form.Item>
                                </div>
                                <div style={{ float: "left", marginLeft: "5px" }}>
                                    <Form.Item>
                                        <Button onClick={()=>HandleFilterReset()}>
                                            <SyncOutlined />
                                        </Button>
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col span={6} style={{ display: "flex", justifyContent: "flex-end" }}>
                    {permissions.create && (
                        <Button
                            onClick={() => HandleCreateGroup()}
                        >
                            <PlusOutlined /> {props.textButton ? props.textButton : 'Agregar grupo'}
                        </Button>
                    )}
                </Col>
            </Row>
            {showModalCreate && (
                <FormGroup
                    loadData={{}}
                    title={props.textButton ? props.textButton : 'Crear nuevo grupo'}
                    visible={showModalCreate}
                    close={HandleClose}
                    actionForm={onFinishAdd}
                    multipleMembers={multipleMembers}
                    multipleSurveys={multipleSurveys}
                    multipleCategories={multipleCategories}
                    hiddenName={hiddenName}
                    hiddenSurveys={hiddenSurveys}
                    hiddenMembers={hiddenMembers}
                    hiddenCategories={hiddenCategories}
                />
            )}
        </>
    )
}

export default FormSearch
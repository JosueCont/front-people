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

const FormSearch = ({hiddenMembers = true, hiddenSurveys = true, ...props}) =>{
    const [form] = Form.useForm();
    const permissions = useSelector(state => state.userStore.permissions.person)
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [loading, setLoading] = useState(false);

    const HandleFilterReset = (groups) => {
        form.resetFields();
        props.onFilterReset(groups);
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

    return(
        <>
            <Row>
                <Col span={18}>
                    <Form form={form} scrollToFirstError>
                        <Row>
                            <Col span={16}>
                                <Form.Item name="Filter" label="Filtrar">
                                    <Input
                                        placeholder="Filtra grupos"
                                        maxLength={200}
                                        onChange={props.onFilterChange}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <div style={{ float: "left", marginLeft: "5px" }}>
                                    <Form.Item>
                                        <Button
                                            onClick={() => props.onFilterActive(props.dataGroups?.results)}
                                            htmlType="submit"
                                        >
                                            <SearchOutlined />
                                        </Button>
                                    </Form.Item>
                                </div>
                                <div style={{ float: "left", marginLeft: "5px" }}>
                                    <Form.Item>
                                        <Button onClick={() => HandleFilterReset(props.dataGroups?.results)}>
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
                            loading={loading}
                            onClick={() => HandleCreateGroup()}
                        >
                            <PlusOutlined /> Agregar grupo
                        </Button>
                    )}
                </Col>
            </Row>
            {showModalCreate && (
                <FormGroup
                    loadData={{}}
                    title={'Crear nuevo grupo'}
                    visible={showModalCreate}
                    close={HandleClose}
                    actionForm={onFinishAdd}
                    hiddenSurveys={hiddenSurveys}
                    hiddenMembers={hiddenMembers}
                />
            )}
        </>
    )
}

export default FormSearch
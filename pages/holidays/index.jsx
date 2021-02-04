import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, Button, Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined
} from "@ant-design/icons";

export default function Holidays() {
  const { Column } = Table;
  const route = useRouter();
  const [form] = Form.useForm();
  const { Option } = Select;

  const [holidayList, setHolidayList] = useState([]);


  const getAllHolidays = async () => {
    try {
        let response = await axiosApi.get(`/person/vacation/`);
        let data = response.data.results;
        console.log(data);
        setHolidayList(data);
    } catch (e) {
        console.log(e);
    }
  }

  const GotoDetails = (data) => {
      console.log(data);
      route.push('holidays/'+data.id+'/details')
  }

  useEffect(() => {
    getAllHolidays()
  },[route])

  return (
    <MainLayout currentKey="5">
      <Breadcrumb className={'mainBreadcrumb'}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Vacaciones</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row justify="space-between" key="row1" style={{ paddingBottom: 20 }}>
            <Col>
                <Form
                    name="filter"
                    layout="inline"
                    key="form"
                >
                    <Form.Item
                        key="send_by"
                        name="send_by"
                        label="colaborador"
                    >
                        <Input />
                    </Form.Item>    
                    <Form.Item
                        key="company"
                        name="company"
                        label="Empresa"
                    >
                        <Select style={{ width: 150 }} key="select">
                            <Option key="item_1" value="rmb">RMB</Option>
                            <Option key="item_2" value="dollar">Dollar</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        key="department_select"
                        name="department"
                        label="Departamento"
                    >
                        <Select style={{ width: 150 }} key="select">
                            <Option key="item_1" value="rmb">RMB</Option>
                            <Option key="item_2" value="dollar">Dollar</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        key="estatus_filter"
                        name="estatus"
                        label="Estatus"
                    >
                        <Select style={{ width: 100 }} key="select">
                            <Option key="item_1" value="rmb">RMB</Option>
                            <Option key="item_2" value="dollar">Dollar</Option>
                        </Select>
                    </Form.Item>
                    <Button
                        style={{
                            background: "#fa8c16",
                            fontWeight: "bold",
                            color: "white",
                        }}
                        onClick={() => route.push('holidays/new')} 
                        >
                        Filtrar
                    </Button>
                </Form>
            </Col>
            <Col>
                <Button
                style={{
                    background: "#fa8c16",
                    fontWeight: "bold",
                    color: "white",
                }}
                onClick={() => route.push('holidays/new')} 
                >
                <PlusOutlined />
                Nuevo
                </Button>
            </Col>
        </Row>
        <Row justify={"end"}>
          <Col span={24}>
            <Table dataSource={holidayList} key="table_holidays">
              <Column title="Colaborador" dataIndex="id" key="id"></Column>
              <Column title="Empresa" dataIndex="business" key="business"></Column>
              <Column title="Departamentos" dataIndex="department" key="department"></Column>
              <Column title="Dias solicitados" dataIndex="days_requested" key="days_requested"></Column>
              <Column title="Dias disponibles" dataIndex="available_days" key="available_days"></Column>
              <Column title="Estatus" dataIndex="status" key="status"></Column>
              <Column
                title="Acciones"
                key="actions"
                render={(text, record) => (
                    <>
                        <EyeOutlined className="icon_actions" key={'goDetails_'+record.id} onClick={() => GotoDetails(record)}  />
                        <EditOutlined className="icon_actions" key={'edit_'+record.id} />
                    </>
                )}
              ></Column>
            </Table>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
}

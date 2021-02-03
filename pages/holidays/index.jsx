import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, Button, Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";

export default function Holidays() {
  const { Column } = Table;
  const route = useRouter();
  const [form] = Form.useForm();
  const { Option } = Select;


  const [holidayList, setHolidayList] = useState([]);


  /* const getAllHolidays = async () => {
    try {
        let response = await axiosApi.get(`/noticenter/notification/`);
        let data = response.data;
        setList(data.results);
    } catch (e) {
        console.log(e);
    }
  }
 */

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
            <Table>
              <Column title="Colaborador" dataIndex="id" key="id"></Column>
              <Column title="Empresa" dataIndex="name" key="name"></Column>
              <Column title="Departamentos" dataIndex="name" key="name"></Column>
              <Column title="Dias solicitados" dataIndex="name" key="name"></Column>
              <Column title="Dias disponibles" dataIndex="name" key="name"></Column>
              <Column title="Estatus" dataIndex="name" key="name"></Column>
              <Column
                title="Message"
                dataIndex="message"
                key="message"
              ></Column>
            </Table>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
}

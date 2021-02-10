import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, Button, Form, Input, Select, DatePicker } from "antd";
import moment from 'moment';
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";
import {DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";

export default function InabilityReports() {
    const { Column } = Table;
    const route = useRouter();
    const [form] = Form.useForm();
    const { Option } = Select;
    const { RangePicker } = DatePicker;

    const [collaboratorList, setCollaboratorList] = useState([]);
    const [personList, setPersonList] = useState(null);

    const getAllPersons = async () => {
        try {
        let response = await axiosApi.get(`/person/person/`);
        let data = response.data.results;
        let list  = [];
        data = data.map((a,index) => {
            let item = {
                label: a.first_name + " " + a.flast_name,
                value: a.id,
                key: a.id+index,
            };
            list.push(item);
        });
        setPersonList(list);
        } catch (e) {
        console.log(e);
        }
    };

    useEffect(() => {
        /* getAllHolidays();
        getAllPersons(); */
    }, [route]);

    /* Columnas de tabla */
    const columns = [
        {
          title: "Colaborador",
          dataIndex: "Colaborador",
          key: "Colaborador",
        },
        {
          title: "Empresa",
          dataIndex: "Empresa",
          key: "Empresa"
        },
        {
          title: "Departamento",
          dataIndex: "Departamento",
          key: "Departamento"
        },
        {
            title: "Fecha inicio de incapacidad",
            dataIndex: "Fecha inicio de incapacidad",
            key: "Fecha inicio de incapacidad"
        },
        {
            title: "Fecha fin de incapacidad",
            dataIndex: "Fecha fin de incapacidad",
            key: "Fecha fin de incapacidad"
        },
        {
            title: "Estatus",
            dataIndex: "Estatus",
            key: "Estatus"
        },
        {
            title: "Acciones",
            dataIndex: "actions",
            key: "actions"
        }
      ];

  return (
    <MainLayout currentKey="8.6">
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Reportes</Breadcrumb.Item>
        <Breadcrumb.Item>Solicitudes de incapacidad</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container"  style={{ width: '100%' }} >
        <Row justify="space-between" style={{ paddingBottom: 20 }}  >
          <Col>
              <Form name="filter" layout="inline" key="formFilter">
                <Form.Item key="collaborator" name="collaborator" label="">
                    <Select 
                        placeholder="Colaborador"
                        key="selectPerson"
                        showSearch
                        /* options={personList} */
                        style={{ width:150 }}
                        allowClear 
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }
                    >
                        {
                                personList ? personList.map((item) => {
                                return (<Option key={item.key} value={item.value}>{item.label}</Option>)
                            }) : null
                        }
                    </Select>
                </Form.Item>
                <Form.Item key="company" name="company" label="">
                    <Select placeholder="Empresa" style={{ width: 130 }}></Select>
                </Form.Item>
                <Form.Item key="company" name="company" label="">
                    <Select placeholder="Departamento" style={{ width: 130 }}></Select>
                </Form.Item>
                <Form.Item
                key="department_select"
                name="department"
                >
                    <Select placeholder="Estatus" style={{ width: 100 }}></Select>
                </Form.Item>
                <Form.Item
                    name="send_date"
                    label="Fecha de envio"
                    key="send_date"
                    labelCol={24}
                >
                    <RangePicker /* onChange={onchangeRange} */ />
                </Form.Item>
                <Button
                style={{
                    background: "#fa8c16",
                    fontWeight: "bold",
                    color: "white",
                }}
                key="buttonFilter"
                htmlType="submit"
                >
                Filtrar
                </Button>
            </Form>

              {/*  */}
          </Col>
          <Col >
            <Button
              style={{
                background: "#fa8c16",
                fontWeight: "bold",
                color: "white",
              }}
              onClick={() => route.push("holidays/new")}
              key="btn_new"
            >
              
              Descargar
            </Button>
          </Col>
        </Row>
        <Row justify="end" >
          <Col span={24}>
            <Table dataSource={collaboratorList} key="tableHolidays" columns={columns}>
            </Table>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
}

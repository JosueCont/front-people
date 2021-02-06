import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, Button, Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";

import SelectCompany from '../../components/selects/SelectCompany';
import SelectDepartament from '../../components/selects/SelectDepartament';


import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";

export default function Holidays() {
  const { Column } = Table;
  const route = useRouter();
  const [form] = Form.useForm();
  const { Option } = Select;

  const [holidayList, setHolidayList] = useState([]);
  const [personList, setPersonList] = useState(null);
  
  /* Variables */
  const [companyId, setCompanyId] = useState(null);

  /* Select estatus */
  const optionStatus = [
    { value: 1, label: "Pendiente" },
    { value: 2, label: "Aprobado" },
    { value: 3, label: "Rechazado" },
  ]

  const getAllHolidays = async (collaborator = null, company = null, department = null, status = null) => {
    try {
        let url = `/person/vacation/?`;
        if(collaborator){
            url+=`person__id=${collaborator}&`;
        }
        if(status){
            url+=`status=${status}&`;
        }

        let response = await axiosApi.get(url);
        let data = response.data.results;
        console.log(data);
        setHolidayList(data);
    } catch (e) {
      console.log(e);
    }
  };

  const GotoDetails = (data) => {
    console.log(data);
    route.push("holidays/" + data.id + "/details");
  };

    const getAllPersons = async () => {
        try {
        let response = await axiosApi.get(`/person/person/`);
        let data = response.data.results;
        data = data.map((a) => {
            return {
            label: a.first_name + " " + a.flast_name,
            /* value: a.khonnect_id, */
            value: a.id,
            key: a.name + a.id,
            };
        });
        setPersonList(data);
        } catch (e) {
        console.log(e);
        }
    };

    const filterHolidays = async (values) =>{
        console.log(values);
        getAllHolidays(values.collaborator, null, null,values.status);
    }

    /* Eventos de componentes */
    const onChangeCompany = (val) =>{
        console.log(val);
        setCompanyId(val);
    }


  useEffect(() => {
    getAllHolidays();
    getAllPersons();
  }, [route]);

  return (
    <MainLayout currentKey="5">
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Vacaciones</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row justify="space-between" key="row1" style={{ paddingBottom: 20 }}>
          <Col>
            <Form name="filter" onFinish={filterHolidays} layout="inline" key="form">
              <Form.Item key="collaborator" name="collaborator" label="Colaborador">
                <Select 
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
              <Form.Item key="company" name="company" label="Empresa">
                  <SelectCompany onChange={onChangeCompany} key="SelectCompany" />
              </Form.Item>
              <Form.Item
                key="department_select"
                name="department"
                label="Departamento"
              >
                  <SelectDepartament companyId={companyId} key="selectDepartament"/>
              </Form.Item>
              <Form.Item key="estatus_filter" name="status" label="Estatus">
                <Select style={{ width: 100 }} key="select" options={optionStatus} allowClear/>
              </Form.Item>
              <Button
                style={{
                  background: "#fa8c16",
                  fontWeight: "bold",
                  color: "white",
                }}
                htmlType="submit"
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
              onClick={() => route.push("holidays/new")}
            >
              <PlusOutlined />
              Nuevo
            </Button>
          </Col>
        </Row>
        <Row justify={"end"}>
          <Col span={24}>
            <Table dataSource={holidayList} key="tableHolidays">
              <Column
                title="Colaborador"
                dataIndex="collaborator"
                key="id"
              ></Column>
              <Column
                title="Empresa"
                dataIndex="business"
                key="business"
              ></Column>
              <Column
                title="Departamentos"
                dataIndex="department"
                key="department"
              ></Column>
              <Column
                title="Días solicitados"
                dataIndex="days_requested"
                key="days_requested"
              ></Column>
              <Column
                title="Días disponibles"
                dataIndex="available_days"
                key="available_days"
              ></Column>
              <Column
                title="Estatus"
                dataIndex="status"
                key="status"
                render={(status, record) =>
                  status === 1
                    ? "Pendiente"
                    : status === 2
                    ? "Aprobado"
                    : "Rechazado"
                }
              />
              <Column
                title="Acciones"
                key="actions"
                render={(text, record) => (
                  <>
                    <EyeOutlined
                      className="icon_actions"
                      key={"goDetails_" + record.id}
                      onClick={() => GotoDetails(record)}
                    />
                    <EditOutlined
                      className="icon_actions"
                      key={"edit_" + record.id}
                      onClick={() =>
                        route.push("holidays/" + record.id + "/edit")
                      }
                    />
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

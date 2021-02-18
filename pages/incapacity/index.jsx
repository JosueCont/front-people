import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, Button, Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";
import moment from 'moment'
import Axios from 'axios';
import {API_URL} from '../../config/config'

import SelectCompany from "../../components/selects/SelectCompany";
import SelectDepartment from "../../components/selects/SelectDepartment";
import BreadcrumbHome from "../../components/BreadcrumbHome";

import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  FileDoneOutlined
} from "@ant-design/icons";
import { withAuthSync } from "../../libs/auth";

const Incapacity = () => {
  const { Column } = Table;
  const route = useRouter();
  const [form] = Form.useForm();
  const { Option } = Select;

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [incapacityList, setIncapacityList] = useState([]);
  const [personList, setPersonList] = useState(null);

  /* Variables */
  const [companyId, setCompanyId] = useState(null);
  const [departamentId, setDepartamentId] = useState(null);

  /* Select estatus */
  const optionStatus = [
    { value: 1, label: "Pendiente", key: "opt_1" },
    { value: 2, label: "Aprobado", key: "opt_2" },
    { value: 3, label: "Rechazado", key: "opt_3" },
  ];

  const getAllPersons = async () => {
    try {
      let response = await Axios.get(API_URL+`/person/person/`);
      let data = response.data.results;
      let list = [];
      data = data.map((a, index) => {
        let item = {
          label: a.first_name + " " + a.flast_name,
          value: a.id,
          key: a.id + index,
        };
        list.push(item);
      });
      setPersonList(list);
    } catch (e) {
      console.log(e);
    }
  };

  const getIncapacity = async (collaborator = null, company = null, department = null, status = null) => {
    setLoading(true);
    try {
        let url = `/person/incapacity/?`;
        if(collaborator){
            url+=`person__id=${collaborator}&`;
        }
        if(status){
            url+=`status=${status}&`;
        }

      if (company) {
        url += `person__job_department__job__unit__id=${company}&`;
      }

      if (department) {
        url += `person__job_department__department__id=${department}&`;
      }
        let response = await Axios.get(API_URL+url);
        let data = response.data.results;
        console.log('data',data);
        setIncapacityList(data);

    } catch (e) {
      console.log(e);
    }finally {
        setLoading(false);
        setSending(false);
    }
  };

  const GotoDetails = (data) => {
    console.log(data);
    route.push("permission/" + data.id + "/details");
  };

  const filter = async (values) => {
    setSending(true);
    console.log(values)
    getIncapacity(
      values.collaborator,
      values.company,
      values.department,
      values.status
    );
  };

  /* Eventos de componentes */
  const onChangeCompany = (val) => {
    form.setFieldsValue({
      department: null,
    });
    setCompanyId(val);
  };

  const changeDepartament = (val) => {
    setDepartamentId(val);
  };

    useEffect(() => {
        getIncapacity();
        getAllPersons();
    }, [route]);


  return (
    <MainLayout currentKey="9">
      <Breadcrumb className={"mainBreadcrumb"}>
        <BreadcrumbHome />
        <Breadcrumb.Item>Permisos</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row justify="space-between" style={{ paddingBottom: 20 }}>
          <Col>
              <Form name="filter" onFinish={filter} layout="inline" key="formFilter">
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
                    <SelectCompany onChange={onChangeCompany} key="SelectCompany" style={{ width:150 }} />
                </Form.Item>
                <SelectDepartment companyId={companyId} onChange={changeDepartament} key="SelectDepartment"/>
                <Form.Item key="estatus_filter" name="status" label="Estatus">
                    <Select style={{ width: 100 }} key="select" options={optionStatus} allowClear />
                </Form.Item>
                    <Button
                    style={{
                        background: "#fa8c16",
                        fontWeight: "bold",
                        color: "white",
                    }}
                    key="buttonFilter"
                    htmlType="submit"
                    loading={loading}
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
              onClick={() => route.push("/incapacity/new")}
              key="btn_new"
            >
              <PlusOutlined />
              Nuevo
            </Button>
          </Col>
        </Row>
        <Row justify="end">
          <Col span={24}>
            <Table dataSource={incapacityList} key="tableHolidays" loading={loading}>
              <Column
                title="Colaborador"
                dataIndex="collaborator"
                key="id"
                render={(collaborator, record) => (
                  <>
                    {collaborator && collaborator.first_name
                      ? collaborator.first_name + " "
                      : null}
                    {collaborator && collaborator.flast_name
                      ? collaborator.flast_name
                      : null}
                  </>
                )}
              />
              <Column title="Empresa" dataIndex="business" key="business" />
              <Column
                title="Departamento"
                dataIndex="collaborator"
                key="department"
                render={(collaborator, record) => (
                    collaborator.job_department.department.name
                )}
              />
              <Column
                title="Días solicitados"
                dataIndex=""
                key="requested_days"
              />
              <Column
                title="Fecha inicio de incapacidad"
                dataIndex="departure_date"
                key="date"
                render={(departure_date) =>(
                    moment(departure_date).format("DD/MMM/YYYY")
                )}
              />
              <Column
                title="Documentación"
                dataIndex="document"
                key="docs"
                render={(document, render) => (
                    <a href={document} target="_blank" >
                        <FileDoneOutlined /> <small>Ver documento</small>
                    </a>
                )}
              />
              <Column
                title="Estatus"
                key="docs"
                dataIndex="status"
                render={(status) => (
                    status === 1
                    ? "Pendiente"
                    : status === 2
                    ? "Aprobado"
                    : "Rechazado"
                )}
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
                        route.push("permission/" + record.id + "/edit")
                      }
                    />
                  </>
                )}
              />
            </Table>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default withAuthSync(Incapacity);

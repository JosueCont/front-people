import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, Button, Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";

import SelectCompany from '../../components/selects/SelectCompany';
import SelectDepartment from '../../components/selects/SelectDepartment';
import BreadcrumbHome from '../../components/BreadcrumbHome'


import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";

export default function Permission() {
  const { Column } = Table;
  const route = useRouter();
  const [form] = Form.useForm();
  const { Option } = Select;

  const [loading, setLoading] = useState(false);
  const [permissionsList, setPermissionsList] = useState([]);
  const [personList, setPersonList] = useState(null);
  
  /* Variables */
  const [companyId, setCompanyId] = useState(null);
  const [departamentId, setDepartamentId] = useState(null);

  /* Select estatus */
  const optionStatus = [
    { value: 1, label: "Pendiente", key: 'opt_1'},
    { value: 2, label: "Aprobado", key: 'opt_2'},
    { value: 3, label: "Rechazado", key: 'opt_3' },
  ]

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

  const getPermissions = async (collaborator = null, company = null, department = null, status = null) => {
    setLoading(true);
    try {
        let url = `/person/permit/?`;
        if(collaborator){
            url+=`person__id=${collaborator}&`;
        }
        if(status){
            url+=`status=${status}&`;
        }

        if(company){
            url+=`person__job_department__job__unit__id=${company}&`;
        }

        if(department){
            url+=`person__job_department__department__id=${department}&`;
        }

        let response = await axiosApi.get(url);
        let data = response.data.results;
        console.log('permissions',data);
        setPermissionsList(data);
    } catch (e) {
      console.log(e);
    }finally {
        setLoading(false);
    }
  };

    const GotoDetails = (data) => {
        console.log(data);
        route.push("holidays/" + data.id + "/details");
    };

    const filterPermission = async (values) =>{
        console.log(values);
        getAllHolidays(values.collaborator, values.company, departamentId,values.status);
    }

    /* Eventos de componentes */
    const onChangeCompany = (val) =>{
        setCompanyId(val);
    }

    const changeDepartament = (val) => {
        setDepartamentId(val);
    }

    useEffect(() => {
        getPermissions();
        getAllPersons();
    }, [route]);

  return (
    <MainLayout currentKey="9">
      <Breadcrumb className={"mainBreadcrumb"}>
        <BreadcrumbHome/>
        <Breadcrumb.Item>Vacaciones</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container"  style={{ width: '100%' }} >
        <Row justify="space-between" style={{ paddingBottom: 20 }}  >
          <Col>
              <Form name="filter" onFinish={filterPermission} layout="inline" key="formFilter">
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
              onClick={() => route.push("/permission/new")}
              key="btn_new"
            >
              <PlusOutlined />
              Nuevo
            </Button>
          </Col>
        </Row>
        <Row justify="end" >
          <Col span={24}>
            <Table dataSource={permissionsList} key="tableHolidays" loading={loading}>
              <Column
                title="Colaborador"
                dataIndex="collaborator"
                key="id"
                render={( collaborator, record) => (
                    <>
                    {collaborator && collaborator.first_name ? collaborator.first_name+' ' : null } 
                    {collaborator && collaborator.flast_name ? collaborator.flast_name : null }
                    </>
                    ) }
              />
              <Column
                title="Empresa"
                dataIndex="business"
                key="business"
              />
              <Column
                title="Departamentos"
                dataIndex="department"
                key="department"
              />
              <Column
                title="Días solicitados"
                dataIndex="days_requested"
                key="days_requested"
              />
              <Column
                title="Días disponibles"
                dataIndex="available_days"
                key="available_days"
                render={(days, record) => 
                    record.collaborator ? record.collaborator.Available_days_vacation : null
                }
              />
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
              />
            </Table>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
}

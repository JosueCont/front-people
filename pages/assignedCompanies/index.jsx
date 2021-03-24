import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../layout/MainLayout";
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  Button,
  Form,
  notification,
  Checkbox,
  Typography,
  Input,
  Select,
  DatePicker,
  Tabs,
  Spin,
  Divider,
  Tooltip,
} from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import {API_URL} from '../../config/config'
import { withAuthSync } from "../../libs/auth";

/* Select component person */
import SelectCollaborator from '../../components/selects/SelectCollaboratorItemForm'

const SelectCompany = () => {
    const route = useRouter();
    const {Title} = Typography

    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [arrayCompanies, setArrayCompanies] = useState([]);
    const [collaboratorId, setCollaboratorId] = useState(null)
  

  
  useEffect(()=>{
    getCopaniesList();
  },[])

  const getCopaniesList = async () => {
    try {
      let response = await Axios.get(API_URL + `/business/node/`);
      let data = response.data.results;
      setDataList(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const setcompanyToArray = (checked,companyID) => {
      console.log(checked)
      let prev_list = arrayCompanies;
      if(checked){
          prev_list.push(companyID);
          setArrayCompanies(prev_list);
      }else{
          let index = prev_list.indexOf(companyID);
          if(index > -1){
              prev_list.splice(index,1)
              setArrayCompanies(prev_list)
          }
      }
      console.log(arrayCompanies);
  }

  const setCompanySelect = (companyID) => {
    localStorage.setItem('companyID', companyID);
    route.push('home');
  }

  const setCollaborator = (value) => {
    console.log(value);
    setCollaboratorId(value);
  }

  const saveCompaniesUser = async () =>{
      setLoading(true);
    try {
        for (let index = 0; index < arrayCompanies.length; index++) {
            console.log(arrayCompanies[index]); 
            let data = {
                "person": collaboratorId,
                "node": arrayCompanies[index]
            }
            console.log(data);
            let response = await Axios.post(API_URL + `/business/node-person/`, data);
            let res = response.data;
        }
        route.push("/home");
        notification["success"]({
            message: "Aviso",
            description: "Información enviada correctamente.",
        });
    } catch (error) {
        notification["error"]({
        message: "Aviso",
        description: "Ocurrio un problema al guardar la información",
      });
    }finally{
        setLoading(false);
    }
  }

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Nodo padre",
      dataIndex: "parent",
      key: "node",
      render:(parent) => {
        return parent ? parent.name : null
      }
    },
    {
      title: "",
      dataIndex: "id",
      render: (id) => {
        return <Checkbox key={id} onChange={(e) => setcompanyToArray(e.target.checked,id)} />
      },
    },
    
  ];

  return (
    <MainLayout currentKey="8.5">
        <Breadcrumb className={"mainBreadcrumb"}>
            <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/home" })}
            >
            Inicio
            </Breadcrumb.Item>
            <Breadcrumb.Item>Reportes</Breadcrumb.Item>
        </Breadcrumb>
        <div
            className="container back-white"
            style={{ width: "100%", padding: "20px 0" }}
        >
            <Spin tip="Loading..." spinning={loading}>
                <Row justify={"center"}>
                    <Col span={23}>
                        <Title level={3}>Asignar Empresa</Title>
                        <Divider style={{ marginTop: "2px" }} />
                    </Col>
                    <Col span={23}>
                        <Row justify={'space-between'}>
                            <Col xs={23} md={6} lg={6} xl={6}>
                                <SelectCollaborator onChange={setCollaborator}/>
                            </Col>
                            <Col xs={23} md={6} lg={6} xl={6} style={{ textAlign:'end' }}>
                                <Button
                                    onClick={() => route.push("/home")}
                                    key="cancel"
                                >
                                    Regresar
                                </Button>
                              <Button
                                key="save"
                                type="primary"
                                style={{ marginLeft: 15 }}
                                onClick={() => saveCompaniesUser()}
                                loading={loading}
                            >
                                Guardar
                            </Button>  
                            </Col>
                            <Col xs={23} md={15}>
                                <Table columns={columns} dataSource={dataList}>

                                </Table>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Spin>
        </div>
    </MainLayout>
  );
};

export default withAuthSync(SelectCompany);

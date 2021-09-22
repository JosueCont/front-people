import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../layout/MainLayout";
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  Button,
  notification,
  Checkbox,
  Typography,
  Spin,
  Divider,
} from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { userId, withAuthSync } from "../../libs/auth";

/* Select component person */
import SelectCollaborator from "../../components/selects/SelectCollaborator";
import jsCookie from "js-cookie";

const SelectCompany = () => {
  const route = useRouter();
  const { Title } = Typography;

  const [showTable, setShowTable] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collaboratorId, setCollaboratorId] = useState(null);
  const [companiesUser, setCompaniesUser] = useState([]);
  const personId = userId();

  useEffect(() => {
    person();
  }, []);

  const person = () => {
    const jwt = JSON.parse(jsCookie.get("token"));
    Axios.post(API_URL + `/person/person/person_for_khonnectid/`, {
      id: jwt.user_id,
    })
      .then((response) => {
        if (response.data.is_admin) {
          getCopaniesList();
        } else {
          let data = response.data.nodes.filter((a) => a.active);
          setDataList(data);
          setShowTable(true);
        }
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  const getCopaniesList = async (id) => {
    try {
      let response = await Axios.get(API_URL + `/business/node/`);
      let data = response.data.results.filter((a) => a.active);
      setDataList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setShowTable(true);
    }
  };

  const setcompanyToArray = async (checked, companyID) => {
    await setShowTable(false);
    let prev_list = companiesUser;
    if (checked) {
      prev_list.push(companyID);
    } else {
      let index = prev_list.indexOf(companyID);
      if (index > -1) {
        prev_list.splice(index, 1);
      }
    }
    setCompaniesUser(prev_list);
    setShowTable(true);
  };

  const setCompanySelect = (companyID) => {
    localStorage.setItem("companyID", companyID);
    route.push("home");
  };

  const setCollaborator = (value) => {
    setCollaboratorId(value);
    getCompaniesUser(value);
  };

  const getCompaniesUser = async (id) => {
    let companies = [];
    setShowTable(false);
    try {
      let response = await Axios.get(
        API_URL + `/business/node-person/get_assignment/?person__id=${id}`
      );
      let res = response.data;
      res.map((item) => {
        companies.push(item.id);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setCompaniesUser(companies);
      setShowTable(true);
    }
  };

  const saveCompaniesUser = async () => {
    setLoading(true);
    try {
      let dataPost = {
        person_id: collaboratorId,
        nodes: [],
      };

      for (let index = 0; index < companiesUser.length; index++) {
        dataPost.nodes.push(companiesUser[index]);
      }
      let url = `/business/node-person/create_assignment/`;

      if (companiesUser.length > 0)
        url = `/business/node-person/update_assignment/`;
      let response = await Axios.post(API_URL + url, dataPost);
      let res = response.data;
      notification["success"]({
        message: "Aviso",
        description: "Información enviada correctamente.",
      });
      route.push("/home");
    } catch (error) {
      console.log(error);
      notification["error"]({
        message: "Aviso",
        description: "Ocurrio un problema al guardar la información",
      });
    } finally {
      setLoading(false);
    }
  };

  const companyCheked = (companyId) => {
    return companiesUser.includes(companyId);
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Nodo padre",
      dataIndex: "parent",
      key: "node",
      render: (parent) => {
        return parent ? parent.name : null;
      },
    },
    {
      title: "",
      render: (record) => {
        return showTable ? (
          <Checkbox
            key={record.value}
            checked={companiesUser.includes(record.id)}
            onChange={(e) => {
              setcompanyToArray(e.target.checked, record.id);
            }}
          />
        ) : null;
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
        <Spin tip="Cargando..." spinning={loading}>
          <Row justify={"center"}>
            <Col span={23}>
              <Title level={3}>Asignar Empresa</Title>
              <Divider style={{ marginTop: "2px" }} />
            </Col>
            <Col span={23}>
              <Row justify={"space-between"}>
                <Col xs={23} md={6} lg={6} xl={6}>
                  <SelectCollaborator onChange={setCollaborator} />
                </Col>
                <Col xs={23} md={6} lg={6} xl={6} style={{ textAlign: "end" }}>
                  <Button onClick={() => route.push("/home")} key="cancel">
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
                  <Table
                    columns={columns}
                    dataSource={dataList}
                    locale={{ emptyText: "No se encontraron resultados." }}
                  />
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

import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainInter";
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
  message,
  ConfigProvider,
  Card
} from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import { withAuthSync } from "../../../libs/auth";
import SelectCollaborator from "../../../components/selects/SelectCollaborator";
import jsCookie from "js-cookie";
import { connect } from "react-redux";
import WebApiPeople from "../../../api/WebApiPeople";
import { messageError, messageSaveSuccess } from "../../../utils/constant";
import {FormattedMessage} from "react-intl";
import { verifyMenuNewForTenant } from "../../../utils/functions";
import esES from "antd/lib/locale/es_ES";
import MainIndexSecurity from "../../../components/security/MainIndexSecurity";
import {getPeopleCompany} from "../../../redux/catalogCompany";

const SelectCompany = ({ getPeopleCompany,...props }) => {
  const route = useRouter();
  const { Title } = Typography;

  const [showTable, setShowTable] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collaboratorId, setCollaboratorId] = useState(null);
  const [companiesUser, setCompaniesUser] = useState([]);

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

  useEffect(() => {
    if (props.user) {
      if (props.user.is_admin) {
        getCopaniesList();
        getPeopleCompany()
      } else {
        let data = props.user.nodes?.filter((a) => a.active);
        setDataList(data);
      }
    }
  }, [props.user]);

  const getCopaniesList = async () => {
    await WebApiPeople.getCompanys(props?.user?.id)
      .then((response) => {
        let data = response.data.results.filter((a) => a.active);
        setDataList(data);
      })
      .catch((error) => {
        console.log(error);
      });
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

  const setCollaborator = (value) => {
    setCollaboratorId(value);
    getCompaniesUser(value);
  };

  const getCompaniesUser = async (id) => {
    let companies = [];
    setShowTable(false);
    try {
      let response = await WebApiPeople.getCompaniesPeople(id);
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
    let dataPost = {
      person_id: collaboratorId,
      nodes: [],
    };
    for (let index = 0; index < companiesUser.length; index++) {
      dataPost.nodes.push(companiesUser[index]);
    }
    let url = `create_assignment/`;
    if (companiesUser.length > 0) url = `update_assignment/`;
    await WebApiPeople.assignmentCompanyPerson(url, dataPost)
      .then((response) => {
        message.success(messageSaveSuccess);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        message.error(messageError);
        setLoading(false);
      });
  };

  return (
    <MainIndexSecurity pageKey="security_assign" extraBread={[{name: 'Asignar empresa'}]}>
      <Card>
        <Spin tip="Cargando..." spinning={loading}>
          <Row justify={"center"}>
            <Col span={23}>
              <Title level={3}>Asignar Empresa</Title>
              <Divider style={{ marginTop: "2px" }} />
            </Col>
            <Col span={23}>
              <Row justify={"space-between"}>
                <Col xs={23} md={6} lg={6} xl={6}>
                  <SelectCollaborator onlyUsersKhonnect={true} showSearch={true} onChange={setCollaborator} />
                </Col>
                <Col xs={23} md={6} lg={6} xl={6} style={{ textAlign: "end" }}>
                  {/* <Button
                    onClick={() => route.push("/security/assign")}
                    key="cancel"
                  >
                    Regresar
                  </Button> */}
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
                  <ConfigProvider locale={esES}>
                  <Table
                    columns={columns}
                    pagination={{showSizeChanger:true}}
                    dataSource={dataList}
                    locale={{ emptyText: "No se encontraron resultados." }}
                  />
                  </ConfigProvider>
                </Col>
              </Row>
            </Col>
          </Row>
        </Spin>
      </Card>
    </MainIndexSecurity>
  );
};

const mapState = (state) => {
  return { user: state.userStore.user };
};

export default connect(mapState, {getPeopleCompany})(withAuthSync(SelectCompany));

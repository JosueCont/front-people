import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  Row,
  Col,
  Breadcrumb,
  message,
  Typography,
  Card,
  Spin,
  Button,
  Table,
  Alert,
  Select,
  Input,
} from "antd";
import useRouter from "next/router";
import { userId } from "../../libs/auth";
import jsCookie from "js-cookie";
import { connect } from "react-redux";
import {
  companySelected,
  setUser,
  resetCurrentnode,
} from "../../redux/UserDuck";
import { doCompanySelectedCatalog } from "../../redux/catalogCompany";
import { setVersionCfdi } from "../../redux/fiscalDuck";
import WebApiPeople from "../../api/WebApiPeople";
import { Global, css } from "@emotion/core";
import {
  AppstoreOutlined,
  PlusOutlined,
  TableOutlined,
} from "@ant-design/icons";
import ModalCreateBusiness from "../../components/modal/createBusiness";
import Modal from "antd/lib/modal/Modal";
import router from "next/router";
import { messageError } from "../../utils/constant";
import GenericModal from "../../components/modal/genericModal";
import moment from "moment";
import _ from "lodash";

const SelectCompany = ({ ...props }) => {
  const { Title } = Typography;
  const { Meta } = Card;

  const [dataList, setDataList] = useState([]);
  const [allCompanies, setAllCompanies] = useState([])
  const [loading, setLoading] = useState(true);
  const [jwt, setJwt] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [treeTable, setTreeTable] = useState(true);
  const [modalSwitch, setModalSwitch] = useState(false);
  const [createNode, setCreateNode] = useState(false);
  const [modalCfdiVersion, setModalCfdiVersion] = useState(false);
  const [versionCfdiSelect, setVersionCfdiSelect] = useState(null);
  const currentYear = moment().format("YYYY");
  const [isLoadCompany, setIsLoadCompany] = useState(false);

  let personId = userId();
  const isBrowser = () => typeof window !== "undefined";

  useEffect(() => {
    if (router.query.company) {
      setIsLoadCompany(true);
    }
  }, [router]);

  useEffect(() => {}, [isLoadCompany]);

  useEffect(() => {
    props.resetCurrentnode();
    sessionStorage.removeItem("data");
    try {
      setJwt(JSON.parse(jsCookie.get("token")));
    } catch (error) {
      useRouter.push("/");
    }

    if (isBrowser()) {
      window.sessionStorage.setItem("image", null);
    }
  }, []);

  useEffect(async () => {
    if (jwt) {
      personForKhonnectId(jwt.user_id);
    }
  }, [jwt]);

  const personForKhonnectId = async (user_id) => {
    await WebApiPeople.personForKhonnectId({
      id: user_id,
    })
      .then((response) => {
        props
          .setUser()
          .then((response) => {
            if (!response) return;
          })
          .catch((error) => {
            return;
          });
        // let have_role = Object.keys(response?.data?.administrator_profile ?? {}).length > 0;
        setAdmin(response.data.is_admin);
        sessionStorage.setItem("tok", response.data.id);
        if (response.data.is_admin) {
          if (personId == "" || personId == null || personId == undefined)
            sessionStorage.setItem("number", response.data.id);
          getCopaniesList(response.data.id);
        } else {
          if (response.data.nodes)
            if (response.data.nodes.length > 1) {
              if (personId == "" || personId == null || personId == undefined)
                sessionStorage.setItem("number", response.data.id);
              let data = response.data.nodes.filter((a) => a.active);

              let orderData = data.sort((x, y) => x.name - y.name);
              setDataList(orderData);
              setAllCompanies(orderData)
              setIsLoadCompany(false)
            } else if (response.data.nodes.length == 1) {
              if (personId == "" || personId == null || personId == undefined)
                sessionStorage.setItem("number", response.data.id);
              setCompanySelect(response.data.nodes[0], response.data);
            }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const getCopaniesList = async (personID) => {
    await WebApiPeople.getCompanys(personID)
      .then((response) => {
        let data = response.data.results.filter((a) => a.active);
        let orderData = data.sort((x, y) => x.name - y.name);
        setDataList(orderData);
        setAllCompanies(orderData)
        if (router.query.company) {
          let filterQuery = data.filter(
            (item) => item.id === parseInt(router.query.company)
          );
          setCompanySelect(filterQuery.at(-1));
        } else {
          setLoading(false);
          /*if (data.length === 1) {
            setCompanySelect(data[0]);
          } else {
            setLoading(false);
          }
          */
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const setCompanySelect = async (item, info_user) => {
    // let have_role = Object.keys(info_user?.administrator_profile ?? {}).length > 0;
    if (admin) sessionStorage.setItem("data", item.id);
    else sessionStorage.setItem("data", item.id);
    localStorage.setItem("data", item.id);
    await props
      .companySelected(item.id, props.config)
      .then((response) => {
        props.doCompanySelectedCatalog();
        if (router.query.company) {
          if (router.query.type) {
            setIsLoadCompany(false);
            let is_admin = router.query?.type == "admin";
            let url = is_admin ? "/dashboard" : "/user";
            localStorage.setItem("is_admin", is_admin);
            useRouter.push(url)
          } else {
            setIsLoadCompany(false);
            switch (router.query.app) {
              case "ynl":
                useRouter.push("ynl/general-dashboard");
                break;
              case "khorconnect":
                useRouter.push("intranet/publications_statistics");
                break;
              default:
                useRouter.push("/dashboard");
                break;
            }
          }
        } else {
          if (info_user?.is_admin || admin) {
            useRouter.push("/dashboard");
          } else {
            useRouter.push("/user");
          }
        }
      })
      .catch((error) => {
        message.error(messageError);
      });
  };

  const changeView = () => {
    treeTable ? setTreeTable(false) : setTreeTable(true);
  };

  const columns = [
    {
      title: "Empresa",
      key: "name",
      render: (text, record) => (
        <div
          style={{ cursor: "pointer" }}
          size="middle"
          onClick={() => setCompanySelect(record)}
        >
          <a>{record.name}</a>
        </div>
      ),
    },
  ];

  const switchModal = () => {
    modalSwitch ? setModalSwitch(false) : setModalSwitch(true);
  };

  useEffect(() => {
    if (props.config && props.config.applications)
      if (
        props.config.applications.find(
          (item) => item.app === "PAYROLL" && item.is_active
        )
      )
        setModalCfdiVersion(true);
  }, [props.config]);

  useEffect(() => {
    if (props.versionCfdi) setVersionCfdiSelect(props.versionCfdi);
  }, [props.versionCfdi]);

  const handleOnError = (e) => {
    e.target.src = "/images/empresas.svg";
  };

  const filterCompanies = (name) => {
    let new_liest = allCompanies.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
    setDataList(new_liest)
  }

  const debouncedSearch = useMemo(() => {
    return _.debounce((e) => filterCompanies(e.target.value), 500);
  }, []);

  return (
    <>
      <Global
        styles={css`
          .ant-breadcrumb-link,
          .ant-breadcrumb-separator {
            color: white;
          }
          .cardCompany {
            border-radius: 15px;
            border: none;
            position: relative;
          }
          .ant-card-cover {
            display: flex;
            height: 190px;
          }

          .ant-card-cover img {
            margin: auto;
          }

          .cardCompany .ant-card-body {
            background: #252837;
            border-bottom-right-radius: 13px;
            border-bottom-left-radius: 13px;
          }
          .ant-card-meta-title,
          .ant-card-meta-description {
            color: white;
          }
          .buttonEditCompany {
            padding: 2px 6px;
            position: absolute;
            top: 5px;
            right: 5px;
            border: none;
            border-radius: 10px;
            color: black;
            background-color: #f6f8fd;
          }

          .buttonEditCompany span {
            color: black !important;
          }
          .ant-btn-icon-only {
            background-color: red !important;
          }
        `}
      />
      {jwt && jwt.user_id ? (
        <Spin tip="Seleccionando empresa..." spinning={isLoadCompany}>
          <MainLayout
            currentKey="8.5"
            hideMenu={true}
            hideSearch={true}
            hideLogo={true}
          >
            <Breadcrumb className={"mainBreadcrumb"}>
              <Breadcrumb.Item>Seleccionar empresa</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container" style={{ width: "100%", padding: 20 }}>
              <Spin tip="Cargando..." spinning={loading}>
                <Row gutter={[36, 26]} justify="center">
                  <Col span={24} style={{ textAlign: "center" }}>
                    <Title level={4} style={{ color: "black", marginTop: 50 }}>
                      Elige la empresa donde colaboras
                    </Title>
                  </Col>
                  <Col span={24}>
                    <Row justify={"end"}>
                      <Col style={{ margin: "1%" }}>
                        <Button onClick={changeView}>
                          {treeTable ? (
                            <>
                              <AppstoreOutlined />
                              &nbsp;&nbsp;Tarjetas
                            </>
                          ) : (
                            <>
                              <TableOutlined />
                              &nbsp;&nbsp;Tabla
                            </>
                          )}
                        </Button>
                      </Col>
                      <Col style={{ margin: "1%" }}>
                        <Button onClick={switchModal}>
                          <PlusOutlined /> Agregar empresa
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Input style={{ width:400 }} placeholder="Buscar" onChange={debouncedSearch} allowClear />
                  </Col>
                  {!treeTable &&
                    dataList.map((item) => (
                      <Col
                        key={item.permanent_code}
                        xl={5}
                        lg={5}
                        md={5}
                        sm={8}
                        xs={24}
                      >
                        <Card
                          className="cardCompany "
                          hoverable
                          cover={
                            item.image ? (
                              <img
                                alt="example"
                                src={item.image}
                                style={{ width: "50%" }}
                                onError={handleOnError}
                              />
                            ) : (
                              <div className="center-content">
                                <img
                                  alt="example"
                                  src="/images/LogoKhorconnect.svg"
                                  style={{ width: "50%" }}
                                  onError={handleOnError}
                                />
                              </div>
                            )
                          }
                          style={{
                            backgroundColor: `#262837`,
                            padding:40
                          }}
                          onClick={() => setCompanySelect(item)}
                        >
                          {/* <span
                          className="buttonEditCompany"
                          style={{ position: "absolute" }}
                        >
                          <EditOutlined />
                        </span> */}
                          <Meta
                            className="meta_company"
                            title={item.name}
                            description="Ultima vez: Hace 2 Hrs"
                          />
                        </Card>
                      </Col>
                    ))}
                  {treeTable && dataList && (
                    <Col span={24}>
                      <Table
                        className={"mainTable"}
                        size="small"
                        columns={columns}
                        dataSource={dataList}
                        loading={loading}
                        locale={{
                          emptyText: loading
                            ? "Cargando..."
                            : "No se encontraron resultados.",
                        }}
                      />
                    </Col>
                  )}
                </Row>
              </Spin>
            </div>
            <Modal
              visible={modalSwitch}
              onCancel={switchModal}
              title={<b>Agregar empresa</b>}
              footer={[
                <Button
                  key="back"
                  onClick={() => router.push("/payroll/importMasivePayroll")}
                >
                  Importar xml
                </Button>,
                <Button
                  key="submit"
                  onClick={() => {
                    setModalSwitch(false), setCreateNode(true);
                  }}
                >
                  Crear manualmente
                </Button>,
              ]}
            >
              <Alert
                message={
                  <span>
                    <b>Importar xml:</b> Se crea la empresa y el histórico de
                    nómina a base de una carga masiva de xml (nominas por
                    persona). Por favor importa todo tu año {currentYear}
                  </span>
                }
                type="warning"
              />
              <br />
              <Alert
                message={
                  <span>
                    <b>Crear manualmente:</b> Se crea de manera manual una
                    empresa con la información basica necesaria.
                  </span>
                }
                type="warning"
              />
            </Modal>
            <ModalCreateBusiness
              user={props.user}
              business={dataList}
              visible={createNode}
              setVisible={setCreateNode}
              afterAction={(value) => personForKhonnectId(value)}
            />
          </MainLayout>
        </Spin>
      ) : (
        <div className="notAllowed" />
      )}
    </>
  );
};

const mapState = (state) => {
  return {
    config: state.userStore.general_config,
    user: state.userStore.user,
    catCfdiVersion: state.fiscalStore.cat_cfdi_version,
    versionCfdi: state.fiscalStore.version_cfdi,
  };
};

export default connect(mapState, {
  companySelected,
  doCompanySelectedCatalog,
  setUser,
  resetCurrentnode,
  setVersionCfdi,
})(SelectCompany);

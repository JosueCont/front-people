import React, { useEffect, useState } from "react";
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

const SelectCompany = ({ ...props }) => {
  const { Title } = Typography;
  const { Meta } = Card;

  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jwt, setJwt] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [treeTable, setTreeTable] = useState(true);
  const [modalSwitch, setModalSwitch] = useState(false);
  const [createNode, setCreateNode] = useState(false);
  const [modalCfdiVersion, setModalCfdiVersion] = useState(false);
  const [versionCfdiSelect, setVersionCfdiSelect] = useState(null);

  let personId = userId();
  const isBrowser = () => typeof window !== "undefined";

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
        setAdmin(response.data.is_admin);
        sessionStorage.setItem("tok", response.data.id);
        if (response.data.is_admin) {
          if (personId == "" || personId == null || personId == undefined)
            sessionStorage.setItem("number", response.data.id);
          getCopaniesList();
        } else {
          if (response.data.nodes)
            if (response.data.nodes.length > 1) {
              if (personId == "" || personId == null || personId == undefined)
                sessionStorage.setItem("number", response.data.id);
              let data = response.data.nodes.filter((a) => a.active);
              setDataList(data);
            } else if (response.data.nodes.length == 1) {
              if (personId == "" || personId == null || personId == undefined)
                sessionStorage.setItem("number", response.data.id);
              setCompanySelect(response.data.nodes[0]);
            }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const getCopaniesList = async () => {
    await WebApiPeople.getCompanys()
      .then((response) => {
        let data = response.data.results.filter((a) => a.active);
        setDataList(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const setCompanySelect = async (item) => {
    if (admin) sessionStorage.setItem("data", item.id);
    else sessionStorage.setItem("data", item.id);
    await props
      .companySelected(item.id, props.config)
      .then((response) => {
        props.doCompanySelectedCatalog();
        useRouter.push("home/persons");
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
      title: "Name",
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
                            Tarjetas
                          </>
                        ) : (
                          <>
                            <TableOutlined />
                            Tabla
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
                        className="cardCompany"
                        hoverable
                        cover={
                          <img
                            alt="example"
                            src={item.image}
                            style={{ width: "50%" }}
                          />
                        }
                        style={{
                          backgroundColor: `#${Math.floor(
                            Math.random() * 16777215
                          ).toString(16)}`,
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
                  persona).
                </span>
              }
              type="warning"
            />
            <br />
            <Alert
              message={
                <span>
                  <b>Crear manualmente:</b> Se crea de manera manual una empresa
                  con la información basica necesaria.
                </span>
              }
              type="warning"
            />
          </Modal>
          <ModalCreateBusiness
            user={props.user}
            visible={createNode}
            setVisible={setCreateNode}
            afterAction={(value) => personForKhonnectId(value)}
          />
          {modalCfdiVersion && props.cfdiVersion && (
            <GenericModal
              visible={modalCfdiVersion}
              setVisible={(value) => setModalCfdiVersion(value)}
              title="Versión CFDI"
              titleActionButton="Aceptar"
              width="50%"
              content={
                <>
                  <Alert
                    message={
                      <span>
                        <b>Versión de CFDI:</b> Seleccione la version con la
                        cual trabajara su nómina (los catalogos fiscales varian
                        entre versiones).
                      </span>
                    }
                    type="info"
                  />{" "}
                  <br />
                  <Select
                    onChange={(value) => setVersionCfdiSelect(value)}
                    placeholder="Seleccione la version"
                    defaultValue={
                      props.cfdiVersion.find((item) => item.active === true).id
                    }
                    options={props.cfdiVersion.map((item) => {
                      return {
                        label: `Versión - ${item.version}`,
                        value: item.id,
                      };
                    })}
                  />
                </>
              }
              actionButton={() => {
                props.setVersionCfdi(versionCfdiSelect),
                  setModalCfdiVersion(false);
              }}
            />
          )}
        </MainLayout>
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
    cfdiVersion: state.fiscalStore.cfdi_version,
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

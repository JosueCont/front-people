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
  Switch,
  Table,
} from "antd";
import useRouter from "next/router";
import { userId } from "../../libs/auth";
import jsCookie from "js-cookie";
import { connect } from "react-redux";
import { companySelected, setUser } from "../../redux/UserDuck";
import { doCompanySelectedCatalog } from "../../redux/catalogCompany";
import WebApiPeople from "../../api/WebApiPeople";
import Clipboard from "../../components/Clipboard";
import { Global, css } from "@emotion/core";
import {
  AppstoreOutlined,
  EditOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { GridOffOutlined, GridOnOutlined } from "@material-ui/icons";

const SelectCompany = ({ ...props }) => {
  const { Title } = Typography;
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jwt, setJwt] = useState(null);
  let personId = userId();
  const [admin, setAdmin] = useState(false);
  const { Meta } = Card;
  const isBrowser = () => typeof window !== "undefined";
  const [treeTable, setTreeTable] = useState(true);

  useEffect(() => {
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
    try {
      if (jwt) {
        let response = await WebApiPeople.personForKhonnectId({
          id: jwt.user_id,
        });
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
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [jwt]);

  const getCopaniesList = async () => {
    try {
      let response = await WebApiPeople.getCompanys();
      let data = response.data.results.filter((a) => a.active);
      setDataList(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const setCompanySelect = async (item) => {
    if (admin) sessionStorage.setItem("data", item.id);
    else sessionStorage.setItem("data", item.id);
    let response = await props.companySelected(item.id);
    if (response) {
      props.doCompanySelectedCatalog();
      useRouter.push("home");
    } else {
      message.error("Ocurrio un error, intente de nuevo.");
    }
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
    {
      title: "Nombre comercial",
      key: "tradename",
      render: (text, record) => (
        <div
          style={{ cursor: "pointer" }}
          size="middle"
          onClick={() => setCompanySelect(record)}
        >
          <a>{record.tradename}</a>
        </div>
      ),
    },
  ];

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
            <Breadcrumb.Item>Inicio</Breadcrumb.Item>
            <Breadcrumb.Item>Empresas</Breadcrumb.Item>
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
                      {treeTable ? (
                        <Button onClick={changeView}>
                          <AppstoreOutlined />
                          Grid
                        </Button>
                      ) : (
                        <Button onClick={changeView}>
                          <TableOutlined />
                          Tabla
                        </Button>
                      )}
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
                        <span
                          className="buttonEditCompany"
                          style={{ position: "absolute" }}
                        >
                          <EditOutlined />
                        </span>
                        {/* <Button type="primary" className="buttonEditCompany" icon={<EditOutlined />} style={{position:'absolute' }} /> */}
                        <Meta
                          className="meta_company"
                          title={item.name}
                          description="Ultima vez: Hace 2 Hrs"
                        />
                      </Card>
                      {/* <Card
                      hoverable
                      className={"cardH100"}
                      actions={[
                        <Clipboard
                          text={
                            window.location.origin +
                            "/ac/urn/" +
                            item.permanent_code
                          }
                          border={false}
                          type={"button"}
                          msg={"Copiado en portapapeles"}
                          tooltipTitle={"Copiar link de auto registro"}
                        />,
                      ]}
                    >
                      <div
                        className="div-card "
                        onClick={() => setCompanySelect(item)}
                      >
                        <Title level={4} style={{ margin: "auto" }}>
                          <img alt="example" src={item.image} width="50px" />
                          <br />
                          {item.name}
                        </Title>
                      </div>
                    </Card> */}
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
        </MainLayout>
      ) : (
        <div className="notAllowed" />
      )}
    </>
  );
};

const mapState = (state) => {
  return { config: state.userStore.general_config };
};

export default connect(mapState, {
  companySelected,
  doCompanySelectedCatalog,
  setUser,
})(SelectCompany);

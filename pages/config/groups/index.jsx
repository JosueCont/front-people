import {
  Form,
  Input,
  Table,
  Breadcrumb,
  Button,
  Row,
  Col,
  Modal,
  Tooltip,
  message,
  ConfigProvider
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import MainLayout from "../../../layout/MainInter";
const { confirm } = Modal;
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { withAuthSync } from "../../../libs/auth";
import { connect } from "react-redux";
import { deleteGroups } from "../../../api/apiKhonnect";
import { messageDeleteSuccess, messageError } from "../../../utils/constant";
import { getProfileGroups } from "../../../redux/catalogCompany";
import {FormattedMessage} from "react-intl";
import { getFiltersJB } from "../../../utils/functions";
import { verifyMenuNewForTenant } from "../../../utils/functions";
import esES from "antd/lib/locale/es_ES";
import moment from 'moment'

const Groups = ({ ...props }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    if (props.cat_groups && props.config) setGroups(props.cat_groups);
  }, [props.cat_groups, props.config]);

  useEffect(()=>{
    form.setFieldsValue(router.query);
},[router])

useEffect(()=>{
  if(props.currentNode){
      let page = router.query.page ? parseInt(router.query.page) : 1;
      let filters = getFiltersJB(router.query);
      props.getProfileGroups(props.currentNode.id, props.config, filters);
  }
},[props.currentNode, router])

  const deleteGroup = async (id) => {
    let data = { id: id };
    let response = await deleteGroups(props.config, data);
    if (response == "associated")
      message.error({
        content: "Este perfil tiene usuarios asociados",
        className: "custom-class",
        style: {
          marginTop: "20vh",
        },
      });
    else if (response) message.success(messageDeleteSuccess);
    else if (!response) message.error(messageError);
    let filters = getFiltersJB(router.query);
    props.getProfileGroups(props.currentNode.id, props.config, filters);
  };

  const confirmDelete = (id) => {
    confirm({
      title: "¿Está seguro de eliminar este perfil de seguridad?",
      icon: <ExclamationCircleOutlined />,
      content: "Si lo elimina no podrá recuperarlo",
      onOk() {
        deleteGroup(id);
      },
      okType: "primary",
      okText: "Eliminar",
      cancelText: "Cancelar",
      okButtonProps: {
        danger: true,
      },
    });
  };

  const filter = (value) => {
    let filt = "";
    if (value.name != "" && value.name != undefined) {
      filt = "&name=" + value.name;
    }
    router.replace({
      pathname: '/config/groups/',
      query: value
    }, undefined, {shallow: true});
    props.getProfileGroups(props.currentNode.id, props.config, filt);
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Fecha de creación",
      render: (item) => {
        return <div>{item.timestamp?moment(item.timestamp).format('DD/MM/YYYY'):''}</div>;
      },
    },
    {
      title: "Acciones",
      key: "id",
      render: (text, record) => {
        return (
          <div>
            <Row gutter={16}>
              {props.permissions.edit && (
                <Col className="gutter-row" span={6}>
                  <a
                    onClick={() =>
                      router.push({
                        pathname: "/config/groups/add",
                        query: {...router.query, type: "edit", id: record.id },
                      })
                    }
                  >
                    <EditOutlined />
                  </a>
                </Col>
              )}
              {props.permissions.delete && (
                <Col className="gutter-row" span={6}>
                  <DeleteOutlined onClick={() => confirmDelete(record.id)} />
                </Col>
              )}
            </Row>
          </div>
        );
      },
    },
  ];

  const resetFilter = () => {
    form.resetFields();
    router.replace('/config/groups', undefined, {shallow: true});
    props.getProfileGroups(props.currentNode.id, props.config);
  };
  return (
    <MainLayout currentKey={["securityGroups"]} defaultOpenKeys={["utilities","config"]}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        {verifyMenuNewForTenant() && 
          <Breadcrumb.Item>Utilidades-Configuración</Breadcrumb.Item>
        }
        <Breadcrumb.Item>Configuración</Breadcrumb.Item>
        <Breadcrumb.Item>Perfiles de seguridad</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <div className="top-container-border-radius">
          <Row justify={"space-between"} className={"formFilter"}>
            <Col>
              <Form
                form={form}
                onFinish={filter}
                layout={"vertical"}
                initialValues={{
                  id: "",
                  name: "",
                  perms: [],
                }}
                scrollToFirstError
              >
                <Row gutter={[10]}>
                  <Col>
                    <Form.Item name="name" label="Nombre">
                      <Input placeholder="Nombre" />
                    </Form.Item>
                  </Col>
                  <Col
                    className="button-filter-person"
                    style={{ display: "flex", marginTop: "10px" }}
                  >
                    <Tooltip title="Filtrar" color={"#3d78b9"} key={"#filtrar"}>
                      <Button
                        htmlType="submit"
                        style={{ marginTop: "auto", marginLeft: 10 }}
                      >
                        <SearchOutlined />
                      </Button>
                    </Tooltip>
                  </Col>
                  <Col
                    className="button-filter-person"
                    style={{ display: "flex", marginTop: "10px" }}
                  >
                    <Tooltip title="Filtrar" color={"#3d78b9"} key={"#filtrar"}>
                      <Button
                        onClick={() => resetFilter()}
                        style={{ marginTop: "auto", marginLeft: 10 }}
                      >
                        <SyncOutlined />
                      </Button>
                    </Tooltip>
                  </Col>
                  <Col
                    className="button-filter-person"
                    style={{ marginTop: "auto", marginLeft: 10 }}
                  >
                    {props.permissions.create && (
                      <Button
                        style={{
                          background: "#fa8c16",
                          fontWeight: "bold",
                          color: "white",
                        }}
                        onClick={() =>
                          router.push({ pathname: "/config/groups/add" })
                        }
                      >
                        <PlusOutlined />
                        Agregar
                      </Button>
                    )}
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </div>
        <ConfigProvider locale={esES}>
        <Table
          className={"mainTable"}
          columns={columns}
          dataSource={groups}
          pagination={{showSizeChanger:true}}
          loading={loading}
          locale={{
            emptyText: loading
              ? "Cargando..."
              : "No se encontraron resultados.",
          }}
        />
        </ConfigProvider>
      </div>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    config: state.userStore.general_config,
    currentNode: state.userStore.current_node,
    permissions: state.userStore.permissions.groups,
    cat_groups: state.catalogStore.cat_groups,
  };
};

export default connect(mapState, { getProfileGroups })(withAuthSync(Groups));

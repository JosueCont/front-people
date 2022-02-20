import React, { useEffect, useState } from "react";
import {
  Tabs,
  Typography,
  Form,
  Row,
  Col,
  Button,
  Table,
  Spin,
  Input,
  message,
  Modal,
} from "antd";
import MassiveImportDepartments from "../business/MassiveImportDepartments";
import { ruleRequired } from "../../utils/rules";
import { connect } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { getDepartmets } from "../../redux/catalogCompany";
import {
  messageDeleteSuccess,
  messageError,
  messageSaveSuccess,
  messageUpdateSuccess,
} from "../../utils/constant";
import WebApiPeople from "../../api/WebApiPeople";

const Departaments = ({ permissions, currentNode, ...props }) => {
  const { Title } = Typography;
  const { TabPane } = Tabs;

  const [edit, setEdit] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState({});
  const [id, setId] = useState("");

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "key",
    },
    {
      title: "Descripción",
      dataIndex: "description",
    },
    {
      title: "Código",
      dataIndex: "code",
    },
    {
      title: "Acciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              {permissions.edit && (
                <Col className="gutter-row" offset={1}>
                  <EditOutlined onClick={() => editRegister(item, "dep")} />
                </Col>
              )}
              {permissions.delete && (
                <Col className="gutter-row" offset={1}>
                  <DeleteOutlined
                    onClick={() => {
                      setDeleteRegister({
                        id: item.id,
                        url: "/business/department/",
                      });
                    }}
                  />
                </Col>
              )}
            </Row>
          </div>
        );
      },
    },
  ];

  const resetForm = () => {
    form.resetFields();
    setEdit(false);
    setId("");
  };

  const onFinishForm = (value, url) => {
    if (edit) {
      updateRegister(url, value);
    } else saveRegister(url, value);
  };

  const saveRegister = async (url, data) => {
    data.node = currentNode.id;
    setLoading(true);
    try {
      let response = await WebApiPeople.createRegisterCatalogs(
        "/business/department/",
        data
      );
      props
        .getDepartmets(currentNode.id)
        .then((response) => {
          resetForm();
          message.success(messageSaveSuccess);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          message.error(messageError);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error(messageError);
    }
  };

  const editRegister = (item, param) => {
    setEdit(true);
    setId(item.id);
    form.setFieldsValue({
      node: item.node.id,
      name: item.name,
      description: item.description,
      code: item.code,
    });
  };

  const updateRegister = async (url, value) => {
    try {
      let response = await WebApiPeople.updateRegisterCatalogs(
        `/business/department/${id}/`,
        value
      );
      props
        .getDepartmets(currentNode.id)
        .then((response) => {
          setId("");
          resetForm();
          message.success(messageUpdateSuccess);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          message.error(messageError);
        });
    } catch (error) {
      setId("");
      setEdit(false);
      setLoading(false);
      resetForm();
      message.error("Ocurrio un error intente de nuevo.");
    }
  };

  const setDeleteRegister = (data) => {
    setDeleted(data);
  };

  useEffect(() => {
    if (deleted.id) {
      Modal.confirm({
        title: "¿Está seguro de eliminar este registro?",
        content: "Si lo elimina no podrá recuperarlo",
        icon: <ExclamationCircleOutlined />,
        okText: "Si, eliminar",
        okButtonProps: {
          danger: true,
        },
        cancelText: "Cancelar",
        onOk() {
          deleteRegister();
        },
      });
    }
  }, [deleted]);

  const deleteRegister = async () => {
    try {
      let response = await WebApiPeople.deleteRegisterCatalogs(
        deleted.url + `${deleted.id}/`
      );
      props
        .getDepartmets(currentNode.id)
        .then((response) => {
          resetForm();
          message.success(messageDeleteSuccess);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          message.error(messageError);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {edit ? <Title style={{ fontSize: "20px" }}>Editar</Title> : <></>}
      {permissions.create && (
        <Form
          layout={"vertical"}
          form={form}
          onFinish={(values) =>
            onFinishForm(values, `/business/department/?node=${currentNode.id}`)
          }
        >
          <Row gutter={20}>
            <Col lg={6} xs={22} md={12}>
              <Form.Item name="name" label="Nombre" rules={[ruleRequired]}>
                <Input />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} md={12}>
              <Form.Item
                name="description"
                label="Descripción"
                rules={[ruleRequired]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} md={12}>
              <Form.Item name="code" label="Código">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"end"} gutter={20} style={{ marginBottom: 20 }}>
            <Col>
              <Button onClick={resetForm}>Cancelar</Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
            </Col>
          </Row>
        </Form>
      )}
      <Spin tip="Cargando..." spinning={loading}>
        <Table
          columns={columns}
          dataSource={props.cat_departments}
          locale={{
            emptyText: loading
              ? "Cargando..."
              : "No se encontraron resultados.",
          }}
        />
      </Spin>
    </>
  );
};

const mapState = (state) => {
  return {
    cat_departments: state.catalogStore.cat_departments,
  };
};

export default connect(mapState, { getDepartmets })(Departaments);

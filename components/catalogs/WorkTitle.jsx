import React, { useEffect, useState } from "react";
import {
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
  Tag,
  ConfigProvider,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { ruleRequired } from "../../utils/rules";
import { connect } from "react-redux";
import SelectLevel from "../selects/SelectLevel";
import SelectJob from "../selects/SelectJob";
import SelectDepartment from "../selects/SelectDepartment";
import {
  messageDeleteSuccess,
  messageError,
  messageSaveSuccess,
  messageUpdateSuccess,
} from "../../utils/constant";
import { getWorkTitle } from "../../redux/catalogCompany";
import WebApiPeople from "../../api/WebApiPeople";
// import SelectWorkTitle from "../selects/SelectWorkTitle";
import esES from "antd/lib/locale/es_ES";

const WorkTitle = ({ currentNode = null, ...props }) => {
  const { Title } = Typography;

  const [edit, setEdit] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState({});
  const [id, setId] = useState("");
  const [workTitles, setWorktitles] = useState([]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "key",
    }, {
      title: "Nombre",
      dataIndex: "name",
      key: "key",
    },
    {
      title: "Estatus",
      render: (item) => {
        return (
          <Tag
            style={{
              minWidth: "125px",
              maxWidth: "200px",
              textAlign: "center",
            }}
            color={item.person == null ? "blue" : "red"}
          >
            {item.person == null ? "Vacante" : "Ocupado"}
          </Tag>
        );
      },

      key: "key",
    },
    {
      title: "Departamento",
      width: 100,
      render: (item) => {
        return <div>{item.department ? item.department.name : ""}</div>;
      },
    },
    {
      title: "Puesto",
      width: 100,
      render: (item) => {
        return <div>{item.job ? item.job.name : ""}</div>;
      },
    },
    {
      title: "Nivel",
      key: "level",
      render: (item) => {
        return <div>{item.level ? item.level.name : ""}</div>;
      },
    },
    {
      title: "Acciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" offset={1}>
                <EditOutlined onClick={() => editRegister(item, "job")} />
              </Col>
              <Col className="gutter-row" offset={1}>
                <DeleteOutlined
                  onClick={() => {
                    setDeleteRegister({
                      id: item.id,
                      url: "/business/work-title/",
                    });
                  }}
                />
              </Col>
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

  useEffect(() => {
    if (currentNode) getWorkTitles();
  }, [currentNode]);

  const getWorkTitles = async () => {
    try {
      const res = await WebApiPeople.getWorkTitles(currentNode.id);
      setWorktitles(res.data.results);
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error(messageError);
    }
  };

  const onFinishForm = (value, url) => {
    /**
     * Validamos que no puedan meter datos con puros espacios
     */
    if (!(value?.name && value.name.trim())) {
      form.setFieldsValue({ name: undefined });
      value.name = undefined;
    }

    if (value.name === undefined) {
      form.validateFields();
      return;
    }

    if (edit) {
      updateRegister(url, value);
    } else {
      saveRegister(url, value);
    }
  };

  const saveRegister = async (url, data) => {
    data.node = currentNode.id;
    setLoading(true);
    try {
      const res = await WebApiPeople.createRegisterCatalogs(
        "/business/work-title/",
        data
      );
      resetForm();
      getWorkTitles();
      message.success(messageSaveSuccess);
      setLoading(false);
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
      department: item.department.id,
      job: item.job.id,
      level: item.level.id,
      salary: item.salary,
    });
  };

  const updateRegister = async (url, value) => {
    value.node = currentNode.id;
    try {
      const res = await WebApiPeople.updateRegisterCatalogs(
        `/business/work-title/${id}/`,
        value
      );
      setId("");
      resetForm();
      getWorkTitles();
      message.success(messageUpdateSuccess);
      setLoading(false);
    } catch (error) {
      setId("");
      setEdit(false);
      setLoading(false);
      resetForm();
      message.error(messageError);
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
        okText: "Sí, eliminar",
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
      const res = await WebApiPeople.deleteRegisterCatalogs(
        deleted.url + `${deleted.id}/`
      );
      resetForm();
      getWorkTitles();
      setDeleted({});
      message.success(messageDeleteSuccess);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message)
        message.error(error.response.data.message);
      else message.error(messageError);
      console.log(error);
    }
  };

  return (
    <>
      {edit ? <Title style={{ fontSize: "20px" }}>Editar</Title> : <></>}

      <Form
        layout={"vertical"}
        form={form}
        onFinish={(values) => onFinishForm(values, "/business/work-title/")}
      >
        <Row gutter={20}>
          <Col lg={8} xs={22} md={12}>
            <Form.Item name="name" label="Nombre" rules={[ruleRequired]}>
              <Input maxLength={100} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <SelectDepartment rules={[ruleRequired]} />
          </Col>
          <Col lg={8} xs={22} md={12}>
            <SelectJob rules={[ruleRequired]} />
          </Col>
          <Col lg={8} xs={22} md={12}>
            <SelectLevel textLabel={"Nivel"} rules={[ruleRequired]} />
          </Col>
          {/*<Col lg={8} xs={22} md={12}>*/}
          {/*  <Form.Item name="salary" label="Salario">*/}
          {/*    <Input prefix={"$"} type="number" min={0} defaultValue={0} />*/}
          {/*  </Form.Item>*/}
          {/*</Col>*/}
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
      <Spin tip="Cargando..." spinning={loading}>
        <ConfigProvider locale={esES}>
          <Table
            columns={columns}
            dataSource={workTitles}
            pagination={{ showSizeChanger: true }}
            locale={{
              emptyText: loading
                ? "Cargando..."
                : "No se encontraron resultados.",
            }}
          />
        </ConfigProvider>
      </Spin>
    </>
  );
};

const mapState = (state) => {
  return {
    // cat_work_title: state.catalogStore.cat_work_title,
  };
};

export default connect(mapState, { getWorkTitle })(WorkTitle);

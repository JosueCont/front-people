import React, { useEffect, useState } from "react";
import { Typography, Form, Row, Col, Button, Table, Spin, Input } from "antd";
import { DeleteOutlined, EditOutlined, GoldOutlined } from "@ant-design/icons";
import { ruleRequired } from "../../utils/rules";
import { connect } from "react-redux";
import SelectWorkTitle from "../selects/SelectWorkTitle";
import SelectLevel from "../selects/SelectLevel";
import SelectJob from "../selects/SelectJob";

const WorkTitle = ({ currentNode, ...props }) => {
  const { Title } = Typography;

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
      title: "Plaza a la que reporta",
      width: 100,
      render: (item) => {
        return (
          <div>{item.work_title_report ? item.work_title_report.name : ""}</div>
        );
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
      title: "Salario",
      key: "Salario",
      render: (item) => {
        return `$ ${item.salary}`;
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
                      url: "/business/job/",
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

  const onFinishForm = (value, url) => {
    if (edit) {
      updateRegister(url, value);
    } else saveRegister(url, value);
  };

  const saveRegister = async (url, data) => {
    data.node = currentNode.id;
    setLoading(true);
    try {
      let response = await WebApi.createRegisterCatalogs(
        "/business/job/",
        data
      );
      props
        .getJobs(currentNode.id)
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
      code: item.code,
    });
  };

  const updateRegister = async (url, value) => {
    try {
      let response = await WebApi.updateRegisterCatalogs(
        `/business/job/${id}/`,
        value
      );
      props
        .getJobs(currentNode.id)
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
      let response = await WebApi.deleteRegisterCatalogs(
        deleted.url + `${deleted.id}/`
      );
      props
        .getJobs(currentNode.id)
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

      <Form
        layout={"vertical"}
        form={form}
        onFinish={(values) => onFinishForm(values, "/person/person-type/")}
      >
        <Row>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="name" label="Nombre" rules={[ruleRequired]}>
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <SelectDepartment />
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <SelectJob />
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <SelectWorkTitle
              labelText={"Plaza a la que reporta"}
              name={"work_title_report"}
            />
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <SelectLevel />
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="salary" label="Salario" rules={[ruleRequired]}>
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
      <Spin tip="Cargando..." spinning={loading}>
        <Table
          columns={columns}
          dataSource={props.cat_work_title}
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
  return { cat_work_title: state.catalogStore.cat_work_title };
};

export default connect(mapState)(WorkTitle);

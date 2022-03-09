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
import SelectWorkTitle from "../selects/SelectWorkTitle";

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
      title: "Nivel",
      key: "level",
      render: (item) => {
        return <div>{item.level ? item.level.name : ""}</div>;
      },
    },
    // {
    //   title: "Vacantes",
    //   key: "vacancy",
    //   render: (item) => {
    //     return <div>{item.vacancy ? item.vacancy.vacancy_numbers : ""}</div>;
    //   },
    // },
    // {
    //   title: "Vacantes disponibles",
    //   key: "vacancies_available",
    //   render: (item) => {
    //     return (
    //       <div>{item.vacancy ? item.vacancy.vacancies_available : ""}</div>
    //     );
    //   },
    // },
    // {
    //   title: "Vacantes ocupadas",
    //   key: "vacancies_",
    //   render: (item) => {
    //     return (
    //       <div>
    //         {item.vacancy
    //           ? item.vacancy.vacancy_numbers - item.vacancy.vacancies_available
    //           : ""}
    //       </div>
    //     );
    //   },
    // },
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

  const onFinishForm = (value, url) => {
    if (edit) {
      updateRegister(url, value);
    } else {
      // console.log("data y node", value, currentNode)
      saveRegister(url, value)
    };
  };

  const saveRegister = async (url, data) => {
    data.node = currentNode.id;
    setLoading(true);
    try {
      await WebApiPeople.createRegisterCatalogs("/business/work-title/", data);
      props
        .getWorkTitle(currentNode.id)
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
      department: item.department.id,
      job: item.job.id,
      level: item.level.id,
      salary: item.salary,
      work_title_report: item.work_title_report
        ? item.work_title_report.id
        : null,
      vacancy: item.vacancy ? item.vacancy.vacancy_numbers : "",
    });
  };

  const updateRegister = async (url, value) => {
    value.node = currentNode.id;
    try {
      await WebApiPeople.updateRegisterCatalogs(
        `/business/work-title/${id}/`,
        value
      );
      props
        .getWorkTitle(currentNode.id)
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
      await WebApiPeople.deleteRegisterCatalogs(deleted.url + `${deleted.id}/`);
      props
        .getWorkTitle(currentNode.id)
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
        onFinish={(values) => onFinishForm(values, "/business/work-title/")}
      >
        <Row gutter={20}>
          <Col lg={8} xs={22} md={12}>
            <Form.Item name="name" label="Nombre" rules={[ruleRequired]}>
              <Input />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <SelectDepartment rules={[ruleRequired]} />
          </Col>
          <Col lg={8} xs={22} md={12}>
            <SelectJob rules={[ruleRequired]} />
          </Col>
          {/* <Col lg={8} xs={22} md={12}>
            <SelectWorkTitle
              labelText={"Plaza a la que reporta"}
              name={"work_title_report"}
              forDepto={true}
            />
          </Col> */}
          <Col lg={8} xs={22} md={12}>
            <SelectLevel textLabel={"Nivel"} rules={[ruleRequired]} />
          </Col>
          {/* <Col lg={8} xs={22} md={12}>
            <Form.Item name="vacancy" label="Vacantes">
              <Input type="number" min={1} defaultValue={1} />
            </Form.Item>
          </Col> */}
          <Col lg={8} xs={22} md={12}>
            <Form.Item name="salary" label="Salario">
              <Input prefix={"$"} type="number" min={0} defaultValue={0} />
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

export default connect(mapState, { getWorkTitle })(WorkTitle);

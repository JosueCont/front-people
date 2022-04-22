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
  Select,
  Tabs,
  Switch,
} from "antd";
import { ruleRequired } from "../../utils/rules";
import { connect } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  messageDeleteSuccess,
  messageError,
  messageSaveSuccess,
  messageUpdateSuccess,
} from "../../utils/constant";
import { doFiscalCatalogs } from "../../redux/fiscalDuck";
import WebApiFiscal from "../../api/WebApiFiscal";

const InternalConcepts = ({ permissions, currentNode, ...props }) => {
  const { TabPane } = Tabs;
  const { Title } = Typography;
  const [edit, setEdit] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState({});
  const [id, setId] = useState("");
  const [catalog, setCat] = useState(null);
  const [key, setKey] = useState(1);
  const [intConcept, setIntConcept] = useState(false);
  let url = "internal-perception-type/";
  const columns = [
    {
      title: "Codigo",
      dataIndex: "code",
    },
    {
      title: "Nombre",
      dataIndex: "description",
    },

    {
      title: "Acciones",
      render: (item) => {
        return (
          <div>
            {item.node != null && (
              <Row gutter={16}>
                {permissions.edit && (
                  <Col className="gutter-row" offset={1}>
                    <EditOutlined onClick={() => editRegister(item)} />
                  </Col>
                )}
                {permissions.delete && (
                  <Col className="gutter-row" offset={1}>
                    <DeleteOutlined
                      onClick={() => {
                        setDeleteRegister({
                          id: item.id,
                        });
                      }}
                    />
                  </Col>
                )}
              </Row>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    resetForm();
    setIntConcept(false);
    if (key == 1) {
      url = "internal-perception-type/";
      setCat(props.perceptions_int.filter((item) => item.node != null));
    }
    if (key == 2) {
      url = "internal-deduction-type/";
      setCat(props.deductions_int.filter((item) => item.node != null));
    }
    if (key == 3) {
      url = "internal-other-payment-type/";
      setCat(props.other_payments_int.filter((item) => item.node != null));
    }
  }, [key]);

  useEffect(() => {
    if (props.perceptions_int) {
      setCat(props.perceptions_int.filter((item) => item.node != null));
    }
  }, [props.perceptions_int]);

  const resetForm = () => {
    form.resetFields();
    setEdit(false);
    setId("");
  };

  const onFinishForm = (value) => {
    value.node = currentNode.id;
    if (edit) {
      updateRegister(value);
    } else saveRegister(value);
  };

  const saveRegister = async (data) => {
    setLoading(true);
    try {
      await WebApiFiscal.crudInternalConcept(url, "post", data);
      props
        .doFiscalCatalogs(currentNode.id)
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
      code: item.code,
      description: item.description,
      data_type: item.data_type,
      perception_type: item.perception_type.id,
    });
  };

  const updateRegister = async (value) => {
    try {
      delete value["id"];
      delete value[""];
      await WebApiFiscal.crudInternalConcept(`${url}${id}/`, "put", value);
      props
        .doFiscalCatalogs(currentNode.id)
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
      await WebApiFiscal.crudInternalConcept(`${url}${deleted.id}/`, "delete");
      props
        .doFiscalCatalogs(currentNode.id)
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

  const dataType = [
    { value: 1, label: "Monto" },
    { value: 2, label: "Dato" },
  ];

  const RenderSelect = ({ data }) => {
    return (
      <Form.Item
        name={
          key == 1
            ? "perception_type"
            : key == 2
            ? "deduction_type"
            : "other_payment_type"
        }
        label={key == 1 ? "Percepcion" : key == 2 ? "Deduccion" : "Otro pago"}
        rules={[ruleRequired]}
      >
        <Select
          options={data.map((item) => {
            return { value: item.id, label: item.description };
          })}
        />
      </Form.Item>
    );
  };

  const RenderForm = () => {
    // resetForm();
    return (
      <Form
        style={{ marginTop: "10px" }}
        layout={"vertical"}
        form={form}
        onFinish={onFinishForm}
      >
        <Row gutter={20}>
          <Col lg={6} xs={22} md={12}>
            <Form.Item name="code" label="Codigo" rules={[ruleRequired]}>
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} md={12}>
            <Form.Item name="description" label="Nombre" rules={[ruleRequired]}>
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} md={12}>
            <Form.Item
              name="data_type"
              label="Tipo de dato"
              rules={[ruleRequired]}
            >
              <Select options={dataType} />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} md={12}>
            <RenderSelect
              data={
                key == 1
                  ? props.cat_perceptions
                  : key == 2
                  ? props.cat_deductions
                  : props.cat_other_payments
              }
            />
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
        </Row>{" "}
        <Row justify={"start"} gutter={20} style={{ marginBottom: 20 }}>
          <Col>
            <Switch
              title="Conceptos del sistema"
              defaultChecked={intConcept}
              onChange={(value) => setIntConcept(value)}
            />
            <b>Ver conceptos del sistema</b>
          </Col>
        </Row>
      </Form>
    );
  };

  useEffect(() => {
    if (intConcept)
      setCat(
        key == 1
          ? props.perceptions_int
          : key == 2
          ? props.deductions_int
          : props.other_payments_int
      );
    else
      setCat(
        key == 1
          ? props.perceptions_int.filter((item) => item.node != null)
          : key == 2
          ? props.deductions_int.filter((item) => item.node != null)
          : props.other_payments_int.filter((item) => item.node != null)
      );
  }, [intConcept]);

  return (
    <>
      {edit ? <Title style={{ fontSize: "20px" }}>Editar</Title> : <></>}
      <Tabs
        defaultActiveKey="1"
        type="card"
        size={"small"}
        onChange={(value) => setKey(parseInt(value))}
      >
        <TabPane tab="Percepciones" key={"1"}>
          {key == 1 && <RenderForm />}
        </TabPane>
        <TabPane tab="Deducciones" key={"2"}>
          {key == 2 && <RenderForm />}
        </TabPane>
        <TabPane tab="Otros pagos" key={"3"}>
          {key == 3 && <RenderForm />}
        </TabPane>
      </Tabs>

      <Spin tip="Cargando..." spinning={loading}>
        <Table
          columns={columns}
          dataSource={catalog}
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
    perceptions_int: state.fiscalStore.perceptions_int,
    deductions_int: state.fiscalStore.deductions_int,
    other_payments_int: state.fiscalStore.other_payments_int,
    cat_perceptions: state.fiscalStore.cat_perceptions,
    cat_deductions: state.fiscalStore.cat_deductions,
    cat_other_payments: state.fiscalStore.cat_other_payments,
  };
};

export default connect(mapState, { doFiscalCatalogs })(InternalConcepts);

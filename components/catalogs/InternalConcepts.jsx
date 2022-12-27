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
import {showHideMessage} from "../../redux/NotificationDuck";

const InternalConcepts = ({ permissions, currentNode,showHideMessage, ...props }) => {
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
  //const apply_assimilated = Form.useWatch('apply_assimilated', form);
  const [url, setUrl] = useState("internal-perception-type/");


  const columns = [
    {
      title: "Código",
      dataIndex: "code",
    },
    {
      title: "Nombre",
      dataIndex: "description",
    },
    {
      title: "Código SAT",
      render: (item) => {
        return (
          <div>
            {item.perception_type != null && <>{item.perception_type.code}</>}

            {item.deduction_type != null && <>{item.deduction_type.code}</>}
            {item.other_type_payment != null && (
              <>{item.other_type_payment.code}</>
            )}
          </div>
        );
      },
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
      setUrl("internal-perception-type/");
      setCat(props.perceptions_int.filter((item) => item.node != null));
    }
    if (key == 2) {
      setUrl("internal-deduction-type/");
      setCat(props.deductions_int.filter((item) => item.node != null));
    }
    if (key == 3) {
      setUrl("internal-other-payment-type/");
      setCat(props.other_payments_int.filter((item) => item.node != null));
    }
  }, [key]);


  useEffect(() => {
    if (
      (props.perceptions_int, props.deductions_int, props.other_payments_int)
    ) {
      if (key == 1)
        setCat(props.perceptions_int.filter((item) => item.node != null));
      if (key == 2)
        setCat(props.deductions_int.filter((item) => item.node != null));
      if (key == 3)
        setCat(props.other_payments_int.filter((item) => item.node != null));
    }
  }, [props.perceptions_int, props.deductions_int, props.other_payments_int]);

  const resetForm = () => {
    form.resetFields();
    setEdit(false);
    setId("");
  };

  const onFinishForm = (value) => {
    /**
     * Validamos que no puedan meter datos con puros espacios
     */
    if (!(value?.description && value.description.trim())) {
      form.setFieldsValue({ description: undefined });
      value.description = undefined;
    }

    if (!(value?.code && value.code.trim())) {
      form.setFieldsValue({ code: undefined });
      value.code = undefined;
    }
    /**
     * Validamos que no puedan meter datos con puros espacios
     */

    if (value.description === undefined || value.code === undefined) {
      form.validateFields();
      return;
    }

    console.log(value);
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
        .doFiscalCatalogs(currentNode.id, props.version_cfdi)
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
      let  msg = "Ocurrio un error intente de nuevos.";
      if(error.response?.data?.message){
        msg = error.response?.data?.message
      }
      message.error(msg);
    }
  };

  const editRegister = (item, param) => {
    setEdit(true);
    setId(item.id);

    if (key == 1) {
      form.setFieldsValue({
        code: item.code,
        description: item.description,
        data_type: item.data_type,
        perception_type: item.perception_type.id,
        show: item.show,
        is_salary: item.is_salary,
        is_holiday: item.is_holiday,
        is_rest_day: item.is_rest_day,
        is_seventh_day: item.is_seventh_day,
        apply_assimilated: item.apply_assimilated
      });
    } else if (key == 2) {
      form.setFieldsValue({
        code: item.code,
        description: item.description,
        data_type: item.data_type,
        deduction_type: item.deduction_type.id,
        apply_assimilated: item.apply_assimilated,
        show: item.show,
      });
    } else if (key == 3) {
      form.setFieldsValue({
        code: item.code,
        description: item.description,
        data_type: item.data_type,
        apply_assimilated: item.apply_assimilated,
        other_type_payment: item.other_type_payment.id,
        show: item.show,
      });
    }
  };

  const updateRegister = async (value) => {
    try {
      delete value["id"];
      delete value[""];
      await WebApiFiscal.crudInternalConcept(`${url}${id}/`, "put", value);
      props
        .doFiscalCatalogs(currentNode.id, props.version_cfdi)
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
      let  msg = "Ocurrio un error intente de nuevos.";
      if(error.response?.data?.message){
        msg = error.response?.data?.message
      }
      message.error(msg);

      // showHideMessage(true, {
      //   title:msg,
      //   level:'error',
      //   type:2
      // })

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
      await WebApiFiscal.crudInternalConcept(`${url}${deleted.id}/`, "delete");
      props
        .doFiscalCatalogs(currentNode.id, props.version_cfdi)
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
          key === 1
            ? "perception_type"
            : key === 2
            ? "deduction_type"
            : "other_type_payment"
        }
        label={key === 1 ? "Percepción" : key === 2 ? "Deducción" : "Otro pago"}
        rules={[ruleRequired
         //  ,{
         //  validator(_, value) {
         //    let item = data.find((it)=> it.id === value)
         //    if (apply_assimilated && !item?.is_assimilated) {
         //      return Promise.reject('Este concepto no aplica para asimilado.');
         //    }
         //    if(!apply_assimilated && !item?.is_payroll){
         //      return Promise.reject('Este concepto no aplica para nómina.');
         //    }
         //    return Promise.resolve();
         //  },
         // },
        ]}
      >
        <Select
          showSearch
          optionFilterProp="children"
          allowClear
          notFoundContent={"No se encontraron resultados."}
        >
          {data.map((item) => {
            return (
              <>
                <Option key={item.id} value={item.id}>
                  {item.description} { item && item.is_assimilated && `(Aplica a asimilado)`}
                </Option>
                ;
              </>
            );
          })}
        </Select>
      </Form.Item>
    );
  };

  const RenderForm = ({ percepciones }) => {
    return (
      <>
        <Row gutter={20}>
          <Col lg={6} xs={22} md={12}>
            <Form.Item name="code" label="Código" rules={[ruleRequired]}>
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
          <Col lg={percepciones? 12 : 6} xs={22} md={percepciones? 24 : 12}>
            <RenderSelect
              data={
                key == 1
                  ? props.cat_perceptions.filter(
                      (item) => item.code != "046" //&& item.code != "001"
                    )
                  : key == 2
                  ? props.cat_deductions
                  : // .filter(
                    //     (item) => item.code != "001" && item.code != "002"
                    //   )
                    props.cat_other_payments
              }
            />
          </Col>
          <Col lg={6} xs={22} md={12}>
            <Form.Item
              name="show"
              label="Mostrar para calcular"
              valuePropName="checked"
            >
              <Switch defaultChecked />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} md={12}>
            <Form.Item
                name="apply_assimilated"
                label="Aplica asimilado"
                valuePropName="checked"
            >
              <Switch  />
            </Form.Item>
          </Col>
          {
            key === 1 &&
                <Col lg={6} xs={22} md={12}>
                  <Form.Item
                      name="is_salary"
                      label="¿Es sueldo?"
                      valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
          }

        </Row>
        {
          key === 1 && <Row>
              <Col lg={6} xs={22} md={12}>
                <Form.Item
                    name="is_holiday"
                    label="¿Es festivo?"
                    valuePropName="checked"
                >
                  <Switch  />
                </Form.Item>
              </Col>

              <Col lg={6} xs={22} md={12}>
                <Form.Item
                    name="is_rest_day"
                    label="¿Es descanso?"
                    valuePropName="checked"
                >
                  <Switch  />
                </Form.Item>
              </Col>

              <Col lg={6} xs={22} md={12}>
                <Form.Item
                    name="is_seventh_day"
                    label="¿Es séptimo día?"
                    valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>



            </Row>
        }



        <Row justify={"end"} gutter={20} style={{ marginBottom: 20 }}>
          <Col>
            <Button loading={loading} onClick={resetForm}>Cancelar</Button>
          </Col>
          <Col>
            <Button loading={loading} type="primary" htmlType="submit">
              Guardar
            </Button>
          </Col>
        </Row>
        <Row justify={"start"} gutter={20} style={{ marginBottom: 20 }}>
          <Col>
            <b>Ver conceptos del sistema </b>
            <Switch
              title="Conceptos del sistema"
              defaultChecked={intConcept}
              onChange={(value) => setIntConcept(value)}
            />
          </Col>
        </Row>
      </>
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
          {key == 1 && (
            <Form
              style={{ marginTop: "10px" }}
              layout={"vertical"}
              form={form}
              onFinish={onFinishForm}
            >
              <RenderForm  percepciones />
            </Form>
          )}
        </TabPane>
        <TabPane tab="Deducciones" key={"2"}>
          {key == 2 && (
            <Form
              style={{ marginTop: "10px" }}
              layout={"vertical"}
              form={form}
              onFinish={onFinishForm}
            >
              <RenderForm />
            </Form>
          )}
        </TabPane>
        <TabPane tab="Otros pagos" key={"3"}>
          {key == 3 && (
            <Form
              style={{ marginTop: "10px" }}
              layout={"vertical"}
              form={form}
              onFinish={onFinishForm}
            >
              <RenderForm />
            </Form>
          )}
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
    version_cfdi: state.fiscalStore.version_cfdi,
  };
};

export default connect(mapState, { doFiscalCatalogs, showHideMessage })(InternalConcepts);

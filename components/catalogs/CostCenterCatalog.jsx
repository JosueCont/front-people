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
  Switch,
  ConfigProvider
} from "antd";
import { ruleRequired } from "../../utils/rules";
import { connect } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { getCostCenter } from "../../redux/catalogCompany";
import WebApiPeople from "../../api/WebApiPeople";
import {
  messageDeleteSuccess,
  messageError,
  messageSaveSuccess,
  messageUpdateSuccess,
} from "../../utils/constant";
import esES from "antd/lib/locale/es_ES";

const UrlModel = "/payroll/cost-center/";

const CostCenterCatalog = ({ permissions, currentNode,cat_cost_center,getCostCenter, ...props }) => {
  const { Title } = Typography;

  const [edit, setEdit] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState({});
  const [id, setId] = useState("");


  const colsCenterCost = [
    {
      title: "Código",
      dataIndex: "code",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "key",
    },
    {
      title: "Acciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>

                <Col className="gutter-row" offset={1}>
                  <EditOutlined onClick={() => editRegister(item, "td")} />
                </Col>

                <Col className="gutter-row" offset={1}>
                  <DeleteOutlined
                    onClick={() => {
                      setDeleteRegister({
                        id: item.id,
                        url: UrlModel,
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


  useEffect(()=>{
    getCostCenter(currentNode.id)
  },[])


  const resetForm = () => {
    form.resetFields();
    setEdit(false);
    setId("");
  };

  const onFinishForm = (value) => {
    /**
     * Validamos que no puedan meter datos con puros espacios
     */
    if(!(value?.description && value.description.trim())){
      form.setFieldsValue({description:undefined})
      value.description=undefined
    }

    if(!(value?.code && value.code.trim())){
      form.setFieldsValue({code:undefined})
      value.code=undefined
    }
    /**
     * Validamos que no puedan meter datos con puros espacios
     */

    if(value.code===undefined || value.description===undefined){
      form.validateFields()
      return
    }

    value.node = currentNode.id;

    if (edit) {
      updateRegister(value);
    } else saveRegister(value);
  };

  const saveRegister = async (data) => {
    data.node = currentNode.id;
    setLoading(true);
    try {
      let response = await WebApiPeople.createRegisterCatalogs(
        UrlModel,
        data
      );

      getCostCenter(currentNode.id)
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
      node: item.node,
      description: item.description,
      code: item.code,
    });
  };

  const updateRegister = async (value) => {
    try {
      let response = await WebApiPeople.updateRegisterCatalogs(
        UrlModel+`${id}/`,
        value
      );
      getCostCenter(currentNode.id)
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
      let response = await WebApiPeople.deleteRegisterCatalogs(
        UrlModel + `${deleted.id}/`
      );
        getCostCenter(currentNode.id)
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
      {edit && <Title style={{ fontSize: "20px" }}>Editar</Title>}
        <Form
          layout={"vertical"}
          form={form}
          onFinish={(values) =>
            onFinishForm(
              values
            )
          }
        >
          <Row>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="code" label="Código" rules={[ruleRequired]}>
                <Input />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="description" label="Descripción" rules={[ruleRequired]}>
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
        <ConfigProvider locale={esES}>
        <Table
          columns={colsCenterCost}
          dataSource={cat_cost_center}
          pagination={{showSizeChanger:true}}
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
    cat_cost_center: state.catalogStore.cat_cost_center,
  };
};

export default connect(mapState, { getCostCenter })(CostCenterCatalog);

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
  ConfigProvider
} from "antd";
import { ruleRequired } from "../../utils/rules";
import { connect } from "react-redux";
import { getPersonType } from "../../redux/catalogCompany";
import WebApiPeople from "../../api/WebApiPeople";
import {
  messageDeleteSuccess,
  messageError,
  messageSaveSuccess,
  messageUpdateSuccess,
} from "../../utils/constant";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import esES from "antd/lib/locale/es_ES";

const PersonTypes = ({  currentNode, ...props }) => {
  const { Title } = Typography;
  const { TabPane } = Tabs;

  const [edit, setEdit] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState({});
  const [id, setId] = useState("");

  const colTypePerson = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "key",
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
                <Col className="gutter-row" offset={1}>
                  <EditOutlined onClick={() => editRegister(item, "tp")} />
                </Col>
                <Col className="gutter-row" offset={1}>
                  <DeleteOutlined
                    onClick={() => {
                      setDeleteRegister({
                        id: item.id,
                        url: "/person/person-type/",
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

    /**
     * Validamos que no puedan meter datos con puros espacios
     */
    if(!(value?.name && value.name.trim())){
      form.setFieldsValue({name:undefined})
      value.name=undefined
    }

    if(!(value?.code && value.code.trim())){
      form.setFieldsValue({code:undefined})
      value.code=undefined
    }
    /**
     * Validamos que no puedan meter datos con puros espacios
     */

    if(value.name===undefined || value.code===undefined){
      form.validateFields()
      return
    }

    if (edit) {
      updateRegister(url, value);
    } else saveRegister(url, value);
  };

  const saveRegister = async (url, data) => {
    data.node = currentNode.id;
    setLoading(true);
    try {
      let response = await WebApiPeople.createRegisterCatalogs(
        "/person/person-type/",
        data
      );
      props
        .getPersonType(currentNode.id)
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
      let response = await WebApiPeople.updateRegisterCatalogs(
        `/person/person-type/${id}/`,
        value
      );
      props
        .getPersonType(currentNode.id)
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

  useEffect(()=>{
    props.getPersonType(currentNode.id)
  },[])

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
        deleted.url + `${deleted.id}/`
      );
      props
        .getPersonType(currentNode.id)
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
          onFinish={(values) => onFinishForm(values, "/person/person-type/")}
        >
          <Row>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="name" label="Nombre" rules={[ruleRequired]}>
                <Input />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="code" label="Código" rules={[ruleRequired]}>
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
          columns={colTypePerson}
          dataSource={props.cat_person_type}
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
    cat_person_type: state.catalogStore.cat_person_type,
  };
};

export default connect(mapState, { getPersonType })(PersonTypes);

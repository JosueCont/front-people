import React, { useState, useEffect } from "react";
import {
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
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Title from "antd/lib/skeleton/Title";
import SelectLevel from "../selects/SelectLevel";
import { getLevel } from "../../redux/catalogCompany";
import {
  messageDeleteSuccess,
  messageError,
  messageSaveSuccess,
  messageUpdateSuccess,
} from "../../utils/constant";
import WebApiPeople from "../../api/WebApiPeople";
import esES from "antd/lib/locale/es_ES";

const Levels = ({ currentNode, ...props }) => {
  const [edit, setEdit] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState({});
  const [id, setId] = useState("");

  useEffect(() => {}, [props.cat_levels]);

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "key",
    },
    {
      title: "Nivel que precede",
      dataIndex: "order",
      key: "order",
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
                      url: "/business/level/",
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

    if(value.name===undefined){
      form.validateFields()
      return
    }


    if (edit) {
      updateRegister(url, value);
    } else saveRegister(url, value);
  };

  const saveRegister = async (url, data) => {
    data.node = currentNode.id;
    if(data.order===0){
      data.order = data.order + 1;
    }
    else if (!data.order || data.order === undefined) delete data.order;
    else data.order = data.order + 1;
    setLoading(true);
    try {
      let response = await WebApiPeople.createRegisterCatalogs(
        "/business/level/",
        data
      );
      props
        .getLevel(currentNode.id)
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
      order: item.order > 0 ? item.order - 1 : null,
    });
  };

  const updateRegister = async (url, value) => {
    try {
      if(value.order===0){
        value.order = value.order + 1;
      }
      else if (!value.order || value.order == undefined) value.order = 0;
      let response = await WebApiPeople.updateRegisterCatalogs(
        `/business/level/${id}/`,
        value
      );
      props
        .getLevel(currentNode.id)
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
        deleted.url + `${deleted.id}/`
      );
      props
        .getLevel(currentNode.id)
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
        onFinish={(values) => onFinishForm(values, "/business/level/")}
      >
        <Row gutter={20}>
          <Col lg={6} xs={22}>
            <Form.Item name="name"   label="Nombre" rules={[ruleRequired]}>
              <Input maxLength={100} />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22}>
            <SelectLevel
              name={"order"}
              value_form={"order"}
              textLabel={"Nivel que precede"}
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
        </Row>
      </Form>
      <Spin tip="Cargando..." spinning={loading}>
        <ConfigProvider locale={esES}>
        <Table
          columns={columns}
          dataSource={props.cat_levels}
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

const mapSate = (state) => {
  return {
    cat_levels: state.catalogStore.cat_level,
  };
};

export default connect(mapSate, { getLevel })(Levels);

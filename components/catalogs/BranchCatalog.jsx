import React, { useEffect, useState } from "react";
import {
  Form,
  Table,
  Button,
  Row,
  Col,
  Input,
  message,
  Modal,
  Spin,
  ConfigProvider
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@material-ui/icons";
import WebApiPeople from "../../api/WebApiPeople";
import { connect } from "react-redux";
import { getBranches } from "../../redux/catalogCompany";
import {
  messageDeleteSuccess,
  messageError,
  messageSaveSuccess,
  messageUpdateSuccess,
} from "../../utils/constant";
import { ruleRequired, ruleWhiteSpace } from "../../utils/rules";
import SelectPatronalRegistration from "../selects/SelectPatronalRegistration";
import esES from "antd/lib/locale/es_ES";

const BranchCatalog = ({
  getBranches,
  cat_branches,
  currentNode,
  errorData,
  ...props
}) => {
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState("");
  const [deleted, setDeleted] = useState({});
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Código",
      dataIndex: "code",
      responsive: ['lg']
    },
    {
      title: "Sucursal",
      dataIndex: "name",
      key: "key",
      responsive: ['lg']
    },
    {
      title: "Registro Patronal",
      dataIndex: ["patronal_registration", "code"],
      responsive: ['lg']
    },
    {
      title: "Acciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" offset={1}>
                <EditOutlined style={{cursor:'pointer'}}  onClick={() => editBranch(item, "td")} />
              </Col>

              <Col className="gutter-row" offset={1}>
                <DeleteOutlined
                  style={{cursor:'pointer'}}
                  onClick={() => {
                    setDeleteRegister({
                      id: item.id,
                      name: item.name,
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

  useEffect(() => {
    getBranches(currentNode.id);
  }, []);

  useEffect(() => {}, [cat_branches]);

  const resetForm = () => {
    form.resetFields();
  };

  const onFinishForm = (values) => {
    values.patronal_registration = values.patronal_registration ?? "";
    values.node = currentNode.id;

    if (isEdit) {
      updateBranch(values);
    } else {
      saveBranch(values);
    }
  };

  const saveBranch = async (data) => {
    setLoading(true);
    try {
      await WebApiPeople.saveBranch(data);
      getBranches(currentNode.id);
      resetForm();
      message.success(messageSaveSuccess);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", JSON.stringify(errorData));
      message.error(messageError);
    }
    setLoading(false);
  };

  const editBranch = (item) => {
    setIsEdit(true);
    setId(item.id);
    form.setFieldsValue({
      node: currentNode.id,
      name: item.name,
      code: item.code,
      patronal_registration: item.patronal_registration?.id,
    });
  };

  const updateBranch = async (data) => {
    setLoading(true);
    try {
      await WebApiPeople.updateBranch(id, data);
      getBranches(currentNode.id);
      resetForm();
      setIsEdit(false);
      message.success(messageUpdateSuccess);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", JSON.stringify(errorData));
      message.error(messageError);
    }
  };

  const setDeleteRegister = (data) => {
    setDeleted(data);
  };

  useEffect(() => {
    if (deleted) {
      if (deleted.id) {
        Modal.confirm({
          title: "¿Está seguro de eliminar este registro?",
          content: "Si lo elimina no podrá recuperarlo",
          cancelText: "Cancelar",
          okText: "Sí, eliminar",
          onOk: () => {
            deleteRegister();
          },
        });
      }
    }
  }, [deleted]);

  const deleteRegister = async () => {
    setLoading(true);
    try {
      await WebApiPeople.deleteBranch(deleted.id);
      getBranches(currentNode.id);
      resetForm();
      message.success(messageDeleteSuccess);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", JSON.stringify(errorData));
      message.error(messageError);
    }
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinishForm}>
        <Row gutter={20}>
          <Col lg={6} xs={22} md={12} xl={6}>
            <Form.Item
              name="code"
              label="Código"
              rules={[ruleRequired, ruleWhiteSpace]}
            >
              <Input maxLength={50}/>
            </Form.Item>
          </Col>
          <Col lg={10} xs={22} md={12} xl={9}>
            <Form.Item
              name="name"
              label="Nombre de la Sucursal"
              rules={[ruleRequired, ruleWhiteSpace]}
            >
              <Input  maxLength={100}/>
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} md={12} xl={6}>
            <SelectPatronalRegistration
              name={"patronal_registration"}
              value_form={"patronal_registration"}
              textLabel={"Registro"}
              currentNode={currentNode}
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
        <Table columns={columns} dataSource={cat_branches} pagination={{showSizeChanger:true}} />
        </ConfigProvider>
      </Spin>
    </>
  );
};

const mapState = (state) => {
  return {
    cat_branches: state.catalogStore.cat_branches,
    errorData: state.catalogStore.errorData,
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState, { getBranches })(BranchCatalog);

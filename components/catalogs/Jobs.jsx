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
  ConfigProvider
} from "antd";
import { ruleRequired } from "../../utils/rules";
import { connect } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { getJobs } from "../../redux/catalogCompany";
import WebApiPeople from "../../api/WebApiPeople";
import {
  messageDeleteSuccess,
  messageError,
  messageSaveSuccess,
  messageUpdateSuccess,
} from "../../utils/constant";
import ListCatalogData from "../forms/ListCatalogData";
import SelectCostCenter from "../selects/SelectCostCenter";
import SelectTags from "../selects/SelectTags";
import SelectProfile from "../selects/SelectProfile";
import esES from "antd/lib/locale/es_ES";

const TabJobs = ({  currentNode, ...props }) => {
  const { Title } = Typography;

  const [edit, setEdit] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState({});
  const [id, setId] = useState("");  

  const colJob = [
    {
      title: "Nombre",
      show: true,
      render: (item) => {
        return <>{item.name}</>;
      },
      key: "key",
    },
    {
      title: "Código",
      show: true,
      render: (item) => {
        return <>{item.code}</>;
      },
    },
    {
      title: "Centro de costos",
      dataIndex: "cost_center",
      show: true,
      render:(item)=>{
        return <ListCatalogData catalog={'cat_cost_center'} attrName={'code'} items={item} />
      }
    },
    {
      title: "Etiquetas",
      dataIndex: "tag",
      show: true,
      render:(item)=>{
        return <ListCatalogData catalog={'cat_tags'} attrName={'name'} items={item} />
      }
    },
    {
      title: "Perfil de competencias",
      dataIndex: ["skill_profile","name"],
      show: props.config.kuiz_enabled
    },
    {
      title: "Acciones",
      show: true,
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
     if(!(value?.skill_profile_id && value.skill_profile_id.trim())){
      form.setFieldsValue({skill_profile_id:undefined})
      value.skill_profile_id=undefined
     }
    /**
     * Validamos que no puedan meter datos con puros espacios
     */

    if(value.name===undefined ||
      value.code===undefined
    ){
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
      skill_profile_id: item.skill_profile?.id,
      cost_center: item?.cost_center,
      tag: item?.tag
    });
  };

  const updateRegister = async (url, value) => {
    try {
      let response = await WebApiPeople.updateRegisterCatalogs(
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
          onFinish={(values) =>
            onFinishForm(values, `/business/job/?node=${currentNode.id}`)
          }
        >
          <Row gutter={20}>
            <Col lg={6} xs={22} md={12}>
              <Form.Item name="name" label="Nombre" rules={[ruleRequired]}>
                <Input maxLength={150} />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} md={12}>
              <Form.Item name="code" label="Código" rules={[ruleRequired]}>
                <Input maxLength={150}/>
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} md={12}>
              <SelectCostCenter required={false} multiple={true} viewLabel={'Centro de costos'}/>
            </Col>
            <Col lg={6} xs={22} md={12}>
              <SelectTags required={false} multiple={true} viewLabel={'Etiquetas'}/>
            </Col>
            {props.config.kuiz_enabled &&(
              <Col lg={6} xs={22} md={12}>
                <SelectProfile curretNode={currentNode}/>
              </Col>
            )}
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
          columns={colJob.filter(col => col.show)}
          dataSource={props.cat_job}
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
    cat_job: state.catalogStore.cat_job,
    config: state.userStore.general_config,
  };
};

export default connect(mapState, { getJobs })(TabJobs);
import React, {useState, useEffect} from "react";
import MainLayout from "../../layout/MainLayout";
import {useRouter} from "next/router";
import {Form, Input, Table, Breadcrumb, Button, Row, Col, Modal, message, Switch} from "antd";
import {SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {withAuthSync} from "../../libs/auth";
import jsCookie from "js-cookie";
import FormAssessment from "../../components/assessment/forms/FormAssessment";
import {connect, useDispatch} from "react-redux";
const {confirm} = Modal;
import {types} from "../../types/assessments";
import {assessmentModalAction, assessmentDeleteAction, assessmentStatusAction} from "../../redux/assessmentDuck"
import {useFilter} from "../../components/assessment/useFilter";

const AssessmentScreen = ({assessmentStore, ...props}) => {

  const dispatch = useDispatch();
  const router = useRouter();
  const [form] = Form.useForm();
  
  const [permissions, setPermissions] = useState({ view: true, create: true, edit: true, delete: true });
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateAssessment, setShowCreateAssessment] = useState(false);
  const [showUpdateAssessment, setShowUpdateAssessment] = useState(false);
  const [assessmentData, setAssessmentData] = useState(false);
  const [filterValues, filterActive, filterString, onFilterChange, onFilterActive, onFilterReset] = useFilter();
  
  useEffect(() => {
    console.log("ENCUESTAS::", assessmentStore.assessments);
    setAssessments(assessmentStore.assessments);
    setLoading(assessmentStore.fetching);
    assessmentStore.active_modal === types.CREATE_ASSESSMENTS ? setShowCreateAssessment(true) : setShowCreateAssessment(false);
    assessmentStore.active_modal === types.UPDATE_ASSESSMENTS ? setShowUpdateAssessment(true) : setShowUpdateAssessment(false);
  }, [assessmentStore]);

  const HandleCreateAssessment = () => {
    setAssessmentData(false);
    dispatch(assessmentModalAction(types.CREATE_ASSESSMENTS));
  };

  const HandleUpdateAssessment = (item) => {
    setAssessmentData(item);
    dispatch(assessmentModalAction(types.UPDATE_ASSESSMENTS));
  };

  const HandleDeleteAssessment = (id) => {
    confirm({
      title: "¿Está seguro de eliminar este cuestionario?",
      icon: <ExclamationCircleOutlined />,
      content: "Si lo elimina no podrá recuperarlo",
      onOk() {
        props.assessmentDeleteAction(id).then(response =>{
          response ? message.success("Eliminado correctamente") : message.error("Hubo un error");
        }).catch(e => {
          message.error("Hubo un error");
        });
      },
      okType: "primary",
      okText: "Eliminar",
      cancelText: "Cancelar",
      okButtonProps: {
        danger: true,
      },
    });
  };

  const HandleFilterReset = (assessments) => {
    form.resetFields();
    onFilterReset(assessments)
  }

  const HandleChangeStatus = (value) => {
    value.is_active ? (value.is_active = false) : (value.is_active = true);
    props.assessmentStatusAction(value.id, value.is_active).then( response => {
      response ? message.success("Estatus Actualizado") : message.error("Ocurrio un error intente de nuevo.");
    }).catch( e => {
      message.error("Hubo un error");
    });
  };

  const columns = [
    {
      title: "Nombre",
      render: (item) => {
        return (
        <div>
           <div
            className={"pointer"}
            key= {"name-" + item.id}
            onClick={() => {
              router.push({
                pathname: "/assessment/detail",
                query: { id: item.id },
              }) 
            }}
          > {item.name} </div> 
        </div>);
      },
    },
    {
      title: "Categoría",
      render: (item) => {
        return <div key= {"category-" + item.id}>{ item.category === "A" ? "Assessment" : "Quiz"}</div>;
      },
    },
    {
      title: "Estatus",
      render: (item) => {
        return (
          <>
            <Switch
              key={"status-"+item.id}
              defaultChecked={item.is_active}
              checkedChildren="Activo"
              unCheckedChildren="Inactivo"
              onChange={() => HandleChangeStatus(item)}
            />
          </>
        );
      },
    },
    {
      title: "Acciones",
      render: (item) => {
        return (
          <>
            <Row key= {"actions-" + item.id}>
              {permissions?.edit && (
                <Col span={6}>
                  <EditOutlined onClick={ () => HandleUpdateAssessment(item) } />
                </Col>
              )}
              {permissions?.delete && (
                <Col span={6}>
                  <DeleteOutlined onClick={ () => HandleDeleteAssessment(item.id)} />
                </Col>
              )}
            </Row>
          </>
        );
      },
    },
  ];

  return (
      <MainLayout currentKey="1">
        <Breadcrumb>
          <Breadcrumb.Item className={"pointer"} onClick={() => router.push({ pathname: "/home" })} > Inicio </Breadcrumb.Item>
          <Breadcrumb.Item> Encuestas </Breadcrumb.Item>
        </Breadcrumb>
        <div className="container" style={{ width: "100%" }}>
          <Row> 
            <Col span={18}>
              <Form
                form={form}
                scrollToFirstError
              >
                <Row>
                  <Col span={16}>
                    <Form.Item name="Filter" label="Filter">
                      <Input placeholder="Filtra las encuestas" maxLength={200} onChange={onFilterChange}/>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <div style={{ float: "left", marginLeft: "5px" }}>
                      <Form.Item>
                        <Button onClick={() => onFilterActive(assessments)} style={{ background: "#fa8c16", fontWeight: "bold", color: "white", }} htmlType="submit" >
                          <SearchOutlined />
                        </Button>
                      </Form.Item>
                    </div>
                    <div style={{ float: "left", marginLeft: "5px" }}>
                      <Form.Item>
                        <Button onClick={() => HandleFilterReset(assessments)} style={{ marginTop: "auto", marginLeft: 10 }}>
                          <SyncOutlined />
                        </Button>
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col span={6} style={{display: "flex", justifyContent: "flex-end"}}>
              {permissions.create && (
                <Button style={{ background: "#fa8c16", fontWeight: "bold", color: "white", }} loading={loading} onClick={() => HandleCreateAssessment()} >
                  <PlusOutlined /> Agregar Encuesta
                </Button>
              )}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Table
                columns={columns}
                dataSource={filterActive ? filterValues : assessments}
                loading={loading}
                locale={{
                  emptyText: loading
                    ? "Cargando..."
                    : "No se encontraron resultados.",
                }}
              />
            </Col>
          </Row>
        </div>
        { showCreateAssessment && (
          <FormAssessment
            title="Agregar nueva encuesta"
            visible= {showCreateAssessment}
            close = {HandleCloseModal}
            loadData = {assessmentData}
          />
        )}
        { showUpdateAssessment && (
          <FormAssessment
            title="Modificar encuesta"
            visible={showUpdateAssessment}
            close = {HandleCloseModal}
            loadData = {assessmentData}
          />
        )}
      </MainLayout>
  );
};

const mapState = (state) => {
  return {
    config: state.userStore.general_config,
    assessmentStore: state.assessmentStore,
  }
}


export default connect(mapState,{assessmentDeleteAction, assessmentStatusAction})(withAuthSync(AssessmentScreen));
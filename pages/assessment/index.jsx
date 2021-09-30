import React, {useState, useEffect} from "react";
import MainLayout from "../../layout/MainLayout";
import {useRouter} from "next/router";
import {Form, Input, Table, Breadcrumb, Button, Row, Col, Modal } from "antd";
import {SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {withAuthSync} from "../../libs/auth";
import jsCookie from "js-cookie";
import FormAssessment from "../../components/assessment/forms/FormAssessment";
import {connect, useDispatch} from "react-redux";
const {confirm} = Modal;
import {types} from "../../types/assessments";
import {assessmentModalAction, assessmentDeleteAction} from "../../redux/assessmentDuck"

//MENSAJES, PERMISOS, FILTROS, ORDEN Y LOADERS

const AssessmentScreen = ({assessmentStore, ...props}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [form] = Form.useForm();
  
  const [permissions, setPermissions] = useState({ view: true, create: true, edit: true, delete: true });
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateAssessment, setShowCreateAssessment] = useState(false);
  const [showUpdateAssessment, setShowUpdateAssessment] = useState(false);
  const [assessmentData, setAssessmentData] = useState(false);

  useEffect(() => {
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
        dispatch(assessmentDeleteAction(id))
      },
      okType: "primary",
      okText: "Eliminar",
      cancelText: "Cancelar",
      okButtonProps: {
        danger: true,
      },
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
                onFinish={()=> console.log(filter)}
                initialValues={{ id: "", name: "", perms: [],}}
                scrollToFirstError
              >
                <Row>
                  <Col span={16}>
                    <Form.Item name="name" label="Nombre">
                      <Input placeholder="Nombre" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <div style={{ float: "left", marginLeft: "5px" }}>
                      <Form.Item>
                        <Button style={{ background: "#fa8c16", fontWeight: "bold", color: "white", }} htmlType="submit" >
                          <SearchOutlined />
                        </Button>
                      </Form.Item>
                    </div>
                    <div style={{ float: "left", marginLeft: "5px" }}>
                      <Form.Item>
                        <Button onClick={() => resetFilter()} style={{ marginTop: "auto", marginLeft: 10 }}>
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
                <Button style={{ background: "#fa8c16", fontWeight: "bold", color: "white", }} onClick={() => HandleCreateAssessment()} >
                  <PlusOutlined /> Agregar Evaluación
                </Button>
              )}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Table
                columns={columns}
                dataSource={assessments}
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
            close = {setShowCreateAssessment}
            loadData = {assessmentData}
          />
        )}
        { showUpdateAssessment && (
          <FormAssessment
            title="Modificar encuesta"
            visible={showUpdateAssessment}
            close = {setShowUpdateAssessment}
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

export default connect(mapState)(withAuthSync(AssessmentScreen));
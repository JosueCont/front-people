import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useRouter } from "next/router";
import {
  Form,
  Input,
  Table,
  Breadcrumb,
  Button,
  Row,
  Col,
  Modal,
  message,
  Switch,
  Dropdown,
  Menu
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  EllipsisOutlined
} from "@ant-design/icons";
import { withAuthSync } from "../../../libs/auth";
import jsCookie from "js-cookie";
import FormAssessment from "../../../components/assessment/forms/FormAssessment";
import { connect, useDispatch } from "react-redux";
const { confirm } = Modal;
import { types } from "../../../types/assessments";
import {
  assessmentModalAction,
  assessmentDeleteAction,
  assessmentStatusAction,
  assessmentLoadAction,
  getCategories
} from "../../../redux/assessmentDuck";
import { useFilter } from "../../../components/assessment/useFilter";
import WebApiAssessment from "../../../api/WebApiAssessment";
import AssessmentsGroup from "../../../components/assessment/groups/AssessmentsGroup";
import { userCompanyId } from "../../../libs/auth";

const AssessmentScreen = ({ assessmentStore, getCategories, ...props }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [form] = Form.useForm();

  // const [permissions, setPermissions] = useState({
  //   view: true,
  //   create: true,
  //   edit: true,
  //   delete: true,
  // });
  const [listCategories, setListCategories] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateAssessment, setShowCreateAssessment] = useState(false);
  const [showUpdateAssessment, setShowUpdateAssessment] = useState(false);
  const [assessmentData, setAssessmentData] = useState(false);
  const [testsSelected, setTestsSelected] = useState([]);
  const [testsKeys, setTestsKeys] = useState([]);
  const [openModalAddGroup, setOpenModalAddGroup] = useState(false);
  const [showModalCreateGroup, setShowModalCreateGroup] = useState(false);
  const [
    filterValues,
    filterActive,
    filterString,
    onFilterChange,
    onFilterActive,
    onFilterReset,
  ] = useFilter();
  const [numPage, setNumPage] = useState(1);

  useEffect(() => {
    let nodeId = userCompanyId();
    props.assessmentLoadAction(nodeId)
    getCategories();
  }, [])

  useEffect(() => {
    if(assessmentStore.assessments?.length > 0){
      setAssessments(assessmentStore.assessments);
      setLoading(assessmentStore.fetching);
      assessmentStore.active_modal === types.CREATE_ASSESSMENTS
        ? setShowCreateAssessment(true)
        : setShowCreateAssessment(false);
      assessmentStore.active_modal === types.UPDATE_ASSESSMENTS
        ? setShowUpdateAssessment(true)
        : setShowUpdateAssessment(false);
    }
  }, [assessmentStore]);

  /* const getCategories = async () =>{
    try {
        let response = await WebApiAssessment.getCategoriesAssessment();
        setListCategories(response.data)
    } catch (e) {
        setListCategories([])
        console.log(e)
    }
} */

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
        props
          .assessmentDeleteAction(id)
          .then((response) => {
            response
              ? message.success("Eliminado correctamente")
              : message.error("Hubo un error");
          })
          .catch((e) => {
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
    setNumPage(1);
    form.resetFields();
    onFilterReset(assessments);
  };
  const onChangeTable =(page)=>{
    setNumPage(page.current);
  }

  const HandleChangeStatus = (value) => {
    value.is_active ? (value.is_active = false) : (value.is_active = true);
    props
      .assessmentStatusAction(value.id, value.is_active)
      .then((response) => {
        response
          ? message.success("Estatus Actualizado")
          : message.error("Ocurrio un error intente de nuevo.");
      })
      .catch((e) => {
        message.error("Hubo un error");
      });
  };

  const HandleCloseModal = () => {
    dispatch(assessmentModalAction(""));
  };

  const getOnlyIds = () => {
    let ids = [];
    testsSelected.map((item) => {
      ids.push(item.id);
    });
    return ids;
  };

  const onFinishCreateGroup = async (values) =>{3
    setLoading(true)
    const body = {...values, node: props.currentNode?.id}
    try {
      await WebApiAssessment.createGroupAssessments(body)
      message.success("Grupo agregado")
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
      message.error("Grupo no agregado")
    }
  };

  const HandleCloseGroup = ()=>{
    setTestsKeys([])
    setTestsSelected([])
    setOpenModalAddGroup(false)
    setShowModalCreateGroup(false)
  }

  useEffect(()=>{
    if(openModalAddGroup){
      if(testsSelected.length > 0){
        if(testsSelected.length >=2){
          setShowModalCreateGroup(true)
        }else{
          setOpenModalAddGroup(false)
          message.error("Selecciona al menos 2 evaluaciones")
        }
      }else{
        message.error("Selecciona las evaluaciones")
        setOpenModalAddGroup(false)
      }
    }
  },[openModalAddGroup])

  const menuTable = () => {
    return (
      <Menu>
        {props.permissions?.delete && (
          <Menu.Item
            key={1}
            icon={<PlusOutlined/>}
            onClick={()=>setOpenModalAddGroup(true)}
          >
            Crear grupo
          </Menu.Item>
        )}
      </Menu>
    );
  };

  const rowSelectionGroup = {
    selectedRowKeys: testsKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setTestsKeys(selectedRowKeys)
      setTestsSelected(selectedRows)
    }
  }

  const columns = [
    {
      title: "Nombre",
      render: (item) => {
        return (
          <div
            className={"pointer"}
            key={"name_" + item.id + item.order_position}
            onClick={() => {
              router.push({pathname: `/assessment/surveys/${item.id}`});
            }}
          >
            {" "}
            {item.name}{" "}
          </div>
        );
      },
    },
    {
      title: "Categoría",
      render: (item) => {
        return (
          <div key={"category-" + item.id}>
            {item.category === "A" ? "Assessment" : "Quiz"}
          </div>
        );
      },
    },
    {
      title: "Estatus",
      render: (item) => {
        return (
          <>
          {
            item.category !== 'K' && 
            <Switch
              key={"status-" + item.id}
              defaultChecked={item.is_active}
              checkedChildren="Activo"
              unCheckedChildren="Inactivo"
              onChange={() => HandleChangeStatus(item)}
            />
          }
            
          </>
        );
      },
    },
    {
      title: () => {
        return (
          <>
            {props.permissions?.delete && (
              <Dropdown overlay={menuTable}>
                <Button size="small">
                  <EllipsisOutlined />
                </Button>
              </Dropdown>
            )}
          </>
        )
      },
      render: (item) => {
        return (
          <>
          {
            item.category !== 'K' &&
            <>
              <Row key={"actions-" + item.id}>
              {props.permissions?.edit && (
                <Col span={6}>
                  <EditOutlined onClick={() => HandleUpdateAssessment(item)}/>
                </Col>
              )}
              {props.permissions?.delete && (
                <Col span={6}>
                  <DeleteOutlined
                    onClick={() => HandleDeleteAssessment(item.id)}
                  />
                </Col>
              )}
            </Row>
            </>
          }
          </>
        );
      },
    },
  ];

  return (
    <MainLayout currentKey="surveys" defaultOpenKeys={["kuiss"]}>
      <Breadcrumb>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({pathname: "/assessments/surveys" })}
        >
          {" "}
          Inicio{" "}
        </Breadcrumb.Item>
        <Breadcrumb.Item> Evaluaciones </Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row>
          <Col span={18}>
            <Form form={form} scrollToFirstError>
              <Row>
                <Col span={16}>
                  <Form.Item name="Filter" label="Filter">
                    <Input
                      placeholder="Filtra las evaluaciones"
                      maxLength={200}
                      onChange={onFilterChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <div style={{ float: "left", marginLeft: "5px" }}>
                    <Form.Item>
                      <Button
                        onClick={() => onFilterActive(assessments)}
                        style={{
                          background: "#fa8c16",
                          fontWeight: "bold",
                          color: "white",
                        }}
                        htmlType="submit"
                      >
                        <SearchOutlined />
                      </Button>
                    </Form.Item>
                  </div>
                  <div style={{ float: "left", marginLeft: "5px" }}>
                    <Form.Item>
                      <Button
                        onClick={() => HandleFilterReset(assessments)}
                        style={{ marginTop: "auto", marginLeft: 10 }}
                      >
                        <SyncOutlined />
                      </Button>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={6} style={{ display: "flex", justifyContent: "flex-end" }}>
            {props.permissions?.create && (
              <Button
                style={{
                  background: "#fa8c16",
                  fontWeight: "bold",
                  color: "white",
                }}
                loading={loading}
                onClick={() => HandleCreateAssessment()}
              >
                <PlusOutlined /> Agregar Encuesta
              </Button>
            )}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              rowKey={'id'}
              columns={columns}
              dataSource={filterActive ? filterValues : assessments}
              loading={loading}
              locale={{
                emptyText: loading
                  ? "Cargando..."
                  : "No se encontraron resultados.",
              }}
              rowSelection={rowSelectionGroup}
              pagination={{current: numPage}}
              onChange={onChangeTable}
            />
          </Col>
        </Row>
      </div>
      <FormAssessment
          title= {showCreateAssessment? "Agregar nueva encuesta": "Modificar encuesta"} 
          visible={showCreateAssessment || showUpdateAssessment}
          close={HandleCloseModal}
          loadData={assessmentData}
        />
      {showModalCreateGroup && (
        <AssessmentsGroup
            loadData={{name: '', assessments: testsSelected}}
            title={'Crear nuevo grupo'}
            visible={showModalCreateGroup}
            close={HandleCloseGroup}
            actionForm={onFinishCreateGroup}
            surveyList={assessments}
        />
      )}
    </MainLayout>
    
  );
};

const mapState = (state) => {
  return {
    config: state.userStore.general_config,
    permissions: state.userStore.permissions.person,
    assessmentStore: state.assessmentStore,
    currentNode: state.userStore.current_node
  };
};

export default connect(mapState, {
  assessmentDeleteAction,
  assessmentStatusAction,
  assessmentLoadAction,
  getCategories
})(withAuthSync(AssessmentScreen));

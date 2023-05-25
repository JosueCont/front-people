import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainInter";
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
  Menu,
  ConfigProvider,
  Checkbox,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  EllipsisOutlined, DownloadOutlined,
} from "@ant-design/icons";
import { withAuthSync } from "../../../libs/auth";
import FormAssessment from "../../../components/assessment/forms/FormAssessment";
import { connect, useDispatch } from "react-redux";
const { confirm } = Modal;
import { types } from "../../../types/assessments";
import {
  assessmentModalAction,
  assessmentDeleteAction,
  assessmentStatusAction,
  assessmentLoadAction,
  getCategories,
  updPagination,
  getListAssets
} from "../../../redux/assessmentDuck";
import { useFilter } from "../../../components/assessment/useFilter";
import WebApiAssessment from "../../../api/WebApiAssessment";
import AssessmentsGroup from "../../../components/assessment/groups/AssessmentsGroup";
import { FormattedMessage } from "react-intl";
import esES from "antd/lib/locale/es_ES";
import {asyncForEach, verifyMenuNewForTenant} from "../../../utils/functions"
import _ from "lodash";
import AssessmentQuestionsPDF from "../../../components/assessment/pdf/AssessmentQuestionsPDF";
import {pdf, PDFViewer} from "@react-pdf/renderer";

const AssessmentScreen = ({
  assessmentStore,
  getCategories,
  updPagination,
  getListAssets,
  ...props
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [form] = Form.useForm();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateAssessment, setShowCreateAssessment] = useState(false);
  const [showUpdateAssessment, setShowUpdateAssessment] = useState(false);
  const [assessmentData, setAssessmentData] = useState(false);
  const [testsSelected, setTestsSelected] = useState([]);
  const [testsKeys, setTestsKeys] = useState([]);
  const [openModalAddGroup, setOpenModalAddGroup] = useState(false);
  const [nameSearch, setNameSearch] = useState("");
  const [configPagination, setConfigPagination] = useState({
    showSizeChanger: true,
  });
  const [filterValues, filterActive, onFilterReset] = useFilter();
  const [assessmentSections, setAssessmentSections] = useState([]);
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);

  useEffect(() => {
    if (props.currentNode) {
      props.assessmentLoadAction(props.currentNode.id);
      getCategories();
      updPagination(1);
      getListAssets(props.currentNode?.id)
    }
  }, [props.currentNode]);

  useEffect(() => {
    setLoading(assessmentStore.fetching);
    if (assessmentStore.assessments?.length > 0) {
      setAssessments(assessmentStore.assessments);
    }
    assessmentStore.active_modal === types.CREATE_ASSESSMENTS
      ? setShowCreateAssessment(true)
      : setShowCreateAssessment(false);
    assessmentStore.active_modal === types.UPDATE_ASSESSMENTS
      ? setShowUpdateAssessment(true)
      : setShowUpdateAssessment(false);
  }, [assessmentStore]);

  const HandleDownloadAssessment = async (item) => {
   //dispatch(assessmentDetailsAction(item.id))
     /*console.log('RICH')
    let data= {
      "description_es":"<p><a href=\"https://google.com.mx/\">Go to</a><img alt=\"\" src=\"http://testmid.khor.mx/hlsql/imagesPruebas/120/e01_3.jpg\" /><img alt=\"\" src=\"https://khorplus.s3.amazonaws.com/humand/kuiz/assessment/images/115202173958/e01_1.jpg\" />,&nbsp;<img alt=\"\" src=\"https://khorplus.s3.amazonaws.com/humand/kuiz/assessment/images/11520217414/e01_2.jpg\" />&nbsp;y&nbsp;<img alt=\"\" src=\"https://khorplus.s3.amazonaws.com/humand/kuiz/assessment/images/115202174133/e01_3.jpg\" /><img alt=\"\" src=\"http://testmid.khor.mx/hlsql/imagesPruebas/120/e01_3.jpg\" /></p>"
    }
    const blocksFromHTML = convertFromHTML(data.description_es)
    const initialState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
    );

    const editorState = EditorState.createWithContent(initialState)
    const rawContent = convertToRaw(editorState.getCurrentContent())
   // let rtx = <RichText content={item.instructions_es}/>

    console.log('RICH2', rawContent)*/

    const key = 'updatable';
    message.loading({content: 'Generando PDF...', key});
    try {
      let response = await WebApiAssessment.assessmentSections(item.id)
      let _sections = _.orderBy(response.data.results, ["order"], ["asc"])
      let _questions = [];
      await asyncForEach(_sections, async (element) => {
        let { data } = await WebApiAssessment.assessmentQuestions(element.id)
        data.results.answer_set = _.orderBy( data.results.answer_set, ["order"], ["asc"])
        _questions.push(...data.results)
      })
      _questions = _.orderBy(_questions, ["order"], ["asc"])
      console.log(_questions)
      setAssessmentQuestions(_questions)
      setAssessmentSections(_sections)
      setAssessmentData(item)
   //    let _pdfBlob = await pdf(<AssessmentQuestionsPDF assessment={item} sections={_sections} questions={_questions}/>).toBlob()

      setTimeout(()=>{
        message.success({content: 'PDF generado', key})
      },1000)

    /*  setTimeout(()=>{
         downloadPDF(_pdfBlob, item)
      },1000)*/

    }catch (e){
      setTimeout(()=>{
        message.error({content: 'PDF no generado', key})
      },1000)
      console.log(e)
    }
  }
  const downloadPDF = (pdfBlob, assessment) =>{
    const urlBlob = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = urlBlob;
    link.download = `${assessment.name_es}.pdf`;
    link.target = "_blank";
    link.click();
    window.URL.revokeObjectURL(urlBlob);
  }

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

  const onChangeTable = (pagination) => {
    // let nameFilter = nameSearch ? `&name=${nameSearch}` : "";
    // if (pagination.current > 1) {
    //   const offset = (pagination.current - 1) * 10;
    //   let queryParam = `&paginate=true&limit=10&offset=${offset}${nameFilter}`;
    //   props.assessmentLoadAction(props.currentNode.id, queryParam);
    //   updPagination(pagination.current);
    // } else if (pagination.current == 1) {
    //   props.assessmentLoadAction(
    //     props.currentNode.id,
    //     `&paginate=true&limit=10&offset=0${nameFilter}`
    //   );
    //   updPagination(pagination.current);
    // }
  };

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

  const onFinishCreateGroup = async (values) => {
    try {
      let body = { ...values, node: props.currentNode?.id };
      await WebApiAssessment.createGroupAssessments(body);
      message.success("Grupo agregado");
    } catch (e) {
      console.log(e);
      // Se devuelve un error para no cerrar el modal
      let txt = e.response?.data?.message;
      if (e.response.status === 400) return txt;
      let msg = txt ? txt : 'Grupo no agregado';
      message.error(msg)
      return 'ERROR';
    }
  };

  const HandleCloseGroup = () => {
    setTestsKeys([]);
    setTestsSelected([]);
    setOpenModalAddGroup(false);
  };

  const showModalGroup = () =>{
    if(testsSelected?.length > 1){
      setOpenModalAddGroup(true);
      return;
    }
    setOpenModalAddGroup(false)
    message.error('Selecciona al menos dos evaluaciones')
  }

  const onFinishSearch = ({ name }) => {
    if (name.trim()) {
      setNameSearch(name);
      props.assessmentLoadAction(props.currentNode?.id, `&name=${name}`);
    } else {
      resetSearch();
    }
  };

  const resetSearch = () => {
    form.resetFields();
    setNameSearch("");
    props.assessmentLoadAction(props.currentNode?.id);
  };

  const menuTable = () => {
    return (
      <Menu>
        {props.permissions?.create && (
          <Menu.Item
            key={1}
            icon={<PlusOutlined />}
            onClick={() => showModalGroup()}
          >
            Crear grupo
          </Menu.Item>
        )}
      </Menu>
    );
  };

  // useEffect(() => {
  //   console.log("testsSelected", testsSelected);
  // }, [testsSelected]);

  const rowSelectionGroup = {
    selectedRowKeys: testsKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      //Los elementos de la pagina actual
      let currentList = filterActive ? filterValues : assessments;
      let temp1 = [...testsKeys];
      let temp2 = [...testsSelected];

      /* Remover los actuales para volver a setearlos */
      currentList.map((item) => {
        let idx = temp1.findIndex((element) => element === item.id);
        if (idx > -1) {
          temp1.splice(idx, 1);
        }

        let idz = temp2.findIndex((element) => element.id === item.id);
        if (idz > -1) {
          temp2.splice(idz, 1);
        }
      });

      //Recorremos la seleccion actual y la seteamos a la seleccio1n global (solo keys)
      selectedRowKeys.map((item) => {
        let idx = temp1.findIndex((element) => element === item);
        if (idx < 0) {
          temp1.push(item);
        }
      });
      setTestsKeys(temp1);
      /* setCurrentKeys(selectedRowKeys); */

      //Recorremos la selección actual de objetos
      selectedRows.map((item) => {
        let idz = temp2.findIndex((element) => element.id === item.id);
        if (idz < 0) {
          temp2.push(item);
          /* setTestsSelected([...testsSelected, item]) */
        }
      });
      setTestsSelected(temp2);
      /* setCurrentSelected(selectedRows); */
    },
  };

  const menuSurvey = (item) => {
    return (
      <Menu>
       {/* <Menu.Item
            key={3}
            icon={<DownloadOutlined />}
            onClick={() => HandleDownloadAssessment(item)}
        >
          PDF
        </Menu.Item>
        {item.category !== "K" && <>*/}
        {props.permissions?.edit && (
          <Menu.Item
            key={1}
            icon={<EditOutlined />}
            onClick={() => HandleUpdateAssessment(item)}
          >
            Editar
          </Menu.Item>
        )}
        {props.permissions?.create && (
          <Menu.Item
            key={1}
            icon={<DeleteOutlined />}
            onClick={() => HandleDeleteAssessment(item.id)}
          >
            Eliminar
          </Menu.Item>
        )}
     {/* </>}*/}
      </Menu>
    );
  };

  const onChangeViewAllAssessments = (e) => {
    let isSelected = e.target.checked;
    if (isSelected) {
      setConfigPagination({
        showSizeChanger: false,
        pageSize: filterActive ? filterValues.length : assessments.length,
      });
    } else {
      setConfigPagination({
        showSizeChanger: true,
      });
    }
  };
  const columns = [
    {
      title: "Nombre",
      render: (item) => {
        return (
          <div
            className={"pointer"}
            key={"name_" + item.id + item.order_position}
            onClick={() => {item.category === "A" || item.category === "Q" ?
              router.push({ pathname: `/assessment/surveys/${item.id}` }) : null;
            }}
          >
            {item.name}
          </div>
        );
      },
    },
    {
      title: "Tipo",
      render: (item) => {
        return (
          <div key={"category-" + item.id}>
            {item.category === "A"
              ? "Assessment"
              : item.category === "Q"
              ? "Quiz"
              : "Khor"}
          </div>
        );
      },
    },
    {
      title: "Estatus",
      render: (item) => {
        return (
          <>
            {item.category !== "K" && (
              <Switch
                key={"status-" + item.id}
                defaultChecked={item.is_active}
                checkedChildren="Activo"
                unCheckedChildren="Inactivo"
                onChange={() => HandleChangeStatus(item)}
              />
            )}
          </>
        );
      },
    },
    {
      title: () => {
        return (
          <>
            {props.permissions?.create && (
              <Dropdown overlay={menuTable}>
                <Button size="small">
                  <EllipsisOutlined />
                </Button>
              </Dropdown>
            )}
          </>
        );
      },
      render: (item) => {
        return (
          <>
            {item.category !== "K" && (
              <>
                {(props.permissions?.edit || props.permissions?.delete) && (
                  <Dropdown overlay={() => menuSurvey(item)}>
                    <Button size="small">
                      <EllipsisOutlined />
                    </Button>
                  </Dropdown>
              )}
              </>
            )}
          </>
        );
      },
    },
  ];

  return (
    <MainLayout
      currentKey={["surveys"]}
      defaultOpenKeys={["evaluationDiagnosis", "kuiz"]}
    >
      <Breadcrumb>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        {verifyMenuNewForTenant() && 
          <Breadcrumb.Item>Evaluación y diagnóstico</Breadcrumb.Item>
        }
        <Breadcrumb.Item>Psicometría</Breadcrumb.Item>
        <Breadcrumb.Item>Evaluaciones</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row>
          <Col span={18}>
            <Form form={form} onFinish={onFinishSearch} scrollToFirstError>
              <Row>
                <Col span={16}>
                  <Form.Item name="name" label="Filtrar">
                    <Input
                      placeholder="Filtra las evaluaciones"
                      maxLength={200}
                      // onChange={onFilterChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <div style={{ float: "left", marginLeft: "5px" }}>
                    <Form.Item>
                      <Button
                        // onClick={() => onFilterActive(assessments)}
                        htmlType="submit"
                      >
                        <SearchOutlined />
                      </Button>
                    </Form.Item>
                  </div>
                  <div style={{ float: "left", marginLeft: "5px" }}>
                    <Form.Item>
                      <Button
                        onClick={() => resetSearch()}
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
          {/* {props.permissions?.create && (
            <Col
              span={6}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button onClick={() => HandleCreateAssessment()}>
                <PlusOutlined /> Agregar encuesta
              </Button>
            </Col>
          )} */}
        </Row>
        <Row justify="end">
          <Checkbox
            onChange={onChangeViewAllAssessments}
            style={{ marginBottom: "4px" }}
          >
            {" "}
            <b>Ver todas las evaluaciones</b>{" "}
          </Checkbox>
        </Row>
        <Row>
          <Col span={24}>
            <ConfigProvider locale={esES}>
              <Table
                rowKey={"id"}
                size={"small"}
                className={"table-surveys"}
                columns={columns}
                dataSource={filterActive ? filterValues : assessments}
                loading={loading}
                locale={{
                  emptyText: loading
                    ? "Cargando..."
                    : "No se encontraron resultados.",
                }}
                rowSelection={rowSelectionGroup}
                pagination={configPagination}
                onChange={onChangeTable}
              />
            </ConfigProvider>
            {/*{assessmentData && assessmentSections && assessmentQuestions && <PDFViewer style={{width:'100%', height:'22cm'}}>
              <AssessmentQuestionsPDF assessment={assessmentData} sections={assessmentSections} questions={assessmentQuestions}/>
            </PDFViewer>}*/}
          </Col>
        </Row>
      </div>
      {(showCreateAssessment || showUpdateAssessment) && (
        <FormAssessment
          title={
            showCreateAssessment
              ? "Agregar nueva encuesta"
              : "Modificar encuesta"
          }
          visible={showCreateAssessment || showUpdateAssessment}
          close={HandleCloseModal}
          loadData={assessmentData}
          onChangeTable={onChangeTable}
        />
      )}
      {openModalAddGroup && (
        <AssessmentsGroup
          itemGroup={{name: "",assessments: testsSelected }}
          title="Crear nuevo grupo"
          visible={openModalAddGroup}
          close={HandleCloseGroup}
          actionForm={onFinishCreateGroup}
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
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState, {
  assessmentDeleteAction,
  assessmentStatusAction,
  assessmentLoadAction,
  getCategories,
  updPagination,
  getListAssets,
})(withAuthSync(AssessmentScreen));

import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import { Breadcrumb, Button, Row, Col, Modal, Collapse, message } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { connect, useDispatch } from "react-redux";
import { withAuthSync } from "../../libs/auth";
import { types } from "../../types/assessments";
const { confirm } = Modal;
import FormSection from "../../components/assessment/forms/FormSection";
import FormQuestion from "../../components/assessment/forms/FormQuestion";
import FormAnswer from "../../components/assessment/forms/FormAnswer";
import Options from "../../components/assessment/Options";
import Section from "../../components/assessment/Section";
import Question from "../../components/assessment/Question";
import {
  assessmentModalAction,
  assessmentDetailsAction,
  sectionDeleteAction,
  questionDeleteAction,
  answerDeleteAction,
} from "../../redux/assessmentDuck";

const Detail = ({ assessmentStore, ...props }) => {
  const { Panel } = Collapse;
  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [sections, setSections] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [showCreateSection, setShowCreateSection] = useState(false);
  const [showUpdateSection, setShowUpdateSection] = useState(false);
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);
  const [showUpdateQuestion, setShowUpdateQuestion] = useState(false);
  const [showCreateAnswer, setShowCreateAnswer] = useState(false);
  const [showUpdateAnswer, setShowUpdateAnswer] = useState(false);

  const [sectionData, setSectionData] = useState(false);
  const [questionData, setQuestionData] = useState(false);
  const [answerData, setAnswerData] = useState(false);

  const [sectionSelected, setSectionSelected] = useState("");
  const [questionSelected, setQuestionSelected] = useState("");

  useEffect(() => {
    router.query.id && dispatch(assessmentDetailsAction(router.query.id));
  }, [router.query.id]);

  useEffect(() => {
    setLoading(assessmentStore.fetching);
    assessmentStore.active_modal === types.CREATE_SECTIONS
      ? setShowCreateSection(true)
      : setShowCreateSection(false);
    assessmentStore.active_modal === types.UPDATE_SECTIONS
      ? setShowUpdateSection(true)
      : setShowUpdateSection(false);
    assessmentStore.active_modal === types.CREATE_QUESTIONS
      ? setShowCreateQuestion(true)
      : setShowCreateQuestion(false);
    assessmentStore.active_modal === types.UPDATE_QUESTIONS
      ? setShowUpdateQuestion(true)
      : setShowUpdateQuestion(false);
    assessmentStore.active_modal === types.CREATE_ANSWERS
      ? setShowCreateAnswer(true)
      : setShowCreateAnswer(false);
    assessmentStore.active_modal === types.UPDATE_ANSWERS
      ? setShowUpdateAnswer(true)
      : setShowUpdateAnswer(false);
  }, [assessmentStore]);

  useEffect(() => {
    setSections(assessmentStore.sections);
  }, [assessmentStore.sections]);

  useEffect(() => {
    setQuestions(assessmentStore.questions);
  }, [assessmentStore.questions]);

  const HandleCreateSection = (id = "") => {
    setSectionData(false);
    dispatch(assessmentModalAction(types.CREATE_SECTIONS));
  };

  const HandleUpdateSection = (item) => {
    setSectionData(item);
    dispatch(assessmentModalAction(types.UPDATE_SECTIONS));
  };

  const HandleDeleteSection = (item) => {
    confirm({
      title: "¿Está seguro de eliminar esta sección",
      icon: <ExclamationCircleOutlined />,
      content: "Si lo elimina no podrá recuperarlo",
      onOk() {
        props
          .sectionDeleteAction(item.id)
          .then((response) => {
            response
              ? message.success("Eliminado correctamente")
              : message.error("Hubo un error");
          })
          .catch((e) => message.error("Hubo un error"));
      },
      okType: "primary",
      okText: "Eliminar",
      cancelText: "Cancelar",
      okButtonProps: {
        danger: true,
      },
    });
  };

  const HandleCreateQuestion = (id) => {
    setQuestionData(false);
    setSectionSelected(id);
    dispatch(assessmentModalAction(types.CREATE_QUESTIONS));
  };

  const HandleUpdateQuestion = (item) => {
    setQuestionData(item);
    dispatch(assessmentModalAction(types.UPDATE_QUESTIONS));
  };

  const HandleDeleteQuestion = (item) => {
    confirm({
      title: "¿Está seguro de eliminar esta sección",
      icon: <ExclamationCircleOutlined />,
      content: "Si lo elimina no podrá recuperarlo",
      onOk() {
        props
          .questionDeleteAction(item.id)
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

  const HandleCreateAnswer = (id) => {
    setAnswerData(false);
    setQuestionSelected(id);
    dispatch(assessmentModalAction(types.CREATE_ANSWERS));
  };

  const HandleUpdateAnswer = (item) => {
    setAnswerData(item);
    dispatch(assessmentModalAction(types.UPDATE_ANSWERS));
  };

  const HandleDeleteAnswer = (item) => {
    confirm({
      title: "¿Está seguro de eliminar esta sección",
      icon: <ExclamationCircleOutlined />,
      content: "Si lo elimina no podrá recuperarlo",
      onOk() {
        props
          .answerDeleteAction(item)
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

  const HandleCloseModal = () => {
    dispatch(assessmentModalAction(""));
  };

  return (
    <MainLayout currentKey="2">
      <Breadcrumb>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home" })}
        >
          {" "}
          Inicio{" "}
        </Breadcrumb.Item>
        <Breadcrumb.Item> Encuestas </Breadcrumb.Item>
        <Breadcrumb.Item> Detalle </Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row>
          <Col
            span={24}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              style={{
                background: "#fa8c16",
                fontWeight: "bold",
                color: "white",
              }}
              loading={loading}
              onClick={() => HandleCreateSection(true)}
            >
              <PlusOutlined /> Agregar nueva sección
            </Button>
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Col span={24}>
            <Collapse>
              {sections.map((seccion) => {
                sections;
                return (
                  <Panel
                    header={seccion.name}
                    key={seccion.id}
                    extra={
                      <Options
                        item={seccion}
                        onUpdate={HandleUpdateSection}
                        onDelete={HandleDeleteSection}
                        onCreate={HandleCreateQuestion}
                        buttonName="Agregar pregunta"
                      />
                    }
                  >
                    {/* <Collapse>
                                            {
                                                questions.map( pregunta => seccion.id === pregunta.section.id &&
                                                    <Panel 
                                                        header={pregunta.title}
                                                        key={pregunta.id}  
                                                        extra={
                                                            <Options 
                                                                item={pregunta}
                                                                onUpdate={HandleUpdateQuestion} 
                                                                onDelete={HandleDeleteQuestion} 
                                                                onCreate={HandleCreateAnswer}
                                                                buttonName="Agregar respuesta"
                                                            /> 
                                                        } 
                                                    > 
                                                        <div className="ant-collapse">
                                                            {
                                                                pregunta.answer_set.map(respuesta =>
                                                                    <Panel 
                                                                        header={respuesta.title} 
                                                                        key={respuesta.id}
                                                                        extra={
                                                                            <Options 
                                                                                item={respuesta}
                                                                                onUpdate={HandleUpdateAnswer} 
                                                                                onDelete={HandleDeleteAnswer} 
                                                                            /> 
                                                                        }>
                                                                    </Panel>
                                                                )
                                                            }
                                                        </div>
                                                    </Panel>
                                                )
                                            }
                                        </Collapse> */}
                  </Panel>
                );
              })}
            </Collapse>
          </Col>
        </Row>
      </div>
      {showCreateSection && (
        <FormSection
          title="Agregar nueva sección"
          visible={showCreateSection}
          close={HandleCloseModal}
          loadData={false}
        />
      )}
      {showUpdateSection && (
        <FormSection
          title="Modificar sección"
          visible={showUpdateSection}
          close={HandleCloseModal}
          loadData={sectionData}
        />
      )}
      {showCreateQuestion && (
        <FormQuestion
          title="Agregar nueva pregunta"
          visible={showCreateQuestion}
          close={HandleCloseModal}
          loadData={false}
          idSection={sectionSelected}
        />
      )}
      {showUpdateQuestion && (
        <FormQuestion
          title="Modificar pregunta"
          visible={showUpdateQuestion}
          close={HandleCloseModal}
          loadData={questionData}
        />
      )}
      {showCreateAnswer && (
        <FormAnswer
          title="Crear nueva respuesta"
          visible={showCreateAnswer}
          close={HandleCloseModal}
          loadData={false}
          idQuestion={questionSelected}
        />
      )}
      {showUpdateAnswer && (
        <FormAnswer
          title="Modificar respuesta"
          visible={showUpdateAnswer}
          close={HandleCloseModal}
          loadData={answerData}
        />
      )}
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    assessmentStore: state.assessmentStore,
  };
};

export default connect(mapState, {
  sectionDeleteAction,
  questionDeleteAction,
  answerDeleteAction,
})(withAuthSync(Detail));

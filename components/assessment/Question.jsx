import React, {useState, useEffect} from 'react'
import {Collapse, Modal} from "antd";
import {withAuthSync} from "../../libs/auth";
import {connect, useDispatch} from "react-redux";
import jsCookie from "js-cookie";
const {confirm} = Modal;
import {types} from "../../types/assessments";
import FormQuestion from "../../components/assessment/forms/FormQuestion";
import FormAnswer from "../../components/assessment/forms/FormAnswer";
import Options from './Options';
import Answer from './answer'
import {assessmentModalAction, questionDeleteAction} from "../../redux/assessmentDuck";


const Question = ({assessmentStore, pregunta, ...props}) => {

    const { Panel } = Collapse;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const [showUpdateQuestion, setShowUpdateQuestion] = useState(false);
    const [showCreateAnswer, setShowCreateAnswer] = useState(false);

    const [questionData, setQuestionData] = useState(false);

    useEffect(() => {
        setLoading(assessmentStore.fetching);
        assessmentStore.active_modal === types.UPDATE_QUESTIONS ? setShowUpdateQuestion(true) : setShowUpdateQuestion(false);
        assessmentStore.active_modal === types.CREATE_ANSWERS ? setShowCreateAnswer(true) : setShowCreateAnswer(false);
    }, [assessmentStore]);

    const HandleUpdateQuestion = (item) => {
        setQuestionData(item);
        dispatch(assessmentModalAction(types.UPDATE_QUESTIONS));
    };

    const HandleDeleteQuestion = (id) => {
        confirm({
            title: "¿Está seguro de eliminar esta sección",
            icon: <ExclamationCircleOutlined />,
            content: "Si lo elimina no podrá recuperarlo",
            onOk() {
            dispatch(questionDeleteAction(id))
            },
            okType: "primary",
            okText: "Eliminar",
            cancelText: "Cancelar",
            okButtonProps: {
            danger: true,
            },
        });
    };

    const HandleCreateAnswer = () => {
        setAnswerData(false);
        dispatch(assessmentModalAction(types.CREATE_ANSWERS));
    };

    return (
        <>
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
                            <Answer
                                id={respuesta.id}
                                key={respuesta.id}
                                pregunta={respuesta}
                            /> 
                        )
                    }
                </div>
            </Panel>
            { showUpdateQuestion && (
                <FormQuestion
                    title="Modificar pregunta"
                    visible={showUpdateQuestion}
                    close = {setShowUpdateQuestion}
                    loadData = {questionData}
                />
            )}
            { showCreateAnswer && (
                <FormAnswer
                    title="Crear nueva respuesta"
                    visible={showCreateAnswer}
                    close = {setShowCreateAnswer}
                    loadData = {false}
                />
            )} 
        </>
    )
}

const mapState = (state) => {
    return {
      assessmentStore: state.assessmentStore,
    }
}
  
export default connect(mapState)(withAuthSync(Question));
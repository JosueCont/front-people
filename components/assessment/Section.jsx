import React, {useState, useEffect} from 'react'
import {Collapse, Modal} from "antd";
import {withAuthSync} from "../../libs/auth";
import {connect, useDispatch} from "react-redux";
import jsCookie from "js-cookie";
const {confirm} = Modal;
import {types} from "../../types/assessments";
import FormSection from "../../components/assessment/forms/FormSection";
import FormQuestion from "../../components/assessment/forms/FormQuestion";
import Options from './Options';
import Question from './Question';
import {assessmentModalAction, sectionDeleteAction} from "../../redux/assessmentDuck";

const Section = ({assessmentStore, seccion, ...props}) => {

    const { Panel } = Collapse;
    const dispatch = useDispatch();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpdateSection, setShowUpdateSection] = useState(false);
    const [showCreateQuestion, setShowCreateQuestion] = useState(false);
    const [sectionData, setSectionData] = useState(false);

    useEffect(() => {
        setQuestions(assessmentStore.questions);
        setLoading(assessmentStore.fetching);
        assessmentStore.active_modal === types.UPDATE_SECTIONS ? setShowUpdateSection(true) : setShowUpdateSection(false);
        assessmentStore.active_modal === types.CREATE_QUESTIONS ? setShowCreateQuestion(true) : setShowCreateQuestion(false);
    }, [assessmentStore]);

    const HandleUpdateSection = (item) => {
        setSectionData(item);
        dispatch(assessmentModalAction(types.UPDATE_SECTIONS));
    };
    
    const HandleDeleteSection = (id) => {
        confirm({
            title: "¿Está seguro de eliminar esta sección",
            icon: <ExclamationCircleOutlined />,
            content: "Si lo elimina no podrá recuperarlo",
            onOk() {
            dispatch(sectionDeleteAction(id))
            },
            okType: "primary",
            okText: "Eliminar",
            cancelText: "Cancelar",
            okButtonProps: {
            danger: true,
            },
        });
    };

    const HandleCreateQuestion = () => {
        dispatch(assessmentModalAction(types.CREATE_QUESTIONS));
    };
    
    return (
        <>
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
                }>
                    <Collapse>
                        {
                            questions.map(pregunta => (seccion.id === pregunta.section.id) &&
                                <Question
                                    id={pregunta.id}
                                    key={pregunta.id}
                                    pregunta={pregunta}
                                /> 
                            )
                        }
                    </Collapse>
            </Panel> 
            { showUpdateSection && (
                <FormSection
                    title="Modificar sección"
                    visible={showUpdateSection}
                    close = {setShowUpdateSection}
                    loadData = {sectionData}
                />
            )}
            { showCreateQuestion && (
                <FormQuestion
                    title="Crear nueva pregunta"
                    visible={showCreateQuestion}
                    close = {setShowCreateQuestion}
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
  
export default connect(mapState)(withAuthSync(Section));
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
import {assessmentModalAction, answerDeleteAction} from "../../redux/assessmentDuck";

const Answer = ({assessmentStore, respuesta, ...props}) => {

    const { Panel } = Collapse;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const [showUpdateAnswer, setShowUpdateAnswer] = useState(false);
    const [answerData, setAnswerData] = useState(false);

    useEffect(() => {
        setLoading(assessmentStore.fetching);
        assessmentStore.active_modal === types.UPDATE_ANSWERS ? setShowUpdateAnswer(true) : setShowUpdateAnswer(false);
    }, [assessmentStore]);

    const HandleUpdateAnswer = (item) => {
        setAnswerData(item);
        dispatch(assessmentModalAction(types.UPDATE_ANSWERS));
    };

    const HandleDeleteAnswer = (id) => {
        confirm({
            title: "¿Está seguro de eliminar esta sección",
            icon: <ExclamationCircleOutlined />,
            content: "Si lo elimina no podrá recuperarlo",
            onOk() {
            dispatch(answerDeleteAction(id))
            },
            okType: "primary",
            okText: "Eliminar",
            cancelText: "Cancelar",
            okButtonProps: {
            danger: true,
            },
        });
    };

    return (
        <>
            <Panel 
                header={respuesta.title} 
                extra={
                    <Options 
                        item={respuesta}
                        onUpdate={HandleUpdateAnswer} 
                        onDelete={HandleDeleteAnswer} 
                    /> 
                }>
            </Panel>
            { showUpdateAnswer && (
                <FormAnswer
                    title="Modificar respuesta"
                    visible={showUpdateAnswer}
                    close = {setShowUpdateAnswer}
                    loadData = {answerData}
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
  
export default connect(mapState)(withAuthSync(Answer));
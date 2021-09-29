import React, { useEffect, useState } from 'react';
import {Form, Input, Button, Modal, message, } from "antd";
import {connect, useDispatch} from "react-redux";
import {withAuthSync, userCompanyId} from "../../../libs/auth";
import { ruleRequired } from "../../../utils/constant";
import FormItemHTML from "./FormItemHtml";
import { assessmentCreateAction, assessmentUpdateAction } from "../../../redux/assessmentDuck";

const FormAssessment = ({...props}) => {

    const dispatch = useDispatch();
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 17 }, };
    const [formAssessment] = Form.useForm();
    const nodeId = Number.parseInt(userCompanyId());
    const assessmentId = props.loadData ? props.loadData.id : "";
    const [descripcion, setDescripcion] = useState(props.loadData.description_es ? props.loadData.description_es : '');
    const [instruccions, setInstruccions] = useState(props.loadData.instructions_es ?  props.loadData.instructions_es : '');

    useEffect( () => {
        if (props.loadData){
            console.log("DATOS::", props.loadData);
            formAssessment.setFieldsValue({
                code: props.loadData.code,
                name: props.loadData.name,
            });
        } else {
            onReset();
            setDescripcion('');
            setInstruccions('');
        }
    }, []);

    const onFinish = (values) => {
        values.description_es = descripcion;
        values.instructions_es = instruccions;
        if(props.loadData){
            props.assessmentUpdateAction(assessmentId, values).then( response => {
                response ? message.success("Actualizado correctamente") : message.error("Hubo un error"), props.close();
            }).catch( e => {
                message.error("Hubo un error");
                props.close();
            });
        } else {
            values.companies = [nodeId];
            props.assessmentCreateAction(values).then((response) => {
                response ? message.success("Agregado correctamente") : message.error("Hubo un error"), props.close();
            }).catch( e => {
                message.error("Hubo un error");
                props.close();
            });
        }  
    };

    const onReset = () => {
        formAssessment.resetFields();
    };

    return (
        <Modal title={props.title} visible={props.visible} footer={null} onCancel={() => props.close() } 
            width={ window.innerWidth > 1000 ? "60%" : "80%"}
            footer={[
                <Button key="back" onClick={() => props.close()}> Cancelar </Button>,
                <Button form="formAssessment" type="primary" key="submit" htmlType="submit">Guardar</Button>,
            ]}>
            <Form {...layout} initialValues={{ intranet_access: false, }} onFinish={onFinish}  id="formAssessment" form={formAssessment}>
                <Form.Item name="code" label={"Código"} rules={[ruleRequired]}>
                    <Input
                    allowClear={true}
                    placeholder="Código"
                    />
                </Form.Item>
                <Form.Item name="name" label={"Nombre"} rules={[ruleRequired]}>
                    <Input
                    allowClear={true}
                    placeholder="Nombre"
                    />
                </Form.Item>
                <FormItemHTML
                    html = {descripcion}
                    setHTML={setDescripcion}
                    getLabel = "Descripción"
                    getName = "description_es"
                />
                <FormItemHTML
                    html = {instruccions}
                    setHTML={setInstruccions}
                    getLabel = "Instrucciones"
                    getName = "instructions_es"
                />
            </Form>
        </Modal>
    )
}

const mapState = (state) => {
    return {
      assessmentStore: state.assessmentStore,
    }
  }
  
export default connect(mapState,{assessmentCreateAction, assessmentUpdateAction})(withAuthSync(FormAssessment));

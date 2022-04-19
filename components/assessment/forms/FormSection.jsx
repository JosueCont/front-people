import React, { useEffect, useState } from "react";
import { Form, Input, Button, Modal, message } from "antd";
import { connect, useDispatch } from "react-redux";
import { withAuthSync, userCompanyId } from "../../../libs/auth";
import FormItemHTML from "./FormItemHtml";
import {
  sectionCreateAction,
  sectionUpdateAction,
} from "../../../redux/assessmentDuck";
import { ruleRequired } from "../../../utils/rules";

const FormSections = ({ assessmentStore, ...props }) => {
  const dispatch = useDispatch();
  const layout = { labelCol: { span: 6 }, wrapperCol: { span: 17 } };
  const [formSections] = Form.useForm();
  const nodeId = Number.parseInt(userCompanyId());
  const sectionId = props.loadData ? props.loadData.id : "";
  const { assessment_selected } = assessmentStore;
  const [instruccionCorta, setInstruccionCorta] = useState(
    props.loadData.short_instructions_es
      ? props.loadData.short_instructions_es
      : ""
  );
  const [instruccions, setInstruccions] = useState(
    props.loadData.instructions_es ? props.loadData.instructions_es : ""
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.loadData) {
      formSections.setFieldsValue({
        code: props.loadData.code,
        name: props.loadData.name,
      });
    } else {
      onReset();
      setInstruccionCorta("");
      setInstruccions("");
    }
  }, []);

  useEffect(() => {
    setLoading(assessmentStore.fetching);
  }, [assessmentStore]);

  const onFinish = (values) => {
    console.log('first', `-${values.code}-`)
    const regex = /^\s+$/;
    const invalid = regex.test(values.code);
    if(invalid){
      formSections.setFields([
        {
          "name": "code",
          "errors": ["Este campo no puede estar vacío"]
        }
    ])
    }
    return;
    values.instructions_es = instruccions;
    values.short_instructions_es = instruccionCorta;
    values.assessment = assessment_selected.id;
    if (props.loadData) {
      props
        .sectionUpdateAction(sectionId, values)
        .then((response) => {
          response
            ? message.success("Actualizado correctamente")
            : message.error("Hubo un error"),
            props.close();
        })
        .catch((e) => {
          message.error("Hubo un error");
          props.close();
        });
    } else {
      props
        .sectionCreateAction(values)
        .then((response) => {
          response
            ? message.success("Creado correctamente")
            : message.error("Hubo un error"),
            props.close();
        })
        .catch((e) => {
          message.error("Hubo un error");
          props.close();
        });
    }
  };

  const onReset = () => {
    formSections.resetFields();
  };

  return (
    <Modal
      title={props.title}
      visible={props.visible}
      footer={null}
      onCancel={() => props.close()}
      width={window.innerWidth > 1000 ? "60%" : "80%"}
      footer={[
        <Button key="back" onClick={() => props.close()}>
          {" "}
          Cancelar{" "}
        </Button>,
        <Button
          form="formSections"
          type="primary"
          key="submit"
          htmlType="submit"
          loading={loading}
        >
          Guardar
        </Button>,
      ]}
    >
      <Form
        {...layout}
        onFinish={onFinish}
        id="formSections"
        form={formSections}
      >
        <Form.Item name="code" label={"Código"} rules={[ruleRequired]}>
          <Input maxLength={200} allowClear={true} placeholder="Código" />
        </Form.Item>
        <Form.Item name="name" label={"Nombre"} rules={[ruleRequired]}>
          <Input maxLength={200} allowClear={true} placeholder="Nombre" />
        </Form.Item>
        <FormItemHTML
          html={instruccions}
          setHTML={setInstruccions}
          getLabel="Instrucciones"
          getName="instructions_es"
        />
        <FormItemHTML
          html={instruccionCorta}
          setHTML={setInstruccionCorta}
          getLabel="Instrucción corta"
          getName="short_instructions_es"
        />
      </Form>
    </Modal>
  );
};

const mapState = (state) => {
  return {
    config: state.userStore.general_config,
    assessmentStore: state.assessmentStore,
  };
};

export default connect(mapState, { sectionCreateAction, sectionUpdateAction })(
  withAuthSync(FormSections)
);

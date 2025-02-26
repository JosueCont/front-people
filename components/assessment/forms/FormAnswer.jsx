import React, { useEffect, useState } from "react";
import { Form, Input, Button, Modal, message } from "antd";
import { connect } from "react-redux";
import { withAuthSync } from "../../../libs/auth";
import FormItemHTML from "./FormItemHtml";
import {
  answerCreateAction,
  answerUpdateAction,
} from "../../../redux/assessmentDuck";
import { ruleRequired } from "../../../utils/rules";

const FormAnswer = ({ assessmentStore, ...props }) => {
  const [formAnswers] = Form.useForm();
  const answerId = props.loadData ? props.loadData.id : "";
  const [descripcion, setDescripcion] = useState(
    props.loadData.description_es ? props.loadData.description_es : ""
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.loadData) {
      formAnswers.setFieldsValue({
        title: props.loadData.title,
        value: props.loadData.value,
      });
    } else {
      onReset();
      setDescripcion("");
    }
  }, []);

  useEffect(() => {
    setLoading(assessmentStore.fetching);
  }, [assessmentStore]);

  const setFieldError = (name) => {
    formAnswers.setFields([
      { name: name, errors: ["Este campo no puede estar vacío"] },
    ]);
  };

  const onFinish = (values) => {
    const regex = /^\s+$/;
    if (regex.test(values.title)) {
      setFieldError("title");
    } else if (regex.test(values.value)) {
      setFieldError("value");
    } else {
      values.description_es = descripcion;
      if (props.loadData) {
        props
          .answerUpdateAction(answerId, values)
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
        values.question = props.idQuestion;
        props
          .answerCreateAction(values)
          .then((response) => {
            response
              ? message.success("Agregado correctamente")
              : message.error("Hubo un error"),
              props.close();
          })
          .catch((e) => {
            message.error("Hubo un error");
            props.close();
          });
      }
    }
  };

  const onReset = () => {
    formAnswers.resetFields();
  };

  return (
    <Modal
      title={props.title}
      visible={props.visible}
      onCancel={() => props.close()}
      // width={window.innerWidth > 1000 ? "60%" : "80%"}
      footer={[
        <Button key="back" onClick={() => props.close()}>
          Cancelar
        </Button>,
        <Button
          form="formAnswers"
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
        // {...layout}
        onFinish={onFinish}
        id="formAnswers"
        form={formAnswers}
        layout={"vertical"}
        requiredMark={false}
      >
        <Form.Item name="title" label={"Título"} rules={[ruleRequired]}>
          <Input maxLength={200} allowClear={true} placeholder="Título" />
        </Form.Item>
        <Form.Item name="value" label={"Valor"} rules={[ruleRequired]}>
          <Input maxLength={200} allowClear={true} placeholder="value" />
        </Form.Item>
        <FormItemHTML
          html={descripcion}
          setHTML={setDescripcion}
          getLabel="Descripción"
          getName="description_es"
        />
      </Form>
    </Modal>
  );
};

const mapState = (state) => {
  return {
    assessmentStore: state.assessmentStore,
  };
};

export default connect(mapState, { answerCreateAction, answerUpdateAction })(
  withAuthSync(FormAnswer)
);

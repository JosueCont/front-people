import React, { useEffect, useState } from "react";
import { Form, Input, Button, Modal, message } from "antd";
import { useDispatch } from "react-redux";
import { userCompanyId } from "../../../libs/auth";
import { ruleRequired } from "../../../utils/constant";
import FormItemHTML from "./FormItemHtml";
import {
  questionCreateAction,
  questionUpdateAction,
} from "../../../redux/assessmentDuck";

const FormQuestion = (props) => {
  const dispatch = useDispatch();
  const layout = { labelCol: { span: 6 }, wrapperCol: { span: 17 } };
  const [formQuestions] = Form.useForm();
  const nodeId = Number.parseInt(userCompanyId());
  const questionId = props.loadData ? props.loadData.id : "";
  const [descripcion, setDescripcion] = useState(
    props.loadData.description_es ? props.loadData.description_es : ""
  );

  useEffect(() => {
    if (props.loadData) {
      formQuestions.setFieldsValue({
        code: props.loadData.code,
        name: props.loadData.name,
      });
    } else {
      onReset();
      setDescripcion("");
    }
  }, []);

  const onFinish = (values) => {
    values.description_es = descripcion;
    // values.answer_set = [];
    if (props.loadData) {
      dispatch(questionUpdateAction(questionId, values));
      props.close(false);
    } else {
      dispatch(questionCreateAction(values));
      props.close(false);
    }
  };

  const onReset = () => {
    formQuestions.resetFields();
  };

  return (
    <Modal
      title={props.title}
      visible={props.visible}
      footer={null}
      onCancel={() => props.close(false)}
      width={window.innerWidth > 1000 ? "60%" : "80%"}
      footer={[
        <Button key="back" onClick={() => props.close(false)}>
          {" "}
          Cancelar{" "}
        </Button>,
        <Button
          form="formQuestions"
          type="primary"
          key="submit"
          htmlType="submit"
        >
          Guardar
        </Button>,
      ]}
    >
      <Form
        {...layout}
        onFinish={onFinish}
        id="formQuestions"
        form={formQuestions}
      >
        <Form.Item name="title" label={"Título"} rules={[ruleRequired]}>
          <Input allowClear={true} placeholder="Título" />
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

export default FormQuestion;

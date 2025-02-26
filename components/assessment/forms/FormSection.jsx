import React, { useEffect, useState } from "react";
import { Form, Input, Button, Modal, message, Row, Col } from "antd";
import { connect, useDispatch } from "react-redux";
import { withAuthSync } from "../../../libs/auth";
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

  const validateVoid = (obj) => {
    const regex = /^\s+$/;
    let fieldsValidate = Object.entries(obj).map(([key, val]) => {
      if (key == "code" || key == "name") {
        let invalid = regex.test(val);
        if (invalid) {
          formSections.setFields([
            { name: key, errors: ["Este campo no puede estar vacío"] },
          ]);
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
    return fieldsValidate.some((item) => item === true);
  };

  const setFieldError = (name) => {
    formSections.setFields([
      { name: name, errors: ["Este campo no puede estar vacío"] },
    ]);
  };

  const onFinish = (values) => {
    const regex = /^\s+$/;
    if (regex.test(values.code)) {
      setFieldError("code");
    } else if (regex.test(values.name)) {
      setFieldError("name");
    } else {
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
    }
  };

  const onReset = () => {
    formSections.resetFields();
  };

  return (
    <Modal
      title={props.title}
      visible={props.visible}
      onCancel={() => props.close()}
      width={800}
      footer={[
        <Button key="back" onClick={() => props.close()}>
          Cancelar
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
        // {...layout}
        onFinish={onFinish}
        id="formSections"
        form={formSections}
        layout={"vertical"}
        requiredMark={false}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item name="code" label={"Código"} rules={[ruleRequired]}>
              <Input maxLength={200} allowClear={true} placeholder="Código" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="name" label={"Nombre"} rules={[ruleRequired]}>
              <Input maxLength={200} allowClear={true} placeholder="Nombre" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <FormItemHTML
              html={instruccions}
              setHTML={setInstruccions}
              getLabel="Instrucciones"
              getName="instructions_es"
            />
          </Col>
          <Col span={12}>
            <FormItemHTML
              html={instruccionCorta}
              setHTML={setInstruccionCorta}
              getLabel="Instrucción corta"
              getName="short_instructions_es"
            />
          </Col>
        </Row>
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

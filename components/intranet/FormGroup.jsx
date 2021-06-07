import React from "react";
import { withAuthSync } from "../../libs/auth";
import { Form, Input, Row, Col, Typography } from "antd";

const FormGroup = (props) => {
  const { form } = Form.useForm();
  const { Title } = Typography;

  return (
    <>
      <Form.Item label="Nombre de grupo" labelCol={{ span: 7 }} labelAlign={"left"}>
        <Input value={null} />
      </Form.Item>
    </>
  );
};

export default withAuthSync(FormGroup);

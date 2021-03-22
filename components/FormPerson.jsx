import { Form, Input, Layout, Modal } from "antd";
import { useState } from "react";

const FormPerson = (props) => {
  return (
    <>
      <Layout>
        <Modal
          title="Vertically centered modal dialog"
          centered
          visible={props.visible}
          onOk={() => props.close(false)}
          onCancel={() => props.close(false)}
        >
          <Form>
            <Form.Item label="Nombre">
              <Input type="text" />
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </>
  );
};
export default FormPerson;

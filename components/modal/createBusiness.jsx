import { Button, Form, Input, Modal, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../config/config";

const { TextArea } = Input;
const { Option } = Select;

const modalCreateBusiness = (props) => {
  const [formBusiness] = Form.useForm();
  const [business, setBusiness] = useState([]);

  const closeDialog = () => {
    props.close(false);
  };

  const createBusiness = (value) => {
    // axios.post(API_URL + "/business/node/", data)
    //   .then(function (response) {
    //     if (response.status === 200) {
    //       Router.push("/business");
    //     }
    //     getBusiness();
    //     setIsModalVisible(false);
    //     setLoading(false);
    //   })
    //   .catch(function (error) {
    //     setLoading(false);
    //     console.log(error);
    //   });
  };

  return (
    <Modal
      title={props.parent > 0 ? "Actualizar empresa" : "Agregar empresa"}
      visible={props.visible}
      onCancel={() => closeDialog()}
      footer={[
        <Button key="back" onClick={closeDialog}>
          Regresar
        </Button>,
        <Button
          form="addBusinessForm"
          type="primary"
          key="submit"
          htmlType="submit"
        >
          Guardar
        </Button>,
      ]}
    >
      <Form
        id="addBusinessForm"
        form={formBusiness}
        layout={"vertical"}
        onFinish={createBusiness}
      >
        <Form.Item
          name="name"
          label="Nombre"
          rules={[{ required: true, message: "Ingresa un nombre" }]}
        >
          <Input placeholder="Nombre de la empresa" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Descripción"
          rules={[{ required: true, message: "Ingresa una descripción" }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="parent" label="Nodo padre">
          <Select showSearch placeholder="Empresa" options={business} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default modalCreateBusiness;

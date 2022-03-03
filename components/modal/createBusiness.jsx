import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Upload } from "antd";
import { useState } from "react";

const { TextArea } = Input;
const { Option } = Select;

const ModalCreateBusiness = ({ visible, setVisible, ...props }) => {
  const [form] = Form.useForm();
  const [business, setBusiness] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(false);

  const closeDialog = () => {
    props.close(false);
  };

  const onFinish = (value) => {};

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoadingLogo(true);
      return;
    }
    if (info.fileList.length > 0) {
      setLogo(info.file.originFileObj);
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoadingLogo(false);
        setImageUrl(imageUrl);
      });
    }
  };

  const uploadButton = (
    <div>
      {loadingLogo ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      title={props.parent > 0 ? "Actualizar empresa" : "Agregar empresa"}
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button key="back" onClick={() => setVisible(false)}>
          Cancelar
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
        name="normal_login"
        onFinish={onFinish}
        layout={"vertical"}
        form={form}
      >
        <Form.Item name="id" label="id" style={{ display: "none" }}>
          <Input type="text" />
        </Form.Item>
        <Form.Item label="Logo" required>
          <Upload
            label="Logo"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            // onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
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
          <TextArea rows={4} showCount maxLength={200} />
        </Form.Item>
        <Form.Item name="FNode" label="Nodo padre">
          <Select
            allowClear
            showSearch
            placeholder="Select a person"
            optionFilterProp="children"
            name={"fNode"}
            notFoundContent={"No se encontraron resultados."}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {business.map((bus) => (
              <Option value={bus.id}>{bus.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateBusiness;

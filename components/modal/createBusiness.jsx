import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Spin,
  Upload,
} from "antd";
import { useState } from "react";
import WebApiPeople from "../../api/WebApiPeople";
import { messageError, messageSaveSuccess } from "../../utils/constant";

const { TextArea } = Input;
const { Option } = Select;

const ModalCreateBusiness = ({
  visible,
  setVisible,
  user,
  afterAction = null,
  ...props
}) => {
  const [form] = Form.useForm();
  const [business, setBusiness] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [logo, setLogo] = useState(null);
  const [addB, setAddB] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = (value) => {
    let data = new FormData();
    data.append("name", value.name);
    data.append("description", value.description);
    data.append("active", true);
    if (value.FNode) {
      data.append("parent", value.FNode ? value.FNode : null);
    }
    setAddB(true);

    data.append("person", user.id);
    setLoading(true);
    if (logo == null || logo == undefined) {
      // message.error("Agregue una imagen");
      // setAddB(false);
      // setLoading(false);
      // return;
    } else data.append("image", logo);
    WebApiPeople.createNode(data)
      .then((response) => {
        setLoading(false);
        setAddB(false);
        setLogo(null);
        setImageUrl(null);
        setLoadingLogo(false);
        afterAction(user.khonnect_id);
        setVisible(false);
        form.resetFields();
        setLoading(false);
        message.success(messageSaveSuccess);
      })
      .catch(function (error) {
        setAddB(false);
        message.error(messageError);
        setLoading(false);
        console.log(error);
      });
  };

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const uploadButton = (
    <div>
      {loadingLogo ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const configUpload = {
    label: "Logo",

    listType: "picture-card",

    className: "avatar-uploader",
    showUploadList: false,

    beforeUpload: (file) => {
      const isPNG = file.type === "image/png" || file.type === "image/jpg";
      if (!isPNG) {
        message.error(`${file.name} , No es una imagen.`);
      }
      return isPNG || Upload.LIST_IGNORE;
    },
    onChange: (image) => {
      if (image.file.status === "uploading") {
        setLoadingLogo(true);
        return;
      }
      if (image.file.status === "done") {
        if (image.fileList.length > 0) {
          setLogo(image.file.originFileObj);
          getBase64(image.file.originFileObj, (imageUrl) => {
            setLoadingLogo(false);
            setImageUrl(imageUrl);
          });
        }
      }
    },
  };

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
          disabled={addB}
        >
          Guardar
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <Form
          id="addBusinessForm"
          name="normal_login"
          onFinish={onFinish}
          layout={"vertical"}
          form={form}
        >
          <Form.Item label="Logo">
            <Upload {...configUpload}>
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
              placeholder="Selecciona una empresa"
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
      </Spin>
    </Modal>
  );
};

export default ModalCreateBusiness;

import React, { useEffect, useState } from "react";
import { withAuthSync } from "../../libs/auth";
import {
  Form,
  Input,
  Row,
  Upload,
  message,
  Col,
  Typography,
  Layout,
  Modal,
  Select,
  DatePicker,
  Space,
  Button,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_URL } from "../../config/config";

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("¡Solo puede cargar archivos JPG / PNG!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("¡La imagen debe tener un tamaño inferior a 2 MB!");
  }
  return isJpgOrPng && isLt2M;
};
const FormGroup = (props) => {
  const [forms] = Form.useForm();
  const [photo, setPhoto] = useState(null);
  const [image_, setImage_] = useState("");

  const [loading, setLoading] = useState(false);

  const { Title } = Typography;

  const onFinish = (values) => {
    if (props.isEdit) {
      saveGroup(values);
    } else {
      saveGroup(values);
    }
  };

  useEffect(() => {
    if (props.isEdit) {
      updateGroupVisible();
    }
  }, []);

  const updateGroupVisible = () => {
    console.log(props.group);
    forms.setFieldsValue({
      name: props.group.name,
      description: props.group.description ? props.group.description : "",
    });
    if (props.group.image) {
      setPhoto(props.group.image);
    }
  };

  const saveGroup = (data) => {
    let params = new FormData();
    params.append("name", data.name);
    if (data.description) {
      params.append("description", data.description);
    }
    if (data.image) {
      params.append("image", data.image.file.originFileObj);
    }
    if (props.isEdit) {
      axios
        .patch(API_URL + `/intranet/group/${props.group.id}/`, params)
        .then((res) => {
          closeDialog();
        })
        .catch((e) => {
          console.log("error", e);
          closeDialog();
        });
    } else {
      axios
        .post(API_URL + "/intranet/group/", params)
        .then((res) => {
          closeDialog();
        })
        .catch((e) => {
          console.log("error", e);
          closeDialog();
        });
    }
  };

  const closeDialog = () => {
    props.close();
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Cargar</div>
    </div>
  );

  const upImage = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setPhoto(imageUrl);
        setLoading(false);
      });
    }
  };

  const ruleRequired = { required: true, message: "Este campo es requerido" };

  return (
    <>
      <Layout>
        <Modal
          maskClosable={false}
          title={props.isEdit ? "Editar grupo" : "Agregar grupo"}
          centered
          visible={props.visible}
          onCancel={() => closeDialog()}
          footer={null}
          width={"50%"}
        >
          <Form onFinish={onFinish} form={forms}>
            <Form.Item
              label="Nombre de grupo"
              name="name"
              rules={[ruleRequired]}
              labelAlign={"left"}
            >
              <Input type="text" />
            </Form.Item>

            <Form.Item
              label="Descripción de grupo"
              name="description"
              labelAlign={"left"}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item label="Imagen de grupo" name="image" labelAlign={"left"}>
              <Upload
                name="avatar"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={upImage}
              >
                {photo ? (
                  <div
                    className="frontImage"
                    style={
                      photo
                        ? {
                            width: "190px",
                            height: "190px",
                            display: "flex",
                            flexWrap: "wrap",
                            textAlign: "center",
                            alignContent: "center",
                          }
                        : {}
                    }
                  >
                    <img
                      className="img"
                      src={photo}
                      alt="avatar"
                      preview={false}
                      style={{ width: 100 }}
                    />
                  </div>
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>

            <Form.Item labelAlign="right">
              <Space style={{ float: "right" }}>
                <Button onClick={() => closeDialog()}>Cancelar</Button>
                <Button type="primary" htmlType="submit">
                  {props.isEdit ? "Editar" : "Guardar"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </>
  );
};

export default withAuthSync(FormGroup);

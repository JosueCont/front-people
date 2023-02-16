import React, { useEffect, useState } from "react";
import { withAuthSync } from "../../libs/auth";
import {
  Form,
  Input,
  Upload,
  message,
  Typography,
  Layout,
  Modal,
  Space,
  Button,
  Spin,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_URL } from "../../config/config";
import { ruleRequired } from "../../utils/rules";
import WebApiIntranet from "../../api/WebApiIntranet";

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("¡Solo puede cargar archivos JPG / PNG!");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("¡La imagen debe tener un tamaño inferior a 2 MB!");
    return false;
  }
  return isJpgOrPng && isLt2M;
};
const FormGroup = (props) => {
  const [forms] = Form.useForm();
  const [photo, setPhoto] = useState(null);
  const [image_, setImage_] = useState("");

  const [loading, setLoading] = useState(false);

  const [loadingGroup, setLoadingGroup] = useState(false);

  const { Title } = Typography;
  const validateExtension = ".png,.pgj,.jpeg"

  const onFinish = (values) => {
    if (props.isEdit) {
      saveGroup(values);
      //message.success("Actualizado correctamente.");
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
    forms.setFieldsValue({
      name: props.group.name,
      description: props.group.description ? props.group.description : "",
    });
    if (props.group.image) {
      setPhoto(props.group.image);
    }
  };

  const saveGroup = async (data) => {
    let params = new FormData();
    params.append("node", props.companyId);
    params.append("name", data.name);
    if (data.description) {
      params.append("description", data.description);
    }
    if (data.image) {
      params.append("image", data.image.file.originFileObj);
    }
    if (props.isEdit) {
      setLoadingGroup(true);
      await WebApiIntranet.updGroup(props.group.id, params)
        .then((res) => {
          closeDialog();
          setLoadingGroup(false);
          message.success("Actualizado correctamente.");
        })
        .catch((e) => {
          setLoadingGroup(false);
          console.log(e);
          closeDialog();
          message.error("No se pudo realizar la acción, porfavor intente nuevamente.");
        });
    } else {
      setLoadingGroup(true);
      await WebApiIntranet.saveGroup(params)
        .then((res) => {
          closeDialog();
          setLoadingGroup(false);
          message.success("Guardado correctamente.");
        })
        .catch((e) => {
          console.log(e);
          setLoadingGroup(false);
          message.error("NO se pudo realizar la acción, porfavor intente nuevamente.");
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

    /* if (info.file.status === "done") { */
    if (info.fileList.length > 0) {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setPhoto(imageUrl);
        setLoading(false);
      });
    }
  };

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
          <Spin tip="Cargando..." spinning={loadingGroup}>
            <Form onFinish={onFinish} layout="vertical" form={forms}>
              <Form.Item
                label="Nombre de grupo"
                name="name"
                rules={[ruleRequired]}
                // labelAlign={"left"}
                help="(Máximo 50 caracteres)"
              >
                <Input type="text" maxLength={50} />
              </Form.Item>

              <Form.Item
                label="Descripción de grupo"
                name="description"
                // labelAlign={"left"}
                style={{ marginTop: 15 }}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                label={"Imagen de grupo"}
                name="image"
                // labelAlign={"left"}
                style={{ marginTop: 15 }}
                rules={!photo ? [ruleRequired] : []}
              >
                <Upload
                  label="avatar"
                  listType="picture-card"
                  showUploadList={false}
                  // beforeUpload={beforeUpload}
                  accept={'.jpg,.png,.jpeg'}
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
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={photo ? false : true}
                  >
                    {props.isEdit ? "Editar" : "Guardar"}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Spin>
        </Modal>
      </Layout>
    </>
  );
};

export default withAuthSync(FormGroup);

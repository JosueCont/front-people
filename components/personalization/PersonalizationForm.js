import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Tabs,
  Form,
  Row,
  Col,
  Layout,
  Input,
  Button,
  Select,
  Spin,
  Table,
  Modal,
  message,
  Switch,
  Upload,
  AutoComplete,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

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

const PersonalizationForm = (props) => {
  const [formConfigIntranet] = Form.useForm();
  const [photo, setPhoto] = useState(
    props.getImage ? props.getImage + "?" + new Date() : null
  );
  const [icon, setIcon] = useState(
    props.getIcon ? props.getIcon + "?" + new Date() : null
  );

  const [loading, setLoading] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState(false);

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

  const uploadButtonIcon = (
    <div>
      {loadingIcon ? <LoadingOutlined /> : <PlusOutlined />}
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
        saveImages(info.file.originFileObj);
        setLoading(false);
      });
    }
  };

  const upIcon = (info) => {
    if (info.file.status === "uploading") {
      setLoadingIcon(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setIcon(imageUrl);
        saveIcons(info.file.originFileObj);
        setLoadingIcon(false);
      });
    }
  };

  const saveIcons = (image) => {
    let params = new FormData();
    let imageSend = image ? image : "";
    if (props.config) {
      //update
      if (imageSend) {
        params.append("concierge_icon", imageSend);
      }
      props.saveIcon(params, "update", props.config.id);
    } else {
      //add
      if (image) {
        params.append("concierge_icon", imageSend);
        props.saveIcon(params, "add");
      }
    }
  };

  const saveImages = (image) => {
    let params = new FormData();
    let imageSend = image ? image : "";
    if (props.config) {
      //update
      if (imageSend) {
        params.append("concierge_logo", imageSend);
      }
      props.saveImage(params, "update", props.config.id);
    } else {
      //add
      if (image) {
        params.append("concierge_logo", imageSend);
        props.saveImage(params, "add");
      }
    }
  };

  useEffect(() => {
    getDataInfo();
  }, [props.config]);

  const getDataInfo = () => {
    if (props.config) {
      formConfigIntranet.setFieldsValue({
        primaryColor: props.config.concierge_primary_color,
        secondaryColor: props.config.concierge_secondary_color,
      });

      if (props.config.concierge_logo) {
        setPhoto(props.config.concierge_logo + "?" + new Date());
      }

      if (props.config.concierge_icon) {
        setIcon(props.config.concierge_icon + "?" + new Date());
      }
    }
  };

  const onFinish = (values) => {
    saveConfig(values);
  };

  const saveConfig = (data) => {
    let jsoForm = {
      concierge_primary_color: data.primaryColor ? data.primaryColor : "#000",
      concierge_secondary_color: data.secondaryColor
        ? data.secondaryColor
        : "#000",
    };

    if (props.config) {
      //update
      props.save(jsoForm, "update", props.config.id);
    } else {
      //add
      props.save(jsoForm, "add");
    }
  };

  return (
    <>
      <Layout className="site-layout-background">
        <Spin tip="Cargando..." spinning={props.loading}>
          <Form
            layout={"vertical"}
            form={formConfigIntranet}
            onFinish={onFinish}
          >
            <Row>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item name="primaryColor" label="Color primario">
                  <Input type={"color"} />
                </Form.Item>
              </Col>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item label="Color secundario" name="secondaryColor">
                  <Input type={"color"} />
                </Form.Item>
              </Col>

              <Col lg={3} xs={12} offset={1}>
                <Form.Item label="Imagen" name="image" labelAlign={"left"}>
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
              </Col>

              <Col lg={3} xs={12} offset={1}>
                <Form.Item label="Icono" name="icon" labelAlign={"left"}>
                  <Upload
                    name="avatarIcon"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={upIcon}
                  >
                    {icon ? (
                      <div
                        className="frontImage"
                        style={
                          icon
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
                          src={icon}
                          alt="avatar"
                          preview={false}
                          style={{ width: 100 }}
                        />
                      </div>
                    ) : (
                      uploadButtonIcon
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"end"} gutter={20} style={{ marginBottom: 20 }}>
              <Col>
                <Button type="primary" htmlType="submit">
                  Guardar
                </Button>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Layout>
    </>
  );
};
export default PersonalizationForm;

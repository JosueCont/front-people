import {
  Form,
  Modal,
  message,
  Layout,
  Select,
  Upload,
  Button,
  Space,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useCallback, useEffect, useState, useRef } from "react";

import {
  UploadOutlined,
  CloudUploadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Axios from "axios";
import { API_URL } from "../../config/config";

const documentModal = (props) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState();
  const [disabled, setDisabled] = useState(true);
  const [documentType, setDocumentType] = useState([]);
  const inputFileRef = useRef(null);
  const [fileName, setfileName] = useState("");

  const closeDialog = () => {
    props.close(false);
    form.resetFields();
  };

  useEffect(() => {
    Axios.get(API_URL + "/setup/document-type/")
      .then((response) => {
        let dt = response.data.results;
        dt = dt.map((a) => {
          return { label: a.name, value: a.id };
        });
        setDocumentType(dt);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const selectedFile = (file) => {
    // console.log("FILE Up-->> ", file);
    if (file.target.files.length > 0) {
      //   console.log("FILE UPLOAD-->> ", file.target.files[0]);
      setDisabled(false);
      setFile(file.target.files[0]);
      setfileName(file.target.files[0].name);
    } else {
      setDisabled(true);
      setFile(null);
      setfileName(null);
    }
  };

  const onFinish = (value) => {
    // console.log("FORM-->>> ", value);
    console.log("FILE-->>> ", file);
    let data = new FormData();
    data.append("document", file);
    data.append("person", props.person);
    data.append("document_type", value.document_type);
    data.append("description", value.description);
    console.log("FOMR-->> ", data);
    uploadDocument(data);
  };

  const uploadDocument = (data) => {
    console.log("DATA-->> ", data);
    Axios.post(API_URL + "/person/document/", data)
      .then((response) => {
        message.success({
          content: "Cargado correctamente.",
          className: "custom-class",
        });
        closeDialog();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteFileSelect = () => {
    setFile(null);
    setDisabled(true);
    setfileName(null);
  };

  const ruleRequired = { required: true, message: "Este campo es requerido" };

  return (
    <>
      <Layout>
        <Modal
          maskClosable={false}
          title="Subir documemnto"
          centered
          visible={props.visible}
          onCancel={() => closeDialog()}
          footer={null}
        >
          <Form onFinish={onFinish} form={form}>
            <Form.Item name="document_type" rules={[ruleRequired]}>
              <Select options={documentType} placeholder="Tipo de documento" />
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => {
                  inputFileRef.current.click();
                }}
                icon={<UploadOutlined />}
              >
                Cargar documento
              </Button>
              {disabled ? (
                ""
              ) : (
                <span style={{ marginLeft: 8, border: "1px blue solid" }}>
                  {fileName + "  "}
                  <CloseCircleOutlined
                    onClick={() => deleteFileSelect()}
                    style={{ color: "red" }}
                  />
                </span>
              )}
              <input
                ref={inputFileRef}
                type="file"
                style={{ display: "none" }}
                onChange={(e) => selectedFile(e)}
              />
            </Form.Item>
            <Form.Item name="description">
              <TextArea type="text" placeholder="Descripción..." />
            </Form.Item>

            <Form.Item labelAlign="right">
              <Space style={{ float: "right" }}>
                <Button type="danger" onClick={() => closeDialog()}>
                  Cancelar
                </Button>
                <Button
                  disabled={disabled}
                  icon={<CloudUploadOutlined />}
                  type="primary"
                  htmlType="submit"
                >
                  Subir
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </>
  );
};

export default documentModal;

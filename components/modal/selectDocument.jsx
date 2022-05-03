import { Form, Modal, message, Layout, Select, Button, Space } from "antd";
import { useEffect, useState, useRef } from "react";

import {
  UploadOutlined,
  CloudUploadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { ruleRequired } from "../../utils/rules";
import { connect } from "react-redux";

const ModalSelectDocument = ({
  person_id,
  node,
  title = null,
  idDoc = null,
  ...props
}) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState();
  const [disabled, setDisabled] = useState(true);
  const [documents, setDocuments] = useState([]);
  const inputFileRef = useRef(null);
  const [fileName, setfileName] = useState("");

  const closeDialog = () => {
    props.close(false);
    form.resetFields();
  };

  useEffect(() => {
    if (idDoc) {
      getInfoDocument();
    }
  }, [idDoc]);

  const selectedFile = (file) => {
    if (file.target.files.length > 0) {
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
    let data = new FormData();
    let doc = getDescription(value.document);
    data.append("description", doc.label);
    data.append("id_document", doc.value);
    data.append("person", person_id);
    data.append("document_type", value.document_type);
    if (idDoc) {
      if (file) {
        data.append("document", file);
        updateDocument(data);
      } else {
        message.warning({
          content: "Debe seleccionar un archivo diferente.",
          className: "custom-class",
        });
      }
    } else {
      data.append("document", file);

      uploadDocument(data);
    }
  };

  const onChangeType = (value) => {
    getDocuments(value);
    form.setFieldsValue({
      document: "",
    });
  };

  const getDescription = (value) => {
    let doc = documents.find((element) => element.value == value);
    if (doc) {
      return doc;
    }
  };

  const getDocuments = async (value) => {
    Axios.get(API_URL + `/person/document-details/?document_type=${value}`)
      .then((response) => {
        let docs = response.data.results;
        docs = docs.map((a) => {
          return { label: a.description, value: a.id };
        });
        setDocuments(docs);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const uploadDocument = (data) => {
    setDisabled(true);
    Axios.post(API_URL + "/person/document/", data)
      .then((response) => {
        message.success({
          content: "Cargado correctamente.",
          className: "custom-class",
        });
        closeDialog();
        deleteFileSelect();
        setDisabled(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updateDocument = (data) => {
    setDisabled(true);
    Axios.put(API_URL + `/person/document/${idDoc}/`, data)
      .then((response) => {
        message.success({
          content: "Cargado correctamente.",
          className: "custom-class",
        });
        closeDialog();
        deleteFileSelect();
        setDisabled(false);
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

  const getInfoDocument = async () => {
    Axios.get(API_URL + `/person/document/${idDoc}/`)
      .then((response) => {
        let doc = response.data;
        getDocuments(doc.document_type.id);
        setfileName(doc.document);
        setDisabled(false);
        form.setFieldsValue({
          document_type: doc.document_type.id,
          document: doc.document_detail,
        });
        getDocuments(doc.document_type.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Layout>
        <Modal
          maskClosable={false}
          title={title}
          centered
          visible={props.visible}
          onCancel={() => closeDialog()}
          footer={null}
        >
          <Form onFinish={onFinish} form={form}>
            <Form.Item name="document_type" rules={[ruleRequired]}>
              <Select
                options={props.document_type.map((item) => {
                  console.log(item);
                  return { value: item.id, label: item.name };
                })}
                placeholder="Tipo de documento"
                onChange={onChangeType}
                notFoundContent={"No se encontraron resultados."}
              />
            </Form.Item>
            <Form.Item name="document" rules={[ruleRequired]}>
              <Select
                options={documents}
                placeholder="Documento"
                notFoundContent={"No se encontraron resultados."}
              />
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

const mapState = (state) => {
  return { document_type: state.catalogStore.cat_document_type };
};

export default connect(mapState)(ModalSelectDocument);

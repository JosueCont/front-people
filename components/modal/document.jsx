import { Form, Modal, message, Layout, Select, Button, Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useEffect, useState, useRef } from "react";

import {
  UploadOutlined,
  CloudUploadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { getDocumentType } from "../../redux/catalogCompany";
import { connect } from "react-redux";
import { ruleRequired } from "../../utils/rules";
import axiosApi from "../../api/axiosApi";

const documentModal = ({ person_id, node,getDocumentType, ...props }) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState();
  const [disabled, setDisabled] = useState(true);
  const inputFileRef = useRef(null);
  const [fileName, setfileName] = useState("");

  const closeDialog = () => {
    props.close(false);
    form.resetFields();
  };

  useEffect(()=>{
    getDocumentType(node)
  },[])

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
    data.append("document", file);
    data.append("person", person_id);
    data.append("document_type", value.document_type);
    data.append("description", value.description);
    uploadDocument(data);
  };

  const uploadDocument = (data) => {
    setDisabled(true);
    axiosApi.post("/person/document/", data)
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

  return (
    <>
      <Layout>
        <Modal
          maskClosable={false}
          title="Subir documento"
          centered
          visible={props.visible}
          onCancel={() => closeDialog()}
          footer={null}
        >
          <Form
            onFinish={onFinish}
            form={form}
            className="form-details-person"
          >
            <Form.Item name="document_type" rules={[ruleRequired]}>
              <Select
                options={props.cat_document_type.map((item) => {
                  return { label: item.name, value: item.id };
                })}
                placeholder="Tipo de documento"
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
            <Form.Item name="description" rules={[ruleRequired]}>
              <TextArea
                type="text"
                placeholder="Descripción"
                showCount
                maxLength={200}
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
  return { cat_document_type: state.catalogStore.cat_document_type };
};

export default connect(mapState,{getDocumentType})(documentModal);

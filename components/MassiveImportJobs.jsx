import { Form, Button, Space, Input, message } from "antd";
import { useState, useRef } from "react";
import {
  UploadOutlined,
  CloudUploadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import WebApiPeople from "../api/WebApiPeople";
import { userCompanyId } from "../libs/auth";

const MassiveImportJobs = ({ nodePeople, setLoadingTable }) => {
  let nodeId = userCompanyId();
  const [form] = Form.useForm();
  const [file, setFile] = useState();
  const [disabled, setDisabled] = useState(true);
  const inputFileRef = useRef(null);
  const [fileName, setfileName] = useState("");

  const selectedFile = (file) => {
    let extension = getFileExtension(file.target.files[0].name);
    if (extension === "xlsx") {
      if (file.target.files.length > 0) {
        setDisabled(false);
        setFile(file.target.files[0]);
        setfileName(file.target.files[0].name);
      } else {
        setDisabled(true);
        setFile(null);
        setfileName(null);
      }
    } else {
      message.error("Formato incorrecto");
    }
  };

  const getFileExtension = (filename) => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
  };

  const onFinish = (value) => {
    let data = new FormData();
    data.append("node_id", nodeId);
    data.append("File", file);
    saveDepartments(data);
  };

  const saveDepartments = async (data) => {
    try {
      setDisabled(true);
      setLoadingTable(true);
      let response = await WebApiPeople.saveMassiveJobs(data);
      if (response.status == 200) {
        message.success("Cargado correctamente");
      } else {
        message.error("Error al cargar");
      }
      setLoadingTable(false);
    } catch (error) {
      message.error("Ocurrió un error");
      console.log(error);
      setLoadingTable(false);
    }
  };

  const deleteFileSelect = () => {
    setFile(null);
    setDisabled(true);
    setfileName(null);
  };

  return (
    <>
      <Form form={form} onFinish={onFinish}>
        <Form.Item>
          <Input readOnly value={nodePeople} />
        </Form.Item>
        <Form.Item>
          <Button
            onClick={() => {
              inputFileRef.current.click();
            }}
            icon={<UploadOutlined />}
          >
            Cargar puestos
          </Button>
          {disabled ? (
            ""
          ) : (
            <span
              style={{
                marginLeft: 8,
                border: "1px blue solid",
              }}
            >
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
            <Button type="danger" onClick={() => deleteFileSelect()}>
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
    </>
  );
};
export default MassiveImportJobs;

import { Button, Col } from "antd";
import { UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";

const UploadFile = ({
  textButton,
  setDataFile,
  file_name,
  setFileName,
  set_disabled = null,
  ...props
}) => {
  const inputFileRef = useRef(null);
  const [disabled, setDisabled] = useState(true);
  const [file, setFile] = useState();
  const [fileName, setfileName] = useState("");

  const selectedFile = (file) => {
    if (file.target.files.length > 0) {
      setDisabled(false);
      setFile(file.target.files[0]);
      setfileName(file.target.files[0].name);
      /* Funciones componente padre */
      setDataFile(file.target.files[0]);
      setFileName(file.target.files[0].name);
    } else {
      setDisabled(true);
      setFile(null);
      setfileName(null);
      /* Funciones componente padre */
      setDataFile(null);
      setFileName(null);
    }
  };
  const deleteFileSelect = () => {
    setFile(null);
    setDisabled(true);
    setfileName(null);
    /* Funciones componente padre */
    setFileName(null);
  };

  useEffect(() => {}, file);

  useEffect(() => {
    if (file_name) {
      setfileName(file_name);
    }
  }, [file_name]);

  useEffect(() => {
    setDisabled(set_disabled);
  }, [set_disabled]);

  return (
    <>
      <Col span={24} offset={1} style={{ marginBottom: "10px" }}>
        <Button
          style={{ minWidth: "165px", textAlign: "left" }}
          onClick={() => {
            inputFileRef.current.click();
          }}
          icon={<UploadOutlined />}
        >
          {textButton}
        </Button>
        {!disabled && (
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
      </Col>
    </>
  );
};

export default UploadFile;

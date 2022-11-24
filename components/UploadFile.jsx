import { Button, Col, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UploadFile = ({
  textButton = "Subir documento",
  validateExtension = ".xlsx",
  set_disabled = false,
  showList = false,
  setFile,
  size = "large",
  ...props
}) => {
  return (
    <>
      <Col span={24} offset={1} style={{ marginBottom: "10px" }}>
        <Upload
          {...{
            showUploadList: showList,
            listType: "picture",
            maxCount: 1,
            beforeUpload: (file) => {
              const isValid = file.name.includes(validateExtension);

              if (!isValid) {
                message.error(`${file.name} no es un ${validateExtension}.`);
              }
              if (file.size > 30720){
                message.error(`${file.name} es mayor a 30MB.`);
              }
              return isValid || Upload.LIST_IGNORE;
            },
            onChange(info) {
              const { status } = info.file;
              if (status !== "uploading") {
                if (info.fileList.length > 0) {
                  setFile(info.fileList[0].originFileObj);
                  info.file = null;
                  info.fileList = [];
                }
              }
            },
          }}
          accept = {validateExtension}
        >
          <Button size={size} icon={<UploadOutlined />}>
            {textButton}
          </Button>
        </Upload>
      </Col>
    </>
  );
};

export default UploadFile;

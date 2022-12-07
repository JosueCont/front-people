import { Button, Col, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UploadCerOrPfxFile = ({
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
      <Col span={24} style={{ marginBottom: "10px" }}>
        <Upload
          {...{
            showUploadList: showList,
            listType: "picture",
            maxCount: 1,
            disabled: set_disabled,
            beforeUpload: (file) => {
              let extensions = validateExtension.split(',')
              let isValid = ""
              console.log('Extensions', extensions)
              if(extensions.length > 1){
                isValid = file.name.includes(extensions[0]) || file.name.includes(extensions[1])
              } else {
                isValid = file.name.includes(validateExtension);
              }
              // const isValid = file.name.includes(validateExtension);
              const isBig = file.size > 30720

              if (!isValid) {
                message.error(`${file.name} no es un ${validateExtension}.`);
              }
              // if (!isBig){
              //   message.error(`${file.name} es mayor a 30MB.`);
              // }
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

export default UploadCerOrPfxFile;

import { connect, useSelector } from "react-redux";
import {
  DownloadOutlined,
  DownOutlined,
  UploadOutlined,
  FileExcelOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Space,
  Alert,
  Table,
  Row,
  Col,
  Dropdown,
  Menu,
  message,
  Upload,
  Switch,
} from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { downLoadFileBlob, getDomain } from "../../../utils/functions";
import { API_URL_TENANT } from "../../../config/config";
import { useEffect, useState } from "react";
import WebApiPayroll from "../../../api/WebApiPayroll";

const MOVEMENTS_TYPE = {
  UPDATE_SALARY: 1, // Esste es para la parte de actualizar salarios
  IMSS_REGISTER: 2, // para la alta de IMSS
};

const ButtonUpdateSalary = ({
  person,
  node,
  payrollPerson,
  personsList,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const user = useSelector((state) => state.userStore.user);
  const [fileName, setFileName] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [personsListErrors, setPersonsListErrors] = useState(null);
  const [currentMovement, setCurrentMovement] = useState({
    title: "Actualizar salarios",
    urlDownload: "/person/person/generate_template/?type=1",
    nameTemplate: "actualizar_salarios.xlsx",
  });
  const [movements, setMovements] = useState([]);
  const [generateMovement, setGenerateMovement] = useState(false);

  useEffect(() => {
    if (showModal) {
      setPersonsListErrors(null);
      setCurrentFile(null);
      setFileName(null);
    }
  }, [showModal]);

  const importData = (type) => {
    if (currentFile)
      switch (type) {
        case MOVEMENTS_TYPE.UPDATE_SALARY:
          importMovementUpdate(currentFile);
          break;
        case MOVEMENTS_TYPE.IMSS_REGISTER:
          importImssPerson(currentFile);
          break;
        default:
          break;
      }
  };

  const importImssPerson = async (file) => {
    console.log(file);
    setLoading(true);
    let formdata = new FormData();
    formdata.append("modified_by", user.id);
    formdata.append("node_id", node.id);
    formdata.append("File", file);
    try {
      const resp = await WebApiPayroll.importIMSSPerson(formdata);
      console.log(resp);
      message.info(resp.data.message);
      if (resp.data?.data) {
        let arrPersonas = resp.data.data.filter((person) => !person?.status);
        if (arrPersonas.length > 0) {
          setPersonsListErrors(arrPersonas);
          console.log(arrPersonas);
        } else {
          setPersonsListErrors(null);
          setShowModal(false);
        }
      }
    } catch (e) {
      message.error(
        "Hubo un error al cargar la información, por favor intente nuevamente o revise su archivo."
      );
      console.log(e);
    } finally {
      setLoading(false);
      setFileName(null);
      setCurrentFile(null);
      //setShowModal(false)
    }
  };

  const importMovementUpdate = async (file) => {
    console.log(file);
    setLoading(true);
    let formdata = new FormData();
    formdata.append("modified_by", user.id);
    formdata.append("File", file);
    formdata.append("generate_movement", generateMovement);
    try {
      const resp = await WebApiPayroll.importSalaryModification(formdata);
      console.log(resp);
      message.info(resp.data.message);
      if (resp.data?.data) {
        let arrPersonas = resp.data.data.filter((person) => !person?.status);
        if (arrPersonas.length > 0) {
          setPersonsListErrors(arrPersonas);
          console.log(arrPersonas);
        } else {
          setPersonsListErrors(null);
          setShowModal(false);
        }
      }
    } catch (e) {
      message.error(
        "Hubo un error al cargar la información, por favor intente nuevamente o revise su archivo."
      );
      console.log(e);
    } finally {
      setLoading(false);
      setFileName(null);
      setCurrentFile(null);
      //setShowModal(false)
    }
  };

  const openModal = (type = MOVEMENTS_TYPE.UPDATE_SALARY) => {
    setFileName(null);
    console.log(personsList);

    setCurrentMovement({
      title: "Actualizar salarios",
      urlDownload: "/payroll/payroll-person/export_salary_modification/",
      typeImport: MOVEMENTS_TYPE.UPDATE_SALARY,
      paramsDownload: {
        person_id_array: [...personsList?.selectedRowKeys],
        node: node?.id,
        generate_movement: generateMovement,
      },
      type: "POST",
      nameTemplate: "actualizar_salarios.xlsx",
      description:
        "Esta sección te permite actualizar salarios de manera masiva, descarga el template, modifica y vuelve a subirlo.",
    });
    setShowModal(true);
  };

  const changeGenerateMovement = (value) => {
    let current_movement = currentMovement;
    current_movement.paramsDownload.generate_movement = !generateMovement;
    setCurrentMovement(current_movement);
    setGenerateMovement(!generateMovement);
  };

  return (
    <>
      <Button
        style={{
          //   marginBottom: "10px",
          paddingTop: 0,
          background: "#434343",
          color: "#ffff",
        }}
        onClick={() => openModal(MOVEMENTS_TYPE.UPDATE_SALARY)}
        // style={menuDropDownStyle}
      >
        Actualizar Salario
      </Button>

      <Modal
        title={currentMovement.title}
        visible={showModal}
        onOk={() => importData(currentMovement.typeImport)}
        onCancel={() => setShowModal(false)}
        okText="Aceptar"
        confirmLoading={loading}
        cancelText="Cancelar"
      >
        <Row>
          <Col span={24}>
            <Alert
              style={{ marginBottom: 20 }}
              showIcon
              message={currentMovement.description}
              type={"info"}
            />
          </Col>
          <Col span={24}>
            {currentMovement.typeImport == MOVEMENTS_TYPE.UPDATE_SALARY && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  marginBottom: 20,
                }}
              >
                <label style={{ fontweight: "bold", marginBottom: 10 }}>
                  ¿Generar movimientos en IMSS?
                </label>
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  onChange={changeGenerateMovement}
                />
              </div>
            )}

            <Space align={"start"}>
              <Space direction={"vertical"}>
                <Upload
                  {...{
                    showUploadList: false,
                    beforeUpload: (file) => {
                      const isXlsx = file.name.includes(".xlsx");
                      if (!isXlsx) {
                        message.error(`${file.name} no es un xlsx.`);
                      }
                      return isXlsx || Upload.LIST_IGNORE;
                    },
                    onChange(info) {
                      const { status } = info.file;
                      if (status !== "uploading") {
                        setPersonsListErrors(null);
                        if (info.fileList.length > 0) {
                          //   setFileName(info?.fileList[0]?.originFileObj?.name);
                          //   setCurrentFile(info?.fileList[0]?.originFileObj);
                          setFileName(info?.file?.originFileObj?.name);
                          setCurrentFile(info?.file?.originFileObj);
                          info.file = null;
                          info.fileList = [];
                        } else {
                          setCurrentFile(null);
                          setFileName(null);
                        }
                      }
                    },
                  }}
                >
                  <Button
                    size="middle"
                    icon={<UploadOutlined />}
                    style={{ marginBottom: "10px" }}
                  >
                    Importar datos
                  </Button>
                </Upload>
                <p>
                  {"     "} {fileName}
                </p>
              </Space>
              <a
                href={"."}
                className={"ml-20 "}
                style={buttonLink}
                onClick={(e) => {
                  e.preventDefault();
                  downLoadFileBlob(
                    `${getDomain(API_URL_TENANT)}${
                      currentMovement.urlDownload
                    }`,
                    currentMovement.nameTemplate,
                    currentMovement.type,
                    currentMovement.paramsDownload
                  );
                }}
              >
                <FileExcelOutlined style={{ color: "#2682FE" }} /> Descargar
                plantilla
              </a>
            </Space>
          </Col>
          <Col span={24}>
            {personsListErrors && (
              <p>
                <b>Resumen no actualizado:</b>
              </p>
            )}
            <ul>
              {personsListErrors &&
                personsListErrors.map((p) => {
                  return (
                    <li style={{ padding: 10 }}>
                      <Alert
                        message={`${p.person} ${p.message}`}
                        type="error"
                      />
                    </li>
                  );
                })}
            </ul>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

const buttonLink = {
  color: "#2682FE",
};

// const menuDropDownStyle = {
//   background: "#434343",
//   color: "#ffff",
// };

export default ButtonUpdateSalary;

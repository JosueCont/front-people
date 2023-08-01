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
  Spin,
} from "antd";
import { downLoadFileBlob, downLoadFileBlobAwait, getDomain } from "../../../utils/functions";
import { API_URL_TENANT } from "../../../config/config";
import { useEffect, useState } from "react";
import WebApiPayroll from "../../../api/WebApiPayroll";

const MOVEMENTS_TYPE = {
  UPDATE_SALARY: 1, // Esste es para la parte de actualizar salarios
  IMSS_REGISTER: 2, // para la alta de IMSS
};

const ButtonAltaImssImport = ({
  person,
  regPatronal = null,
  node,
  payrollPerson,
  personsList,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const user = useSelector((state) => state.userStore.user);
  const regPatronals = useSelector(
    (state) => state.catalogStore.cat_patronal_registration
  );
  const [regPatronalSelected, setRegPatronalSelected] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [personsListErrors, setPersonsListErrors] = useState(null);
  const [currentMovement, setCurrentMovement] = useState({
    title: "Actualizar salarios",
    urlDownload: "/person/person/generate_template/?type=1",
    nameTemplate: "actualizar_salarios.xlsx",
  });
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    if (showModal) {
      setPersonsListErrors(null);
      setCurrentFile(null);
      setFileName(null);
    }
  }, [showModal]);

  useEffect(() => {
    if (regPatronal) {
      let _regPatronal = regPatronals.find((ele) => ele.id === regPatronal);
      setRegPatronalSelected(_regPatronal);
    }
  }, [regPatronal]);

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
    
    setLoading(true);
    let formdata = new FormData();
    formdata.append("modified_by", user.id);
    formdata.append("patronal_registration", regPatronal);
    formdata.append("File", file);
    try {
      const resp = await WebApiPayroll.importIMSSPerson(formdata);
      
      message.info(resp.data.message);
      props.onFinish();
      if (resp.data?.data) {
        let arrPersonas = resp.data.data.filter((person) => !person?.status);
        if (arrPersonas.length > 0) {
          setPersonsListErrors(arrPersonas);
          
        } else {
          setPersonsListErrors(null);
          setShowModal(false);
        }
      }
    } catch (e) {
      message.error(
        "Hubo un error al cargar la información, por favor intente nuevamente o revise su archivo."
      );
    } finally {
      setLoading(false);
      setFileName(null);
      setCurrentFile(null);
      //setShowModal(false)
    }
  };

  const importMovementUpdate = async (file) => {
    
    setLoading(true);
    let formdata = new FormData();
    formdata.append("modified_by", user.id);
    formdata.append("File", file);
    try {
      const resp = await WebApiPayroll.importSalaryModification(formdata);
      
      message.info(resp.data.message);
      if (resp.data?.data) {
        let arrPersonas = resp.data.data.filter((person) => !person?.status);
        if (arrPersonas.length > 0) {
          setPersonsListErrors(arrPersonas);
          
        } else {
          setPersonsListErrors(null);
          setShowModal(false);
        }
      }
    } catch (e) {
      message.error(
        "Hubo un error al cargar la información, por favor intente nuevamente o revise su archivo."
      );
      
    } finally {
      setLoading(false);
      setFileName(null);
      setCurrentFile(null);
      //setShowModal(false)
    }
  };

  const openModal = (type = MOVEMENTS_TYPE.UPDATE_SALARY) => {
    setFileName(null);

    setCurrentMovement({
      title: "Alta IMSS",
      urlDownload: "/payroll/export-layout-imss-register",
      typeImport: MOVEMENTS_TYPE.IMSS_REGISTER,
      paramsDownload: {
        node: node?.id,
      },
      type: "POST",
      nameTemplate: "alta_imss.xlsx",
      description: `Esta sección te permite generar alta de persona con los datos mínimos de IMSS. Estará ligado al registro patronal seleccionado ${
        regPatronalSelected && regPatronalSelected.code
      }. `,
    });
    setShowModal(true);
  };

  return (
    <>
      <Button
        disabled={!regPatronal}
        onClick={() => openModal(MOVEMENTS_TYPE.IMSS_REGISTER)}
        style={menuDropDownStyle}
      >
        Generar alta IMSS
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
            <p>
              <b>Reg.Patronal: </b>
              {regPatronalSelected && regPatronalSelected.code}
            </p>
            <Alert
              style={{ marginBottom: 20 }}
              showIcon
              message={currentMovement.description}
              type={"info"}
            />
          </Col>
          <Col span={24}>
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
                        
                        if (info.file) {
                          setFileName(info?.file?.originFileObj?.name);
                          setCurrentFile(info?.file?.originFileObj);
                          info.file = null;
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
              <a type="link" 
                className={"ml-20 "}
                style={buttonLink}
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  downLoadFileBlobAwait(
                    `${getDomain(API_URL_TENANT)}${
                      currentMovement.urlDownload
                    }`,
                    currentMovement.nameTemplate,
                    currentMovement.type,
                    currentMovement.paramsDownload,
                    "",
                    setLoading
                  );
                }}
              > 
                {
                  loading ? <Spin spinning={loading} /> : <FileExcelOutlined style={{ color: "#2682FE" }} /> 
                }
                Descargar plantilla 
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

const menuDropDownStyle = {
  background: "#434343",
  color: "#ffff",
};

export default ButtonAltaImssImport;

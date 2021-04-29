import {
  Input,
  Layout,
  Table,
  Breadcrumb,
  Button,
  Row,
  Col,
  Modal,
  message,
  Upload,
  Form,
  Select,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import MainLayout from "../../layout/MainLayout";
const { Content } = Layout;
const { confirm } = Modal;
import Axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { userCompanyId, withAuthSync } from "../../libs/auth";
import { API_URL } from "../../config/config";
import moment from "moment";

import SelectCompany from "../../components/selects/SelectCompany";
import SelectDepartment from "../../components/selects/SelectDepartment";
import BreadcrumbHome from "../../components/BreadcrumbHome";
import SelectCollaborator from "../../components/selects/SelectCollaboratorItemForm";
import jsCookie from "js-cookie";

const { Dragger } = Upload;

const UploadPayroll = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [personList, setPersonList] = useState(null);
  const inputFileRef = useRef(null);

  /* Variables */
  const [companyId, setCompanyId] = useState(null);
  const [departamentId, setDepartamentId] = useState(null);
  const [permissions, setPermissions] = useState({});
  let nodeId = userCompanyId();
  let id_payroll = 0;

  const getVouchers = async (
    collaborator = null,
    department = null,
    rfc = null
  ) => {
    setLoading(true);
    try {
      let url = `/payroll/payroll-voucher/?person__node__id=${nodeId}&`;
      if (collaborator) {
        url += `person__id=${collaborator}&`;
      }
      if (rfc) {
        url += `rfc=${rfc}&`;
      }

      if (department) {
        url += `person__person_department__id=${department}&`;
      }
      let response = await Axios.get(API_URL + url);
      response.data.results.forEach((element, i) => {
        element.key = i;
        element.timestamp = moment(element.timestamp).format("DD-MM-YYYY");
      });
      let data = response.data.results;
      setLoading(false);
      setVouchers(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const getAllPersons = async () => {
    try {
      let response = await Axios.get(API_URL + `/person/person/`);
      let data = response.data.results;
      let list = [];
      data = data.map((a, index) => {
        let item = {
          label: a.first_name + " " + a.flast_name,
          value: a.id,
          key: a.id + index,
        };
        list.push(item);
      });
      setPersonList(list);
    } catch (e) {
      console.log(e);
    }
  };

  const filter = async (values) => {
    setLoading(true);
    getVouchers(values.collaborator, departamentId, values.rfc);
  };

  /* Eventos de componentes */
  const onChangeCompany = (val) => {
    form.setFieldsValue({
      department: null,
    });
    setCompanyId(val);
  };

  const changeDepartament = (val) => {
    setDepartamentId(val);
  };

  useEffect(() => {
    const jwt = JSON.parse(jsCookie.get("token"));
    searchPermissions(jwt.perms);
    getVouchers();
    getAllPersons();
  }, [router]);

  const searchPermissions = (data) => {
    const perms = {};
    data.map((a) => {
      if (a.includes("people.payrollvoucher.can.view")) perms.view = true;
      if (a.includes("people.payrollvoucher.can.create")) perms.create = true;
      if (a.includes("people.payrollvoucher.can.edit")) perms.edit = true;
      if (a.includes("people.payrollvoucher.can.delete")) perms.delete = true;
      if (a.includes("people.payrollvoucher.function.import_payrollvoucher"))
        perms.import = true;
    });
    setPermissions(perms);
  };

  const importPDF = async (e) => {
    let extension = getFileExtension(e.target.files[0].name);
    if (extension == "pdf") {
      let formData = new FormData();
      formData.append("pdf", e.target.files[0]);
      formData.append("id", id_payroll);
      setLoading(true);
      Axios.post(
        API_URL + `/payroll/payroll-voucher/import_pdf_voucher/`,
        formData
      )
        .then((response) => {
          // setDisabledImport(true);
          setLoading(false);
          message.success("PDF importado correctamente.");
        })
        .catch((e) => {
          setLoading(false);
          message.error("Error al importar.");
          console.log(e);
        });
    } else {
      message.error("Formato incorrecto, suba un archivo .pdf");
    }
  };
  const getFileExtension = (filename) => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
  };

  const columns = [
    {
      title: "RFC",
      dataIndex: "rfc",
      key: "rfc",
    },
    {
      title: "Fecha de creación",
      render: (item) => {
        return <div>{item.timestamp}</div>;
      },
    },
    {
      title: "Total percepciones",
      dataIndex: "total_perceptions",
      key: "total_perceptions",
    },
    {
      title: "Total deducciones",
      dataIndex: "total_deductions",
      key: "total_deductions",
    },
    {
      title: "Número de días pagados",
      dataIndex: "number_of_days_paid",
      key: "number_of_days_paid",
    },
    {
      title: "Acciones",
      key: "id",
      render: (text, record) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <Tooltip placement="topLeft" title="Ver detalle">
                  <a
                    onClick={() =>
                      router.push({
                        pathname: "/payrollvoucher/detail",
                        query: { type: "detail", id: record.id },
                      })
                    }
                  >
                    <EyeOutlined />
                  </a>
                </Tooltip>
              </Col>
              <Col className="gutter-row" span={6}>
                <Tooltip placement="topLeft" title="Importar PDF">
                  <a
                    type="primary"
                    className={"ml-20"}
                    icon={<UploadOutlined />}
                    onClick={() => {
                      inputFileRef.current.click();
                      id_payroll = record.id;
                    }}
                  >
                    <UploadOutlined />
                  </a>
                  <input
                    ref={inputFileRef}
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => importPDF(e)}
                  />
                </Tooltip>
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];

  const resetFilter = () => {
    form.resetFields();
    getAllPersons();
    getVouchers();
  };

  return (
    <MainLayout currentKey="9">
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Recibos de nómina</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        {permissions.view ? (
          <>
            <Row justify="space-between">
              <Col>
                <Form
                  name="filter"
                  onFinish={filter}
                  layout="vertical"
                  key="formFilter"
                  className={"formFilter"}
                  form={form}
                >
                  <Row gutter={[24, 8]}>
                    <Col>
                      <SelectCollaborator
                        style={{ width: 150 }}
                        key="collaborator"
                        name="collaborator"
                        label="Colaborador"
                      />
                    </Col>
                    <Col>
                      <Form.Item key="rfc" name="rfc" label="Rfc">
                        <Input placeholder="Rfc" />
                      </Form.Item>
                    </Col>
                    {/* <Col>
                      <SelectCompany
                        name="company"
                        label="Empresa"
                        onChange={onChangeCompany}
                        key="SelectCompany"
                        style={{ width: 150 }}
                      />
                    </Col> */}
                    <Col>
                      <SelectDepartment
                        companyId={nodeId}
                        onChange={changeDepartament}
                        key="SelectDepartment"
                      />
                    </Col>
                    <Col style={{ display: "flex" }}>
                      <Button
                        style={{
                          background: "#fa8c16",
                          fontWeight: "bold",
                          color: "white",
                          marginTop: "auto",
                        }}
                        key="buttonFilter"
                        htmlType="submit"
                        loading={loading}
                      >
                        <SearchOutlined />
                      </Button>
                    </Col>
                    <Col style={{ display: "flex" }}>
                      <Tooltip
                        title="Limpiar filtros"
                        color={"#3d78b9"}
                        key={"#3d78b9"}
                      >
                        <Button
                          onClick={() => resetFilter()}
                          style={{ marginTop: "auto", marginLeft: 10 }}
                        >
                          <SyncOutlined />
                        </Button>
                      </Tooltip>
                    </Col>
                  </Row>
                </Form>
              </Col>
              <Col style={{ display: "flex" }}>
                {permissions.create && (
                  <Button
                    style={{
                      background: "#fa8c16",
                      fontWeight: "bold",
                      color: "white",
                      marginTop: "auto",
                    }}
                    onClick={() => router.push("payrollvoucher/add")}
                  >
                    <PlusOutlined />
                    Nuevo
                  </Button>
                )}
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Table
                  size="small"
                  columns={columns}
                  dataSource={vouchers}
                  loading={loading}
                  className={"mainTable"}
                />
              </Col>
            </Row>
          </>
        ) : (
          <div className="notAllowed" />
        )}
      </div>
    </MainLayout>
  );
};
export default withAuthSync(UploadPayroll);

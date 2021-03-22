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
} from "@ant-design/icons";
import MainLayout from "../../layout/MainLayout";
const { Content } = Layout;
const { confirm } = Modal;
import Axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { withAuthSync } from "../../libs/auth";
import { API_URL } from "../../config/config";
import moment from "moment";

import SelectCompany from "../../components/selects/SelectCompany";
import SelectDepartment from "../../components/selects/SelectDepartment";
import BreadcrumbHome from "../../components/BreadcrumbHome";
import jsCookie from "js-cookie";

const { Dragger } = Upload;

const UploadPayroll = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { Option } = Select;
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [personList, setPersonList] = useState(null);

  /* Variables */
  const [companyId, setCompanyId] = useState(null);
  const [departamentId, setDepartamentId] = useState(null);
  const [permissions, setPermissions] = useState({});

  const getVouchers = async (
    collaborator = null,
    company = null,
    department = null,
    rfc = null
  ) => {
    setLoading(true);
    try {
      let url = `/payroll/payroll-voucher/?`;
      if (collaborator) {
        url += `person__id=${collaborator}&`;
      }
      if (rfc) {
        url += `rfc=${rfc}&`;
      }

      if (company) {
        url += `person__job__department__node__id=${company}&`;
      }

      if (department) {
        url += `person__job__department__id=${department}&`;
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
    getVouchers(values.collaborator, values.company, departamentId, values.rfc);
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
    console.log("permisos", data);
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
                      <Form.Item
                        key="collaborator"
                        name="collaborator"
                        label="Colaborador"
                      >
                        <Select
                          key="selectPerson"
                          showSearch
                          /* options={personList} */
                          style={{ width: 150 }}
                          allowClear
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          filterSort={(optionA, optionB) =>
                            optionA.children
                              .toLowerCase()
                              .localeCompare(optionB.children.toLowerCase())
                          }
                        >
                          {personList
                            ? personList.map((item) => {
                                return (
                                  <Option key={item.key} value={item.value}>
                                    {item.label}
                                  </Option>
                                );
                              })
                            : null}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item key="rfc" name="rfc" label="Rfc">
                        <Input placeholder="Rfc" />
                      </Form.Item>
                    </Col>
                    <Col>
                      <SelectCompany
                        name="company"
                        label="Empresa"
                        onChange={onChangeCompany}
                        key="SelectCompany"
                        style={{ width: 150 }}
                      />
                    </Col>
                    <Col>
                      <SelectDepartment
                        companyId={companyId}
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

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
} from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
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

  const getVouchers = async (
    collaborator = null,
    company = null,
    department = null,
    status = null
  ) => {
    setLoading(true);
    try {
      let url = `/payroll/payroll-voucher/?`;
      if (collaborator) {
        url += `person__id=${collaborator}&`;
      }
      if (status) {
        url += `status=${status}&`;
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
      console.log("permissions", data);
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
    console.log(values);
    setLoading(true);
    getVouchers(
      values.collaborator,
      values.company,
      departamentId,
      values.status
    );
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
    getVouchers();
    getAllPersons();
  }, [router]);

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

  return (
    <MainLayout currentKey="9">
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Recibos de nómina</Breadcrumb.Item>
      </Breadcrumb>
      <Row justify="space-between" style={{ paddingBottom: 20 }}>
        <Col>
          <Form
            name="filter"
            onFinish={filter}
            layout="inline"
            key="formFilter"
          >
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
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
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
            <Form.Item key="company" name="company" label="Empresa">
              <SelectCompany
                onChange={onChangeCompany}
                key="SelectCompany"
                style={{ width: 150 }}
              />
            </Form.Item>
            <SelectDepartment
              companyId={companyId}
              onChange={changeDepartament}
              key="SelectDepartment"
            />
            <Button
              style={{
                background: "#fa8c16",
                fontWeight: "bold",
                color: "white",
              }}
              key="buttonFilter"
              htmlType="submit"
              loading={loading}
            >
              Filtrar
            </Button>
          </Form>
        </Col>
        <Col>
          <Button
            style={{
              background: "#fa8c16",
              fontWeight: "bold",
              color: "white",
            }}
            onClick={() => router.push("payrollvoucher/add")}
          >
            <PlusOutlined />
            Nuevo
          </Button>
        </Col>
      </Row>

      <Content className="site-layout">
        <div style={{ padding: 24, minHeight: 380, height: "100%" }}>
          <Table
            size="small"
            columns={columns}
            dataSource={vouchers}
            loading={loading}
          />
        </div>
      </Content>
    </MainLayout>
  );
};
export default withAuthSync(UploadPayroll);

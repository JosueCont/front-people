import React, { useState } from "react";
import {
  Table,
  Row,
  Col,
  Form,
  Button,
  Typography,
  Tooltip,
  Pagination,
} from "antd";
import { connect } from "react-redux";
import WebApiPayroll from "../../api/WebApiPayroll";
import SelectPaymentCalendar from "../selects/SelectPaymentCalendar";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import SelectYear from "../selects/SelectYear";
import moment from "moment";
import { downLoadFileBlob, getDomain } from "../../utils/functions";
import { API_URL_TENANT } from "../../config/config";

const PayrollReport = ({ permissions, ...props }) => {
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [calendar, setCalendar] = useState(null);
  const [payrollList, setPayrollList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lenData, setLenData] = useState(0);
  const [valuesFilter, setValuesFilter] = useState(null);

  const columns = [
    {
      title: "UUID",
      key: "uuid",
      width: 1,
      render: (payroll) => {
        return payroll?.uuid;
      },
    },
    {
      title: "Núm. trabajador",
      width: 1,
      render: (payroll) => {
        return <>{payroll.payroll_person.person.code}</>;
      },
      key: "code",
    },
    {
      title: "Colaborador",
      width: 3,
      key: "collaborator",
      render: (payroll) => {
        return (
          <>
            {`${payroll.payroll_person.person.first_name} ${
              payroll.payroll_person.person.flast_name
            } ${
              payroll.payroll_person.person.mlast_name
                ? payroll.payroll_person.person.mlast_name
                : null
            }`}
          </>
        );
      },
    },
    {
      title: "Departamento",
      width: 3,
      render: (payroll) => {
        return (
          <>
            {payroll.payroll_person.person.work_title.department
              ? payroll.payroll_person.person.work_title.department.name
              : ""}
          </>
        );
      },
      key: "department",
    },
    {
      title: "Puesto",
      width: 3,
      render: (payroll) => {
        return (
          <>
            {payroll.payroll_person.person.work_title.job
              ? payroll.payroll_person.person.work_title.job.name
              : ""}
          </>
        );
      },
      key: "job",
    },
    {
      title: "Fecha emisión",
      key: "timestamp",
      width: 1,
      render: (payroll) => {
        return moment(payroll.timestamp).format("DD-MMM-YYYY");
      },
    },
  ];

  const clearFilter = () => {
    form.resetFields();
    setCalendar(null);
    setLoading(false);
  };

  const onFinish = (value, exporter = "False", page = 1) => {
    setValuesFilter(value);
    let url = `node=${props.currentNode.id}&export=${exporter}`;
    if (value.calendar && value.calendar != "")
      url = url + `&calendar=${value.calendar}`;
    if (value.period && value.period != "")
      url = url + `&period=${value.period}`;
    if (exporter === "False") getReportPayroll(url + `&page=${page}`);
    else
      downLoadFileBlob(
        `${getDomain(API_URL_TENANT)}/payroll/payroll-report?${url}`,
        "historico_nomina.xlsx",
        "GET"
      );
  };

  const pagination = async (page) => {
    onFinish(valuesFilter, "False", page);
    setCurrentPage(page);
  };

  const getReportPayroll = (url) => {
    setLoading(true);
    WebApiPayroll.getReportPayroll(url)
      .then((response) => {
        setLoading(false);
        setLenData(response.data.count);
        setPayrollList(response.data.results);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <>
      <Row justify="space-between" style={{ padding: "10px 20px 10px 0px" }}>
        <Col span={24}>
          <Title level={5}>Nómina</Title>
          <hr />
        </Col>
        <Col>
          <Form
            name="filter"
            form={form}
            layout="vertical"
            key="formFilter"
            className="formFilterReports"
            onFinish={onFinish}
          >
            <Row gutter={[10]}>
              <Col>
                <SelectPaymentCalendar
                  setCalendarId={(value) => setCalendar(value)}
                  name="calendar"
                  style={{ width: 300 }}
                />
              </Col>
              {calendar && (
                <Col>
                  <SelectYear
                    viewLabel={true}
                    size="middle"
                    label={"Año"}
                    placeholder={"Año"}
                  />
                </Col>
              )}
              <Col style={{ display: "flex" }}>
                <Tooltip title="Filtrar" color={"#3d78b9"} key={"#3d78b9"}>
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
                </Tooltip>
              </Col>
              <Col style={{ display: "flex" }}>
                <Tooltip
                  title="Limpiar filtro"
                  color={"#3d78b9"}
                  key={"#3d78b9"}
                >
                  <Button
                    onClick={clearFilter}
                    style={{
                      fontWeight: "bold",
                      marginTop: "auto",
                    }}
                    key="buttonClearFilter"
                  >
                    <ClearOutlined />
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col className="columnRightFilter">
          {permissions.export_payrolls && (
            <Button
              style={{
                background: "#fa8c16",
                fontWeight: "bold",
                color: "white",
              }}
              onClick={() => onFinish(form.getFieldsValue(), "True")}
              key="btn_new"
            >
              Descargar
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            dataSource={payrollList}
            key="tableHolidays"
            columns={columns}
            loading={loading}
            locale={{
              emptyText: loading
                ? "Cargando..."
                : "No se encontraron resultados.",
            }}
            pagination={false}
          ></Table>
        </Col>
        {lenData > 0 && (
          <Col
            span={24}
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <Pagination
              current={currentPage}
              total={lenData}
              onChange={pagination}
              showSizeChanger={false}
              // defaultPageSize={10}
            />
          </Col>
        )}
      </Row>
    </>
  );
};

const mapState = (state) => {
  return {
    permissions: state.userStore.permissions.report,
    currentNode: state.userStore.current_node,
    payment_calendar: state.payrollStore.payment_calendar,
  };
};

export default connect(mapState)(PayrollReport);

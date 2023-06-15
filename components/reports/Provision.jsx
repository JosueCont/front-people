import React, { useEffect, useState } from "react";
import {
  Table,
  Row,
  Col,
  Select,
  Form,
  Tooltip,
  Button,
  Typography,
  DatePicker,
} from "antd";
import { SyncOutlined, SearchOutlined } from "@ant-design/icons";
import { downLoadFileBlob, getDomain } from "../../utils/functions";
import WebApiFiscal from "../../api/WebApiFiscal";
import { API_URL_TENANT } from "../../config/config";
import moment from "moment";
import { DownloadOutlined } from "@ant-design/icons";
import SelectPatronalRegistration from "../selects/SelectPatronalRegistration";
import SelectDepartment from "../selects/SelectDepartment";
import SelectPaymentCalendar from "../selects/SelectPaymentCalendar";
import SelectJob from "../selects/SelectJob";
import { connect } from "react-redux";
import { monthsName, bimestralMonths } from "../../utils/constant";
import { toInteger } from "lodash";
import locale from "antd/lib/date-picker/locale/es_ES";
import { ruleRequired } from "../../utils/rules";
import axios from "axios";

const ProvisionsReport = ({ permissions, ...props }) => {
  const [form] = Form.useForm();
  const { Title } = Typography;
  const [loading, setLoading] = useState(false);
  const [calendar, setCalendar] = useState(null);
  const [report, setReport] = useState(1);

  const disabledDate = (current) => {
    return (
      current && moment(current).startOf("year") > moment().startOf("year")
    );
  };

  const clearFilter = () => {
    form.resetFields();
    setReport(1);
  };

  const columns = [
    {
      title: "Colaborador",
      dataIndex: "collaborator",
      key: "collaborator",
      render: (collaborator) => {
        return (
          <>
            {collaborator.first_name ? collaborator.first_name : null}
            {collaborator.flast_name ? collaborator.flast_name : null}
          </>
        );
      },
    },
    {
      title: "Empresa",
      dataIndex: "business",
      key: "business",
    },
    {
      title: "Departamento",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Días solicitados",
      dataIndex: "requested_days",
      key: "requested_days",
    },
    {
      title: "Fecha de salida",
      dataIndex: "departure_date",
      key: "departure_date",
      render: (date) => {
        return moment(date).format("DD/MMM/YYYY");
      },
    },
    {
      title: "Fecha de regreso",
      dataIndex: "return_date",
      key: "return_date",
      render: (date) => {
        return moment(date).format("DD/MMM/YYYY");
      },
    },
    {
      title: "Estatus",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return (
          <>
            {status && status == 1
              ? "Pendiente"
              : status && status == 2
              ? "Aprobado"
              : "Rechazado"}
          </>
        );
      },
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      render: (record, item) => {
        return (
          <>
            {permissions.export_permits && (
              <DownloadOutlined onClick={() => download(item)} />
            )}
          </>
        );
      },
    },
  ];

  const onFinish = async (values) => {
    let url = `${getDomain(API_URL_TENANT)}/fiscal/${
      report === 1 ? "monthly" : "bimonthly"
    }-imss-free/get_${report === 1 ? "monthly" : "bimonthly"}_imss_provision/`;
    values.period = values.period
      ? toInteger(moment(values.period).format("YYYY"))
      : null;

    let data =
      report == 1
        ? {
            period: values.period,
            month: values.month,
            patronal_registration: values.registro_patronal,
            department: values.department,
            job: values.job,
            payment_calendar: calendar,
            method: "export",
            // tag: ""
          }
        : {
            period: values.period,
            start_month: values.month,
            end_month: values.month + 1,
            payment_calendar: calendar,
            method: "export",
          };

    downLoadFileBlob(
      url,
      "Provision_Report.xlsx",
      "POST",
      data,
      "No se encontraron resultados"
    );
  };

  return (
    <>
      <Row justify="space-between" style={{ paddingRight: 20 }}>
        <Col span={24}>
          <Title level={5}>Provisiones</Title>
          <hr />
        </Col>
        <Col>
          <Form
            form={form}
            name="filter"
            layout="vertical"
            key="formFilter"
            className="formFilterReports"
            onFinish={onFinish}
            defaultValue={{
              period: "",
              month: "",
              registro_patronal: "",
              department: "",
              job: "",
              payment_calendar: "",
            }}
          >
            <Row gutter={10}>
              <Col lg={6} xs={22}>
                <Form.Item
                  key="report_type"
                  name="report_type"
                  label="Tipo de reporte"
                  rules={[ruleRequired]}
                >
                  <Select
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      e === 2 &&
                        form.setFieldsValue({
                          month: null,
                        });
                      setReport(e);
                    }}
                    placeholder="Seleccionar reporte"
                  >
                    <Select.Option key={1} value={1}>
                      Mensual
                    </Select.Option>
                    <Select.Option key={2} value={2}>
                      Bimestral
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={6} xs={22}>
                <Form.Item
                  key="period"
                  name="period"
                  label="Periodo"
                  rules={[ruleRequired]}
                >
                  <DatePicker
                    picker="year"
                    disabledDate={disabledDate}
                    locale={locale}
                    style={{ width: "100%" }}
                    placeholder="Seleccionar año"
                  />
                </Form.Item>
              </Col>
              <Col lg={6} xs={22}>
                <Form.Item
                  key="month"
                  name="month"
                  label={report == 1 ? "Mes" : "Bimestre"}
                  rules={[ruleRequired]}
                >
                  <Select
                    options={report === 1 ? monthsName : bimestralMonths}
                    style={{ width: "100%" }}
                    placeholder={
                      report === 1 ? "Seleccionar mes" : "Seleccionar bimestre"
                    }
                  />
                </Form.Item>
              </Col>
              {report === 1 && (
                <Col lg={6} xs={22}>
                  <SelectPatronalRegistration
                    name={"registro_patronal"}
                    value_form={"registro_patronal"}
                    textLabel={"Registro"}
                    currentNode={props.currentNode}
                  />
                </Col>
              )}

              {report === 1 && (
                <Col lg={6} xs={22} style={{ marginTop: "10px" }}>
                  <SelectDepartment />
                </Col>
              )}

              {report === 1 && (
                <Col lg={6} xs={22} style={{ marginTop: "10px" }}>
                  <SelectJob />
                </Col>
              )}

              <Col
                lg={6}
                xs={22}
                style={{ marginTop: report === 1 ? "10px" : "" }}
              >
                <SelectPaymentCalendar
                  setCalendarId={(value) => setCalendar(value)}
                  name="calendar"
                  rules={[ruleRequired]}
                  style={{ width: "100%" }}
                />
              </Col>
              {/* <Col style={{ display: "flex", marginTop: report === 1 ? '' : '10px' }}>
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
                  >
                    <SearchOutlined />
                  </Button>
                </Tooltip>
              </Col> */}
              <Col
                style={{
                  display: "flex",
                  marginTop: report === 1 ? "" : "10px",
                }}
              >
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
                    <SyncOutlined />
                  </Button>
                </Tooltip>
              </Col>
              <Col
                className="columnRightFilter"
                style={{ marginTop: report === 1 ? "" : "10px" }}
              >
                <Button
                  style={{
                    background: "#fa8c16",
                    fontWeight: "bold",
                    color: "white",
                  }}
                  // onClick={() => download()}
                  htmlType="submit"
                  key="btn_new"
                >
                  Descargar
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      {/* <Row style={{ padding: "10px 20px 10px 0px", marginTop: 20 }}>
        <Col span={24}>
          <Table
            dataSource={[]}
            key="tableHolidays"
            columns={columns}
            loading={loading}
            scroll={{ x: 350 }}
            locale={{
              emptyText: loading
                ? "Cargando..."
                : "No se encontraron resultados.",
            }}
          ></Table>
        </Col>
      </Row> */}
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

export default connect(mapState)(ProvisionsReport);

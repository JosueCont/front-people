import {
  ClearOutlined,
  FilePdfTwoTone,
  FileTextTwoTone,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  message,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import SelectPaymentCalendar from "../../components/selects/SelectPaymentCalendar";
import SelectCollaborator from "../../components/selects/SelectCollaborator";
import MainLayout from "../../layout/MainLayout";
import WebApiPayroll from "../../api/WebApiPayroll";
import { messageError } from "../../utils/constant";

const PayrollVaucher = ({ ...props }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [cfdis, setCfdis] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [calendar, setCalendar] = useState(null);

  const columns = [
    {
      title: "Num. trabajador",
      key: "code",
      render: (item) => {
        return item.payroll_person.person.code;
      },
    },
    {
      title: "Colaborador",
      key: "collaborator",
      render: (item) => {
        return !item.payroll_person.person.mlast_name
          ? item.payroll_person.person.first_name +
              " " +
              item.payroll_person.person.flast_name
          : item.payroll_person.person.first_name +
              " " +
              item.payroll_person.person.flast_name +
              " " +
              item.payroll_person.person.mlast_name;
      },
    },
    {
      title: "Fecha emisión",
      key: "timestamp",
      render: (item) => {
        return item.emission_date;
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (item) => {
        return (
          <>
            {item.id_facturama && (
              <Tooltip title="PDF" color={"#3d78b9"} key={"#3d78b9"}>
                <FilePdfTwoTone style={{ fontSize: "25px" }} />
              </Tooltip>
            )}
            <Tooltip title="XML" color={"#3d78b9"} key={"#3d78b9"}>
              <a href={item.xml_file}>
                <FileTextTwoTone style={{ fontSize: "25px" }} />
              </a>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const onFinish = (value) => {
    setLoading(true);
    let url = "";
    if (value.calendar && value.calendar != "")
      url = `calendar=${value.calendar}`;
    if (value.period && value.period != "") url = `&period=${value.period}`;
    if (value.person && value.person != "") url = `&person=${value.person}`;
    WebApiPayroll.getCfdiPayrrol(url)
      .then((response) => {
        setCfdis(response.data);
        setLoading(false);
      })
      .catch((error) => {
        message.error(messageError);
        console.log(error);
        setLoading(false);
      });
  };

  const clearFilter = () => {
    form.resetFields();
    setPeriods([]);
    setCalendar(null);
    setCfdis([]);
  };

  useEffect(() => {
    let period = [];
    if (calendar)
      period = props.payment_calendar.find(
        (item) => item.id == calendar
      ).periods;
    setPeriods(
      period.map((item) => {
        return {
          value: item.id,
          label: `${item.start_date} - ${item.end_date}`,
        };
      })
    );
  }, [calendar]);

  return (
    <MainLayout currentKey={["persons"]}>
      <Breadcrumb>
        <Breadcrumb.Item href="/home/persons">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Comprobantes fiscales</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <div className="top-container-border-radius">
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
                  style={{ width: 200 }}
                />
              </Col>
              {calendar && (
                <Col>
                  <Form.Item name="period" label="Periodo">
                    <Select
                      options={periods}
                      style={{ width: 200 }}
                      placeholder="Periodo"
                    />
                  </Form.Item>
                </Col>
              )}
              <Col>
                <SelectCollaborator name="person" style={{ width: 200 }} />
              </Col>
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
        </div>
        <Row>
          <Col span={24}>
            <Table
              dataSource={cfdis}
              key="tableHolidays"
              columns={columns}
              loading={loading}
              locale={{
                emptyText: loading
                  ? "Cargando..."
                  : "No se encontraron resultados.",
              }}
            />
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    payment_calendar: state.payrollStore.payment_calendar,
  };
};

export default connect(mapState)(PayrollVaucher);

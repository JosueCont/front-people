import React, { useEffect, useState } from "react";
import {
  Table,
  Row,
  Col,
  Form,
  Button,
  Typography,
  Tooltip,
  Pagination,
  Space,
  Modal,
  message,
  Select,
  Spin,
  Input,
  DatePicker,
  Checkbox,
  Switch,
} from "antd";
import locale from 'antd/lib/date-picker/locale/es_ES';
import { connect } from "react-redux";
import WebApiPayroll from "../../api/WebApiPayroll";
import SelectPaymentCalendar from "../selects/SelectPaymentCalendar";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import SelectYear from "../selects/SelectYear";
import moment from "moment";

import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { downLoadFileBlob, getDomain } from "../../utils/functions";
import { API_URL_TENANT } from "../../config/config";
import SelectPatronalRegistration from "../selects/SelectPatronalRegistration";
import SelectLevel from '../selects/SelectLevel'
import {
  messageError,
} from "../../utils/constant";
/* Componentes para filtro */
import SelectCompany from '../selects/SelectCompany'
import SelectDepartment from '../selects/SelectDepartment'
import SelectJob from '../selects/SelectJob'
import SelectWorkTitle from '../selects/SelectWorkTitle'
import SelectCostCenter from '../selects/SelectCostCenter'
import SelectTags from '../selects/SelectTags'
import axios from "axios";
import { typeHttp } from "../../config/config";

const PayrollReport = ({ permissions, ...props }) => {
  const { Title } = Typography;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [calendar, setCalendar] = useState(null);
  const [payrollList, setPayrollList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lenData, setLenData] = useState(0);
  const [valuesFilter, setValuesFilter] = useState(null);
  const [showModal, setShowModal] = useState(false)
  const [optionspPaymentCalendars, setOptionsPaymentCalendars] = useState([]);
  const [paymentCalendars, setPaymentCalendars] = useState([]);
  const [calendarSelect, setCalendarSelect] = useState(null);
  const [periods, setPeriods] = useState([])
  /* variables para modal de filtro */
  const [departments, setDepartments] = useState(null)
  const [jobs, setJobs] = useState(null)
  const [urlFilter, setUrlFilter] = useState(null)
  const [isFilter, setIsFilter] = useState(false)

  const typeReports = [
    {
      value: 'PAYROLL_ACCUMULATED',
      label: 'Acumulado'
    },
    {
      value: 'PAYROLL_PROVISIONS',
      label: 'Acumulado + provisiones'
    }
  ]

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

  const getPaymentCalendars = async (value) => {
    await WebApiPayroll.getPaymentCalendar(value)
      .then((response) => {
        console.log("==================", response.data.results)
        setPaymentCalendars(response.data.results);
        let calendars = response.data.results.map((item, index) => {
          return { key: item.id, label: item.name, value: item.id };
        });
        setOptionsPaymentCalendars(calendars);
      })
      .catch((error) => {
        console.log('====>', error);
        message.error(messageError);
      });
  };

  const clearFilter = () => {
    setIsFilter(false)
    form.resetFields();
    setLoading(false);
    setValuesFilter(null)
    setUrlFilter(null)
    setCurrentPage(1)
    onFinish()
  };

  const downLoadCurrentFileBlob = async (urlDownload) => {
      let headers = {
        method: "GET",
        responseType: "blob",
      };
      setLoading(true)
      let url = `${getDomain(API_URL_TENANT)}/payroll/payroll-report?${urlDownload}`
      axios(
        url.toLowerCase().includes("http") ? url : `${typeHttp}://` + url,
        headers
      )
        .then((response) => {
          const blob = new Blob([response.data]);
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "historico_nomina.xlsx";
          link.click();
        })
        .catch((e) => {
          let errorMessage = e.response?.data?.message || ""
           if (errorMessage !== ""){
            message.error(errorMessage)
          } else if(Textmessage){
            message.error(Textmessage)
          }else if(e?.response?.status===404){
            message.error('No se encontraron datos de la nómina de las personas seleccionadas.')
          } 
          return false
        }).finally((()=> {
          setLoading(false)
        }));
  } 

  const onFinish = async (values = null, exporter = "False", page = 1) => {
    setCurrentPage(page)
    let urlQuery = `page=${page}&node__id=${props?.currentNode?.id}`
    urlQuery += values?.name ? `&name=${values['name']}` : ''
    urlQuery += `&report_type=${values?.report_type ? values?.report_type : 'PAYROLL_DETAILED'}`
    urlQuery += values?.patronal_registrations ?.length > 0 ? `&patronal_registrations=${values['patronal_registrations'].toString()}` : ''
    urlQuery += values?.departments?.length > 0 ? `&departments=${values['departments'].toString()}` : ''
    urlQuery += values?.cost_centers?.length > 0 ? `&cost_centers=${values['cost_centers'].toString()}` : ''
    urlQuery += values?.jobs?.length > 0 ? `&jobs=${values['jobs'].toString()}` : ''
    urlQuery += values?.work_titles?.length > 0 ? `&work_titles=${values['work_titles'].toString()}` : ''
    urlQuery += values?.levels?.length > 0 ? `&levels=${values['levels'].toString()}` : ''
    urlQuery += values?.payment_calendars ? `&payment_calendars=${values['payment_calendars']}` : ''
    urlQuery += values?.payment_periods?.length > 0 ? `&payment_periods=${values['payment_periods'].toString()}` : ''
    urlQuery += values?.tags?.length > 0 ? `&tags=${values['tags'].toString()}` : ''
    urlQuery +=  values?.start_date ? `&start_date=${moment(values['start_date']).format("YYYY-MM-DD")}`:''
    urlQuery +=  values?.end_date ? `&end_date=${ moment(values['end_date']).format("YYYY-MM-DD")}`:'' 
    urlQuery +=  "&consolidated_type=1&consolidated_movement=0&cfdi_movement=0"
    setUrlFilter(urlQuery)  

    //setValuesFilter(values);
    if (exporter === "False") {
      getReportPayroll(urlQuery+`&export=${exporter}`);
      //getReportPayroll("https://demo.api.people.hiumanlab.com/payroll/payroll-report?page=1&export=False&node__id=848&report_type=PAYROLL_ACCUMULATED")
      }
    else{
      downLoadCurrentFileBlob(urlQuery+`&export=${exporter}`)
    }
  };

  const pagination = async (page) => {
    onFinish(form.getFieldsValue(), "False", page);
    setCurrentPage(page);
  };

  const getReportPayroll = (url) => {
    setLoading(true);
    WebApiPayroll.getReportPayroll(url)
      .then((response) => {
        setLoading(false);
        setLenData(response.data.count);
        setPayrollList(response.data.results);
        setShowModal(false)
      })
      .catch((error) => {
        setLoading(false);
        setShowModal(false)
        setPayrollList([])
        setLenData(0)
      });
  };

  const changeCalendar = (value) => {
    console.log('first')
    setPeriods([])
    form.setFields([
      {
        name: 'payment_periods',
        value:[]
      }
    ])
      
    // setTotalSalary(null);
    // setTotalIsr(null);
    let periods_list = []

    
    const calendar = paymentCalendars.find((item) => item.id === value);
    calendar.periods.map(item => periods_list.push(item))
      /* setPeriodSelcted(period); */
      /* setCalendarSelect(calendar); */
      /* setActivePeriod(period.id); */
      /* setPayrollType(calendar.perception_type.code); */  
    let new_periods = periods_list.sort((a, b) => a.name - b.name)
      .map((item) => {
        return {
          value: item.id,
          label: `${item.name}.- ${item.start_date} - ${item.end_date}`,
          key: item.id,
        };
      })

    setPeriods(new_periods)
    
  };

  useEffect(() => {
    
    getPaymentCalendars(props?.currentNode?.id)
  }, [props?.currentNode?.id])


  
  
  

  return (
    <>
      <Row justify="end" style={{ padding: "10px 20px 10px 0px" }}>
        <Col span={24}>
          <Title level={5}>Nómina</Title>
          <hr />
        </Col>
        <Col className="columnRightFilter">
          <Space>
            <Button loading={loading}  onClick={() => setShowModal(true)}>
              <SearchOutlined />
            </Button>
            
          {permissions.export_payrolls && (
            <Button
              style={{
                background: "#fa8c16",
                fontWeight: "bold",
                color: "white",
              }}
              onClick={() => onFinish(form.getFieldsValue(), "True")}
              key="btn_new"
              loading={loading}
              disabled={loading}
            >
              Descargar
            </Button>
          )}
          {
            isFilter && 
            <Tooltip title="Limpiar busqueda">
              <Button
                onClick={clearFilter}
                style={{
                  fontWeight: "bold",
                  marginTop: "auto",
                }}
                key="buttonClearFilter"
                disabled={loading}
              >
                <ClearOutlined />
              </Button>
            </Tooltip>
          }
          </Space>
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
              disabled={loading}
              // defaultPageSize={10}
            />
          </Col>
        )}
      </Row>
      <Modal 
        title="Filtrar reporte de nomina"
        visible={showModal}
        onCancel={() => {
            setShowModal(false)
            form.resetFields()
          }
        }
        onOk={() => form.submit()}
        okButtonProps={{ loading: loading }}
        cancelButtonProps={{ disabled: loading }}
        width={900}
      >
        <Spin spinning={loading}>
        <Form layout="vertical" form={form} onFinish={(e) => {
          onFinish(e, 'False', 1)
          setIsFilter(true)
          }}>
          <Row gutter={20}>
            <Col span={12}>
              {/*<Form.Item name={'name'} label="Nombre de la persona">*/}
              {/*  <Input allowClear />*/}
              {/*</Form.Item>*/}
            </Col>
            <Col  span={12}/>
            <Col span={8} >
              <Form.Item name={'start_date'} label="Fecha inicio">
                <DatePicker locale={locale} style={{ width:'100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={'end_date'} label="Fecha fin">
                <DatePicker locale={locale} style={{ width:'100%' }} />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <SelectPatronalRegistration
                name="patronal_registrations"
                multiple
                currentNode={props?.currentNode?.id}
              />
            </Col>
          <Col span={8}>
            <Form.Item label="Calendarios de pago" name={"payment_calendars"}>
              <Select
                allowClear
                  style={{ width: "100%" }}
                  options={optionspPaymentCalendars}
                  onChange={changeCalendar}
                  placeholder="Calendarios"
                  notFoundContent={"No se encontraron resultados."}
                  maxTagCount="responsive"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="payment_periods" label="Periodos">
              <Select
                placeholder="Periodos"
                mode="multiple"
                options={periods}
                maxTagCount="responsive"
                allowClear
              />
              </Form.Item>
            </Col>
            <Col span={8}>
              <SelectDepartment name="departments" multiple  onChange={(e) =>setDepartments(e)}/>
            </Col>
            <Col span={8}>
              <SelectJob name="jobs" multiple onChange={(e) => setJobs(e) } />
            </Col>
            <Col span={8}>
              <SelectWorkTitle name="work_titles" multiple foReport department={departments} job={jobs} />
            </Col>
            <Col span={8}>
              <SelectLevel name="levels" multiple />
            </Col>
            
            <Col span={8}>
              <SelectCostCenter name="cost_centers" multiple viewLabel="Centro de costos" allowClear />
            </Col>
            <Col span={8} >
              <SelectTags name="tags" viewLabel="Etiquetas" multiple allowClear />
            </Col>
            <Col span={8}>
              <Form.Item name={'report_type'} label="Tipo de reporte" >
                <Select 
                  placeholder="Tipo de reporte"
                  allowClear
                  options={typeReports}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        </Spin>
      </Modal>
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

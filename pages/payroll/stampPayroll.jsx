import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  Row,
  Col,
  Breadcrumb,
  Button,
  Select,
  Input,
  Collapse,
  Modal,
  message,
  Spin,
  Table,
  Tooltip,
  Badge,
  Card,
  Avatar,
  Space,
  Typography
} from "antd";
import { useRouter } from "next/router";
import {
  FilePdfOutlined,
  PlusOutlined,
  FileOutlined,
  Html5Outlined,
  RightOutlined,
  DownOutlined,
  EditFilled,
  UserOutlined
} from "@ant-design/icons";
import { userCompanyId } from "../../libs/auth";
import { periodicityNom } from "../../utils/constant";
import webApiPayroll from "../../api/webApiPayroll";
import FormPerceptionsDeductions from "../../components/payroll/forms/FormPerceptionsDeductions";
import { Global, css } from "@emotion/core";
import { EditSharp } from "@material-ui/icons";

const StampPayroll = () => {
  const { Panel } = Collapse;
  const route = useRouter();
  const [paymentCalendars, setPaymentCalendars] = useState([]);
  const [optionspPaymentCalendars, setOptionsPaymentCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [periodicity, setPeriodicity] = useState("");
  const [period, setPeriod] = useState("");
  const [insidencePeriod, setInsidencePeriod] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [persons, setPersons] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [objectStamp, setObjectStamp] = useState(null);
  const [stamped, setStamped] = useState(false);
  const [stampedInvoices, setStampedInvoices] = useState([]);
  const [expandRow, setExpandRow] = useState(null)
  const {Text, Title} = Typography
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [personSelected, setPersonSelected] = useState(null);

  let nodeId = userCompanyId();

  /* functions */
  const getPaymentCalendars = async () => {
    let response = await webApiPayroll.getPaymentCalendar(nodeId);
    let data = response.data.results;
    if (data.length > 0) {
      setPaymentCalendars(data);
      let calendars = data.map((item, index) => {
        return { key: item.id, label: item.name, value: item.id };
      });
      setOptionsPaymentCalendars(calendars);
    } else {
      message.error("Sin resultados");
    }
  };

  const getPersonCalendar = async (calendar_id) => {
    
    setLoading(true);
    let response = await webApiPayroll.getPersonsCalendar(calendar_id);
    
    if (response.data.length > 0) {
      let arrar_payroll = [];
      response.data.map((a) => {
        if (a.person) {
          arrar_payroll.push({
            person_id: a.person.id,
            key: a.person.id,
            full_name: a.person.first_name+' '+a.person.mlast_name+' '+a.person.flast_name,
            photo: a.person.photo,
            company: a.person.node_user ? a.person.node_user.name : null,
            daily_salary: a.daily_salary ? `$ ${a.daily_salary}` : null,
            person_id: a.person.id,
            perceptions: [],
            deductions: [],
            others_payments: [],
          });
        }
      });
      setPayroll(arrar_payroll);
      setPersons(response.data);
    } else {
      setPersons([]);
      setPayroll([])
      message.error("No se encontraron resultados");
    }
    setLoading(false);
  };

  const sendStampPayroll = async () => {
    let data = {
      node: nodeId,
      period: period,
      payroll: [],
      invoice: true,
    };
    if (payroll.length === 0) {
      let arrar_payroll = [];
      persons.map((a) => {
        if (a.person) {
          arrar_payroll.push({
            person_id: a.person.id,
            perceptions: [],
            deductions: [],
            others_payments: [],
          });
        }
      });
      data.payroll = arrar_payroll;
    } else {
      data.payroll = payroll;
    }
    setLoading(true);
    let response = await webApiPayroll.payrollFacturama(data);
    if (response.data.length > 0) {
      setStamped(true);
      setStampedInvoices(response.data);
      setLoading(false);
    }
    //   let payrolls = response.data.payrolls;
    //   if (persons.length > 0) {
    //     let arrayPersons = persons;
    //     arrayPersons.map((p) => {
    //       let payroll_person = payrolls.find(
    //         (elem) =>
    //           elem.Complemento.Payroll.Employee.EmployeeNumber == p.person.code
    //       );
    //       if (payroll_person) {
    //         p.payroll = payroll_person;
    //       }
    //     });

    //     setPersons(arrayPersons);
    //     setLoading(false);
    //   }
    // }
  };

  /* Events */
  const changePaymentCalendar = (value) => {
    if (value) {
      let calendar = paymentCalendars.find((elm) => elm.id == value);
      if (calendar) {
        getPersonCalendar(value);
        let periodicity = periodicityNom.find(
          (p) => p.value == calendar.periodicity
        );

        if (periodicity) {
          setPeriodicity(periodicity.label);
        } else {
          setPeriodicity("");
        }
        setPeriod(calendar.period);
        let period = calendar.periods.find((p) => p.active == true);
        if (period) {
          // setPeriod(period.start_date + " - " + period.end_date);
          if (period.incidences) {
            setInsidencePeriod(
              period.incidences.start_date + " - " + period.incidences.end_date
            );
            setPaymentDate(period.payment_date);
          }
        } else {
          setPeriod("");
          setInsidencePeriod("");
          setPaymentDate("");
        }
      }
    }
  };

  useEffect(() => {
    getPaymentCalendars();
  }, [nodeId]);


  useEffect(() => {
    if (persons.length > 0) {
    }
  }, [persons]);

  useEffect(() => {}, [optionspPaymentCalendars]);

 /*  useEffect(() => {
    if (objectStamp) {
      let array_payroll = [...payroll].slice();
      console.log('array_payroll => ',array_payroll);

      let elem_payroll = array_payroll.find(
        (elem) => elem.person_id == objectStamp.person_id
      );
      console.log('elem_payroll =>', elem_payroll);
      if (elem_payroll) {
        let array = array_payroll.filter(
          (elem) => elem.person_id !== objectStamp.person_id
        );
        array.push(objectStamp);

        console.log('array =>',array);
        setPayroll(array);
      } else {
        array_payroll.push(objectStamp);
        setPayroll(array_payroll);
      }
      setLoading(false);
    }
  }, [objectStamp]); */

  /* const PanelInfo = ({ data, setObjectStamp, payroll, setLoading }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
      setIsModalVisible(true);
    };
    return (
      <Row>
        <Col span={24}>
          <Button
            style={{ float: "right" }}
            type="primary"
            shape="circle"
            onClick={() => showModal(data.person.person_id)}
            icon={<PlusOutlined />}
            size={"middle"}
          />
        </Col>

        <Modal
          title="Agregar"
          closable={false}
          visible={isModalVisible}
          footer={null}
          key={"modal-" + data.person.id}
        >
          <FormPerceptionsDeductions
            setIsModalVisible={setIsModalVisible}
            person_id={data.person.id}
            setObjectStamp={setObjectStamp}
            payroll={payroll}
            setLoading={setLoading}
            key={"form-" + data.person.id}
          />
        </Modal>
      </Row>
    );
  }; */

  const columns = [
    {
      title: "Persona",
      dataIndex: "person",
      key: "person",
    },
    {
      title: "Estatus",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return <>{status ? "Timbrado" : "Error al timbrar"}</>;
      },
    },
    {
      title: "Acciones",
      align: "center",
      render: (item) => {
        return (
          <div>
            <Row gutter={24}>
              <Col className="gutter-row" span={8}>
                <Tooltip title="Descargar XML">
                  <FileOutlined onClick={() => downloadFile(item, 1)} />
                </Tooltip>
              </Col>
              <Col className="gutter-row" span={8}>
                <Tooltip title="Descargar PDF">
                  <FilePdfOutlined onClick={() => downloadFile(item, 2)} />
                </Tooltip>
              </Col>
              <Col className="gutter-row" span={8}>
                <Tooltip title="Descargar HTML">
                  <Html5Outlined onClick={() => downloadFile(item, 3)} />
                </Tooltip>
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];

  const downloadFile = (item, type_file) => {
    if (item) {
      let data = {
        type_request: 3,
        type_file: type_file,
        id_facturama: item.id_facturama,
      };
      webApiPayroll.cfdiMultiEmitter(data).then((response) => {
        if (type_file == 2) {
          const linkSource = `data:application/pdf;base64,${response.data}`;
          const downloadLink = document.createElement("a");
          const fileName = item.person + ".pdf";

          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        } else {
          const type = response.headers["content-type"];
          const blob = new Blob([response.data], {
            type: type,
          });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download =
            type_file == 1 ? item.person + ".xml" : item.person + ".html";

          link.click();
        }
      });
    }
  };


  const columnsNew = [
  { title: 'Nombre', className: 'column_name cursor_pointer', key: 'name',
    render: (record) => <div onClick={() => setExpandRow(expandRow ? null : record.key) }>
      <Space>
        <Avatar icon={<UserOutlined />} src={record.photo ? record.photo : null} />
        {record.full_name}
      </Space>
    </div>
  },
  { title: 'Empresa', dataIndex: 'company', key: 'company', className:'cursor_pointer',
    render: (company, record) => <div onClick={() => setExpandRow(expandRow ? null : record.key) }>
      {company}
    </div>
 },
  { title: 'Salario Diario', dataIndex: 'daily_salary', key: 'daily_salary', className:'cursor_pointer',
    render: (salary, record) => <div onClick={() => setExpandRow(expandRow ? null : record.key) }>
      {salary}
    </div> },
  { key: 'actions', className: 'cell-actions',
    render: record => 
    <Button size="small" onClick={() => showModal(record) }>
      <PlusOutlined/>
    </Button>
  }
];

const showModal = (person) => {
  
  setPersonSelected(person)
  setIsModalVisible(true);
}

/* useEffect(() => {
  if(isModalVisible && expandRow){
    setExpandRow(false);
  }
}, [isModalVisible]) */

const dataNew = [
  {
    key: 1,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
  },
  {
    key: 2,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
  },
  {
    key: 3,
    name: 'Not Expandable',
    age: 29,
    address: 'Jiangsu No. 1 Lake Park',
    description: 'This not expandable',
  },
  {
    key: 4,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
  },
];

  const rowExpand = (expanded, row) => {
    
    if(!expanded){
      setExpandRow(false)
    }else{
      setExpandRow(row.key)
    }
  }


  const expandedRowRender = (record) =>{
    console.log('record =>',record);
    let data = record.perceptions.concat(record.deductions).concat(record.others_payments);
    /* record.perceptions.map(item =>{
      data.push(item);
    })
    record.deductions.map(item =>{
      data.push(item);
    })
    record.others_payments.map(item =>{
      data.push(item);
    }) */


    const columns = [
      { title: 'concepto_title', key:'concept-title', width: 100, 
        render: (record) => (
            <Text>
              *Concepto
            </Text>
        )
      },
      { title: 'concepto',  key: 'concept', dataIndex:'label',
        className:'cell-concept',
        width: 500,
      },
      { title: 'monto', key: 'ampunt', dataIndex:'amount', width: 150,
        render: (amount) => (
          <Space size="middle">
            <Text>
              Monto
            </Text>
            <Text>
              $ {amount}
            </Text>
          </Space>
        ),
      },
      {
        title: 'Action',
        key: 'operation',
        className: 'cell-actions',
        render: () => (
          <Space size="middle">
            <EditFilled />
          </Space>
        ),
      },
    ];


    return <Table className="subTable"  columns={columns} dataSource={data} pagination={false} showHeader={false} locale={{emptyText: 'Aún no hay datos'}} />;
  }

  const saveConcepts = (concept) => {
    console.log('concept ==>',concept);
    const tempPayroll = [...payroll];
    console.log('tempPayroll =>',tempPayroll);
    let payroll_person = tempPayroll.find( (elem) =>elem.person_id === concept.person_id);
    console.log('payroll_person =>',payroll_person );
    vaidatePerception(concept.perceptions, payroll_person);
  }

  const vaidatePerception = (perceptions, payroll_person) =>{
    console.log('perceptions =>',perceptions);
    console.log('payroll_person =>',payroll_person);

    perceptions.map(item => {
      console.log('item => code => ', item.code);
      let idx = payroll_person.perceptions.findIndex(element => element.code === item.code);
      console.log('idx =>',idx );
      if(idx === -1){
        payroll_person.perceptions.push(item)
      }else{
        payroll_person.perceptions[idx] = item;
      }
    })
    console.log('UPD PERSON =>',payroll_person);
    updPersonsPayroll(payroll_person)
  }

  const updPersonsPayroll = (object_person) =>{
    let newpayroll = [...payroll];
    let idx = newpayroll.findIndex(item => item.person_id === object_person.person_id);
    newpayroll[idx] = object_person;
    setPayroll(newpayroll);
    
  }



  return (
    <>
      <Global 
        styles={`
          
          .column_arrow{
            width: 10px !important;
            padding:10px 0px 10px 10px !important;
          }
          .column_name{
            padding-left:10px !important;
          }
          .subTable .ant-table{
            margin-left: 70px !important;
            background: rgb(252 102 2 / 10%);
          }
          .subTable .ant-table tr:hover td{
            background: rgb(252 102 2 / 10%) !important;
          } 

          td.cursor_pointer{
            cursor:pointer;
          }
          .form_concept .ant-form-item{
            margin-bottom:0px;
          }
          .cell-concept{
              text-overflow: ellipsis;
              overflow: hidden;
          }
          .cell-actions{
            width: 70px;
            text-align: center;
          }
        `}
      />
    <MainLayout currentKey={["timbrar"]} defaultOpenKeys={["nomina"]}>
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Timbrado de nomina</Breadcrumb.Item>
      </Breadcrumb>  
      
      <Row justify="end" gutter={[10,10]}>
        <Col span={24}>
          <Card className="form_header">
            <Row gutter={[16, 8]}>
              <Col xxs={24} xl={4}>
                <Select
                  size="large"
                  style={{ width: "100%" }}
                  options={optionspPaymentCalendars}
                  onChange={changePaymentCalendar}
                  placeholder="Calendarios"
                  notFoundContent={"No se encontraron resultados."}
                />
              </Col>
              <Col xxs={24} xl={4}>
                <Input
                size="large"
                  key="periodicity"
                  placeholder="Periodicidad"
                  disabled={true}
                  value={periodicity}
                />
              </Col>
              <Col xxs={24} xl={6}>
                <Input
                  size="large"
                  key="period"
                  placeholder="Período"
                  disabled={true}
                  value={period}
                />
              </Col>
              <Col xxs={24} xl={6}>
                <Input
                  size="large"
                  key="insidence_period"
                  placeholder="Período de incidencia"
                  disabled={true}
                  value={insidencePeriod}
                />
              </Col>
              <Col xxs={24} xl={4}>
                <Input
                  size="large"
                  key="payment_day"
                  placeholder="Dia de pago"
                  disabled={true}
                  value={paymentDate}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col md={3}>
          <Button
            size="large"
            block
            htmlType="button"
            onClick={() => sendStampPayroll()}
          >
            Enviar
          </Button>
        </Col>
        <Col span={24}>
          
            <Card className="card_table">
              <Table
                className="headers_transparent"
                columns={columnsNew}
                /* expandable={{
                  expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                }} */
                expandable={
                  {
                    expandedRowRender: record => expandedRowRender(record),
                    /* expandRowByClick: true, */
                    onExpand: (expanded, record) =>  rowExpand(expanded, record),
                    expandIconAsCell: false,
                    /* expandIconColumnIndex: -1, */
                    expandedRowKeys:[expandRow],
                    expandIcon: ({ expanded, onExpand, record }) =>
                      expanded ? (
                        <DownOutlined onClick={e => onExpand(record, e)} />
                      ) : (
                        <RightOutlined onClick={e => onExpand(record, e)} />
                      )
                  }
                }
                hideExpandIcon
                dataSource={payroll}
                locale={{emptyText: 'No se encontraron resultados'}}
              />
            </Card>
        </Col>
      </Row>

      

      {/* <Row justify="end" style={{ display:'none' }}>
        <Col span={24}>
          <Spin tip="Cargando..." spinning={loading}>
            {!stamped && (
              <Collapse defaultActiveKey={["1"]}>
                {persons &&
                  persons.map((p, i) => {
                    if (p.person) {
                      return (
                        <Panel
                          header={
                            p.person.first_name +
                            " " +
                            p.person.flast_name +
                            " " +
                            p.person.mlast_name +
                            "  " +
                            "    -  Salario diario: $" +
                            p.daily_salary
                          }
                          key={i + 1}
                        >
                          <PanelInfo
                            data={p}
                            setObjectStamp={setObjectStamp}
                            payroll={payroll}
                            setLoading={setLoading}
                            key={p.person.id}
                          />
                        </Panel>
                      );
                    }
                  })}
              </Collapse>
            )}

            {stampedInvoices && stampedInvoices.length > 0 && stamped && (
              <Table
                className={"mainTable"}
                size="small"
                columns={columns}
                dataSource={stampedInvoices}
                loading={loading}
                locale={{
                  emptyText: loading
                    ? "Cargando..."
                    : "No se encontraron resultados.",
                }}
              />
            )}
          </Spin>
        </Col>
      </Row> */}
      <Modal
          visible={isModalVisible}
          footer={null}
          width={600}
          closable={false}
          destroyOnClose
          /* key={"modal-" + data.person.id} */
        >
          <Row justify="center">
            <Col md={20}>
              <Title level={2}>
                Agregar
              </Title>
              <FormPerceptionsDeductions
                setIsModalVisible={setIsModalVisible}
                person_id={personSelected && personSelected.person_id}
                saveConcepts={saveConcepts}
                payroll={payroll}
                setLoading={setLoading}
              />
            </Col>
          </Row>
        </Modal>
    </MainLayout>
    </>
  );
};

export default StampPayroll;

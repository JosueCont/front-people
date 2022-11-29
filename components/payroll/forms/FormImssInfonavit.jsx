import React, { useState, useEffect } from "react";
import {
  Spin,
  Button,
  Row,
  Col,
  Typography,
  Table,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
} from "antd";
import locale from "antd/lib/date-picker/locale/es_ES";
import {typeEmployee, typeSalary, reduceDays, FACTOR_SDI} from "../../../utils/constant";
import SelectFamilyMedicalUnit from "../../selects/SelectFamilyMedicalUnit";
import SelectMedicineUnity from "../../selects/SelectMedicineUnity";
import WebApiPayroll from "../../../api/WebApiPayroll";
import moment from "moment";
import {fourDecimal, minLengthNumber, onlyNumeric, ruleRequired} from "../../../utils/rules";

const FormImssInfonavit = ({ person, person_id, node }) => {
  
  const { Title } = Typography;
  const [formImssInfonavit] = Form.useForm();
  const [loadingTable, setLoadingTable] = useState(false);
  const [ loadingIMSS, setLodingIMSS ] = useState(false)
  const [infonavitCredit, setInfonavitCredit] = useState([]);
  const daily_salary = Form.useWatch('sbc', formImssInfonavit);
  //const [integratedDailySalary, setIntegratedDailySalary] = useState(0);

  useEffect(() => {
    person.branch_node && localUserCredit();
  }, [person]);

  useEffect(()=>{
    console.log(daily_salary)
    if(daily_salary){
      formImssInfonavit.setFieldsValue({
          integrated_daily_salary:(daily_salary*FACTOR_SDI).toFixed(2)
        })
    }else{
      formImssInfonavit.setFieldsValue({
        integrated_daily_salary:0
      })
    }
  },[daily_salary])

  const formImmssInfonavitAct = (values) => {
    setLodingIMSS(true)

    values.person = person_id
    values.movement_date = values.movement_date ? moment(values.movement_date).format('YYYY-MM-DD') : ""
    values.is_active = true
    values.is_registered = true
    values.modify_by = "System"
    values.patronal_registration = person?.branch_node? person.branch_node.patronal_registration.id    : ""
    console.log("Data", values);
    // funcion WEB API
    WebApiPayroll.saveIMSSInfonavit(values)
    .then((response) => {
      console.log('Response', response)
      setLodingIMSS(false)  
    })
    .catch((error) => {
      console.log('Error -->', error)
      setLodingIMSS(false)
    })
    // setLodingIMSS(false)
  };

  const userCredit = async () => {
    
    setLoadingTable(true);
    let data = new FormData()
    let patronal_registration = person?.branch_node?.patronal_registration?.id
    
    data.append("node", node)
    data.append("person", person_id)
    data.append("patronal_registration", patronal_registration)

    WebApiPayroll.getInfonavitCredit(data)
      .then((response) => {
        setLoadingTable(false);
        response.data && setInfonavitCredit([response.data.infonavit_credit]);
        console.log("Response", response);
      })
      .catch((error) => {
        setLoadingTable(false);
        console.log("Error", error);
      });
  };

  const localUserCredit = async () => {
    setLoadingTable(true)
    try {
      let response = await WebApiPayroll.getPersonalCredits(person.imss)
      console.log('Response credits', response)
    } catch (error) {
      console.log('Error', error)
    } finally {
      setLoadingTable(false)
    }
  }

  const colCredit = [
    {
      title: "Número",
      dataIndex: "number",
      key: "number",
      width: 100,
    },
    {
      title: "Tipo de crédito",
      dataIndex: "type",
      key: "type",
      width: 100,
    },
    {
      title: "Fecha de inicio",
      dataIndex: "start_date",
      key: "start_date",
      width: 100,
    },
    {
      title: "Estatus",
      dataIndex: "status",
      key: "status",
      width: 100,
    },
    {
      title: "Monto",
      dataIndex: "amount_payment",
      key: "amount_payment",
      width: 100,
    },
    {
      title: "Monto actual",
      dataIndex: "current_payment",
      key: "current_payment",
      width: 100,
    },
    {
      title: "Numero de pago",
      dataIndex: "number_payment",
      key: "number_payment",
      width: 100,
    },
    {
      title: "Ultima fecha de pago",
      dataIndex: "date_last_payment",
      key: "date_last_payment",
      width: 100,
    },
    {
      title: "Monto total",
      dataIndex: "total_amount",
      key: "total_amount",
      width: 100,
    },
    // {
    //   title: "Opciones",
    //   render: (item) => {
    //     return (
    //       <div>
    //         <Row gutter={16}>
    //           <Col className="gutter-row" offset={1}>
    //             <EditOutlined
    //               style={{ fontSize: "20px" }}
    //               onClick={() => updateFormbankAcc(item)}
    //             />
    //           </Col>
    //           <Col className="gutter-row" offset={1}>
    //             <DeleteOutlined
    //               style={{ fontSize: "20px" }}
    //               onClick={() => {
    //                 showModalDelete(item.id);
    //               }}
    //             />
    //           </Col>
    //         </Row>
    //       </div>
    //     );
    //   },
    // },
  ];

  return (
    <>
      <Row>
        <Title style={{ fontSize: "20px" }}>IMSS / INFONAVIT</Title>
      </Row>
      <Form
        layout="vertical"
        form={formImssInfonavit}
        onFinish={formImmssInfonavitAct}
      >
        <Row>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item 
              name="employee_type" 
              label="Tipo de empleado"
              rules={[ruleRequired]}
            >
              <Select
                options={typeEmployee}
                notFoundContent={"No se encontraron resultado."}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="salary_type" label="Tipo de salario" rules={[ruleRequired]}>
              <Select
                options={typeSalary}
                notFoundContent={"No se encontraron resultado."}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="reduce_days" label="Semana o jornada reducida" rules={[ruleRequired]}>
              <Select
                options={reduceDays}
                notFoundContent={"No se encontraron resultado."}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="movement_date" label="Fecha de movimiento" rules={[ruleRequired]}>
              <DatePicker
                locale={locale}
                format="DD-MM-YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <SelectFamilyMedicalUnit/>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
                name="nss"
                label="IMSS"
                rules={[ruleRequired, onlyNumeric, minLengthNumber]}
            >
              <Input maxLength={11} />
            </Form.Item>
          </Col>

          <Col lg={6} xs={22} offset={1}>
            <Form.Item
                name="sbc"
                label="Salario diario"
                maxLength={13}
                rules={[fourDecimal, ruleRequired]}
            >
              <Input maxLength={10} />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
                name="integrated_daily_salary"
                label="Salario diario integrado"
                maxLength={13}
                rules={[fourDecimal]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"end"}>
          <Form.Item>
            <Button loading = { loadingIMSS } type="primary" htmlType="submit">
              Guardar
            </Button>
          </Form.Item>
        </Row>
      </Form>

      <Spin tip="Cargando..." spinning={loadingTable}>
        <Table
          columns={colCredit}
          scroll={{
            x: true,
          }}
          rowKey="id"
          dataSource={infonavitCredit}
          locale={{
            emptyText: loadingTable
              ? "Cargando..."
              : "No se encontraron resultados.",
          }}
        />
      </Spin>
    </>
  );
};

export default FormImssInfonavit;

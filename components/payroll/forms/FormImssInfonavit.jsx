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
import { typeEmployee, typeSalary, reduceDays } from "../../../utils/constant";
import SelectFamilyMedicalUnit from "../../selects/SelectFamilyMedicalUnit";
import SelectMedicineUnity from "../../selects/SelectMedicineUnity";
import WebApiPayroll from "../../../api/WebApiPayroll";
import moment from "moment";
import { ruleRequired } from "../../../utils/rules";

const FormImssInfonavit = ({ person, person_id, node }) => {
  
  const { Title } = Typography;
  const [formImssInfonavit] = Form.useForm();
  const [loadingTable, setLoadingTable] = useState(false);
  const [ loadingIMSS, setLodingIMSS ] = useState(false)
  const [infonavitCredit, setInfonavitCredit] = useState([]);

  useEffect(() => {
    person.branch_node && person_id && node && userCredit();
  }, [person_id]);

  const formImmssInfonavitAct = (values) => {
    setLodingIMSS(true)
    values.person = person_id
    values.movement_date = values.movement_date ? moment(values.movement_date).format('YYYY-MM-DD') : ""
    console.log("Data", values);
    // funcion WEB API
    // WebApiPayroll.saveIMSSInfonavit(values)
    // .then((response) => {
    //   console.log('Response', response)
    //   setLodingIMSS(false)  
    // })
    // .catch((error) => {
    //   console.log('Error -->', error)
    //   setLodingIMSS(false)
    // })
    setLodingIMSS(false)
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

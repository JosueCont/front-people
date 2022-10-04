import React, { useState, useEffect } from 'react'
import { Spin, Button, Row, Col, Typography, Table, Modal, Form, Input, Select, DatePicker } from "antd";
import locale from 'antd/lib/date-picker/locale/es_ES';
import { typeEmployee, typeSalary, reduceDays } from '../../utils/constant';
import SelectFamilyMedicalUnit from '../selects/SelectFamilyMedicalUnit';
import SelectMedicineUnity from '../selects/SelectMedicineUnity';
import WebApiPayroll from '../../api/WebApiPayroll';


const FormIMSSINFONAVIT = ({ person, person_id, node }) => {
  
  const { Title } = Typography;
  const [ formImssInfonavit ] = Form.useForm()
  const [loadingTable, setLoadingTable ] = useState(false)

  useEffect(() => {
    person && person_id && node && userCredit()
  },[person_id])

  const formImmssInfonavitAct = (values) => {
    console.log("Data", values)
  }

  const userCredit = async () => {
    setLoadingTable(true)
    let data = {
      action: "getActiveCredit",
      node: node,
      patronal_registration: person.branch_node.patronal_registration.id,
      user: "ivan@grupogivel.com",
      password: "GHS080131bf7",
      person: person_id
    }
    WebApiPayroll.getInfonavitCredit(data)
    .then((response) => {
      setLoadingTable(false)
      console.log('Response', response)
    })
    .catch((error) => {
      setLoadingTable(false)
      console.log('Error', error)
    })
  }

  const colBank = [
    {
      title: "Banco",
      render: (item) => {
        return <>{item.bank.name}</>;
      },
      key: "id",
    },
    {
      title: "Número de cuenta",
      dataIndex: "account_number",
      key: "account_number",
    },
    {
      title: "Clabe interbancaria",
      dataIndex: "interbank_key",
      key: "interbank_key",
    },
    {
      title: "Número de tarjeta",
      dataIndex: "card_number",
      key: "card_number",
    },
    {
      title: "Fecha de vencimiento",
      render: (item) => {
        return (
          <>
            {item.expiration_month}/{item.expiration_year}
          </>
        );
      },
    },
    {
      title: "Estatus",
      render: (item) => {
        return <>{item.status ? "Activo" : "Inactivo"}</>;
        // <Switch checked={item.status} readOnly />;
      },
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
        layout='vertical'
        form={formImssInfonavit}
        onFinish = { formImmssInfonavitAct }
      >
        <Row>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="employee_type" label="Tipo de empleado">
              <Select 
                options={ typeEmployee }
                notFoundContent={"No se encontraron resultado."}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="salary_type" label="Tipo de salario">
              <Select 
                options={ typeSalary }
                notFoundContent={"No se encontraron resultado."}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="reduce_days" label="Semana o jornada reducida">
              <Select 
                options={ reduceDays }
                notFoundContent={"No se encontraron resultado."}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="movement_date" label="Fecha de movimiento">
              <DatePicker
                locale={ locale }
                format = "DD-MM-YYYY"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <SelectFamilyMedicalUnit />
          </Col>
        </Row>
        <Row justify={"end"}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </Form.Item>
        </Row>
      </Form>

      <Spin tip="Cargando..." spinning={loadingTable}>
        <Table
          columns={colBank}
          dataSource={[]}
          locale={{
            emptyText: loadingTable
              ? "Cargando..."
              : "No se encontraron resultados.",
          }}
        />
      </Spin>
      
    </>
  )
}

export default FormIMSSINFONAVIT
import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  Row,
  Col,
  Typography,
  Table,
  Breadcrumb,
  Descriptions,
  Button,
  Spin
} from "antd";
import { useRouter } from "next/router";
import moment from "moment";
import { withAuthSync } from "../../../libs/auth";
import {API_URL} from '../../../config/config'
import Axios from 'axios';

const HolidaysNew = () => {
    const route = useRouter();
    const { id } = route.query;
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState({});
    const [strStatus, SetStrStatus] = useState(null)
  
    const onCancel = () => {
        route.push("/lending");
    };

  const columns = [
    {
      title: "Plazo",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Pago fijo",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Saldo",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Fecho de pago",
      dataIndex: "datePay",
      key: "datePay",
    },
    {
      title: "Estatus",
      dataIndex: "estatus",
      key: "status",
    },
  ];

  const getDetails = async () => {
    setLoading(true);
    try {
      let response = await Axios.get(API_URL+`/payroll/loan/${id}`);
      let data = response.data;
      console.log("data", data);
      setDetails(data);
      SetStrStatus( data.status === 1 ? 'Pendiente' : data.status === 2 ? 'Aprobado' : 'Rechazado' )
    } catch (e) {
      console.log("error", e);
    }finally{
        setLoading(false);
    }
  };


  useEffect(() => {
    if (id) {
      getDetails();
    }
  }, [route]);

  return (
    <MainLayout currentKey="7.1">
        <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
            <Breadcrumb.Item>Inicio</Breadcrumb.Item>
            <Breadcrumb.Item href="/lending/">Préstamos</Breadcrumb.Item>
            <Breadcrumb.Item>Detalles</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container back-white" style={{ width: "100%", padding: "20px 0" }} >
            <Spin spinning={loading}>
                <Row>
                    <Col span={16} offset={1}>
                        <Descriptions
                        title="Detalles del préstamo"
                        column={2}
                        labelStyle={{ width: 150, fontWeight: 700 }}
                        >
                        <Descriptions.Item label="Estatus"> { strStatus }  </Descriptions.Item>
                        <Descriptions.Item label="Fecha autorizada">
                            
                        </Descriptions.Item>
                        <Descriptions.Item label="Colaborador">
                            { details.person ? details.person.first_name+' '+details.person.flast_name : null }
                        </Descriptions.Item>
                        <Descriptions.Item label="Plazos">{details.deadline ? details.deadline : null }</Descriptions.Item>
                        <Descriptions.Item label="Fecha de solicitud">
                            { details.timestamp ? moment(details.timestamp).format("DD/MMM/YYYY") : null }
                        </Descriptions.Item>
                        <Descriptions.Item label="Periodicidad">
                            {
                            details.periodicity && details.periodicity === 1 ? 'Semanal' 
                            : details.periodicity && details.periodicity === 2 ? 'Catorcenal'
                            : details.periodicity && details.periodicity === 3 ? 'Quincenal'
                            : details.periodicity && details.periodicity === 4 ? 'Mensual'
                            : null
                        }
                        </Descriptions.Item>
                        <Descriptions.Item label="Tipo de préstamo">
                            { details.type && details.type === 'EMP' ? 'Empresa' : details.type && details.type === 'EPS' ? 'E-Pesos' : null }
                        </Descriptions.Item>
                        <Descriptions.Item label="Pago">empty</Descriptions.Item>
                        <Descriptions.Item
                            label="Motivo"
                            span={16}
                            contentStyle={{ textAlign: "justify" }}
                        >
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                            Possimus quidem rem expedita porro autem! Cum eius quidem sit
                            placeat ducimus eligendi minus blanditiis quisquam. Maiores
                            laborum modi dolorum placeat sequi.
                        </Descriptions.Item>
                        </Descriptions>
                        <Table columns={columns} />
                    </Col>
                    <Col
                    span={16}
                    offset={1}
                    style={{ textAlign: "right", padding: "30px 0" }}
                >
                    <Button onClick={onCancel} style={{ padding: "0 40px" }}>
                    Regresar
                    </Button>
                </Col>
                </Row>
            </Spin>
      </div>
    </MainLayout>
  );
};

export default withAuthSync(HolidaysNew);

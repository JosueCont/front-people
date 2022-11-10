import React, { useState, useEffect } from "react";
import MainLayout from '../../../layout/MainLayout'
import {
  Button,
  Col,
  Row,
  Table,
  Spin
} from "antd";
import WebApiFiscal from '../../../api/WebApiFiscal';
import { Breadcrumb } from 'antd';
import { useRouter } from "next/router";

const detailIntegrator = () => {

  
  const route = useRouter()
  const query = route.query? route.query : {}
  const [loading, setLoading] = useState(false)
  const [detailFactor, setDetailFactor] = useState([])

  useEffect(() => {
    query.id && getDetails()
  },[query.id])

  const getDetails = () => {
    setLoading(true)
    WebApiFiscal.detailsIntegratorFactor(query.id)
    .then((response) => {
      setDetailFactor(response.data)
      setLoading(false)
    })
    .catch((e) => {
      console.log('Error', e.response)
      setLoading(false)
    })
  }

  const columns = [
    {
      title: 'Años de servicio',
      dataIndex: 'service_years',
      key: 'service_year'
    },
    {
      title: 'Días de aguinaldo',
      dataIndex: 'bonus_days',
      key: 'bonus_days'
    },
    {
      title: 'Días de vacaciones',
      dataIndex: 'vacations_days',
      key: 'vacations_days'
    },
    {
      title: 'Porcentaje de prima vacacional',
      dataIndex: 'vacation_percent',
      key: 'vacation_percent'
    },
    {
      title: 'Factor de integracion',
      dataIndex: 'integration_factor',
      key: 'integration_factor'
    }
  ]


  return(
    <Spin spinning = { loading }>
      <MainLayout
        currentKey={["integrationFactors"]}
        defaultOpenKeys={["company"]}
      >
              <Breadcrumb className={"mainBreadcrumb"}>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/home/persons/" })}
          >
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item>Empresa</Breadcrumb.Item>
          <Breadcrumb.Item>Prestaciones</Breadcrumb.Item>
          <Breadcrumb.Item>Detalle</Breadcrumb.Item>
        </Breadcrumb>

        <div
          className="container-border-radius"
          style={{ padding: 24, minHeight: 380, height: "100%" }}
        >
          <Row justify={"end"}>
            <Col>
                  <Button
                    className="close_modal"
                    htmlType="button"
                    style={{ marginRight: 10 }}
                    onClick={() =>
                      route.push({ pathname: "/business/integrationFactors" })
                    }
                  >
                    Cerrar
                  </Button>
              </Col>
            </Row>
          <Row justify="end" style={{ marginTop: 30 }}>
          <Col span={24}>
            <Table 
              className="table-data"
              columns={columns}
              dataSource={detailFactor}
              key="tableDetailIntegrationFactors"
              scroll={{ x: 350 }}
              locale={{
                emptyText: loading
                  ? "Cargando..."
                  : "No se encontraron resultados.",
              }}
              pagination = {false}
            />
          </Col>
        </Row>
        </div>
      </MainLayout>
    </Spin>
  )
}

export default detailIntegrator
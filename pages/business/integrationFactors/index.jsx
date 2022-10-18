import React, { useState, useEffect } from 'react'
import MainLayout from '../../../layout/MainLayout'
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  Button,
  message,
  Tooltip,
  Modal,
  Alert,
  Space,
} from "antd";
import {
  EditOutlined,
  CalendarOutlined,
  PlusCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { withAuthSync } from '../../../libs/auth';
import { Global } from "@emotion/core";
import { connect } from "react-redux";
import WebApiFiscal from '../../../api/WebApiFiscal';
import moment from 'moment';

const integrationFactorsIndex = ({ ...props }) =>{

  const route = useRouter();
  const [ loading, setLoading ] = useState(false)
  const [ nodeId, setNodeId ] = useState(null)
  const [ integratorFsctorsList, setIntegratorfactorsList ] = useState([])

  useEffect(() => {
    props.currentNode && setNodeId(props.currentNode.id)
  },[props.currentNode])

  useEffect(() => {
    nodeId && getIntegrationFactors()
  }, [nodeId])


  const getIntegrationFactors = async () => {
    setLoading(true)
    await WebApiFiscal.getIntegrationFactors(nodeId)
    .then((response) => {
      setIntegratorfactorsList(response.data.results)
      setLoading(false)
    })
    .catch((error) => {
      setLoading(false)
      console.log('Error -->', error)
    })
  }

  const integrationFactorsColumns = [
    {
      title: "Descripción",
      key: "description",
      dataIndex: 'description',
      render: (description) => description || ""
    },
    {
      title: "Fecha de creación",
      key: "timestamp",
      dataIndex: 'timestamp',
      render: (timestamp) => moment(timestamp).format('YYYY-MM-DD')
    },
    {
      title: "Numero de dias de vacaciones",
      key: "vacations_days",
      dataIndex: "vacations_days"
    },
    {
      title: "Porcentaje de prima vacacional",
      key: "vacation_percent",
      dataIndex: "vacation_percent"
    },
    {
      title: "Dias de aguinaldo",
      key: "bonus_days",
      dataIndex: "bonus_days"
    },
    {
      title: 'Acciones',
      render: (item) => (
        <div>
          <Space>
            <EditOutlined 
              style={{ cursor: 'pointer' }}
              onClick = { () => {
                route.push({
                  pathname: "/business/integrationFactors/add",
                  query: {
                    id: item.id
                  }
                })
              }}
            />
          </Space>
        </div>
      )
    }
  ] 

  return(
    <>
      <Global
        styles={`
        .ant-table{
          padding: 30px;
        }
        .ant-table-thead > tr > th.ant-table-cell{
          font-weight: 600;
          background: transparent !important;
        }
        .modal_form .ant-modal-body{
          padding-left: 60px;
          padding-right: 60px;
        }
      `}
      />
      <MainLayout
        currentKey={["integrationFactors"]}
        defaultOpenKeys={["company"]}
      >
        <Breadcrumb className={"mainBreadcrumb"}>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/home/persons/"})}
          >
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item>Empresa</Breadcrumb.Item>
          <Breadcrumb.Item>Factores de integración</Breadcrumb.Item>
        </Breadcrumb>
        <Row justify="end">
          <Col>
            <Button
              style={{
                fontWeight: "bold",
                color: "white",
                marginTop: "auto",
                border: "none",
                padding: "0 30px",
                background: "#7B25F1 !important",
              }}
              onClick={() =>
                route.push({
                  pathname: "/business/integrationFactors/add",
                })
              }
              key="btn_new"
              size="large"
            >
              <PlusCircleOutlined />
              <small style={{ marginLeft: 10 }}>Agregar Configuración</small>
            </Button>
          </Col>
        </Row>
        <Row justify="end" style={{ marginTop: 30 }}>
          <Col span={24}>
            <Table 
              className="table-data"
              columns={integrationFactorsColumns}
              dataSource={integratorFsctorsList}
              key="tableIntegrationFactors"
              scroll={{ x: 350 }}
              loading={loading}
              locale={{
                emptyText: loading
                  ? "Cargando..."
                  : "No se encontraron resultados.",
              }}
            />
          </Col>
        </Row>
    </MainLayout>
    </>
    
  )
}

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(withAuthSync(integrationFactorsIndex))
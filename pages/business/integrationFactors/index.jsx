import React, { useState, useEffect } from 'react'
import MainLayout from '../../../layout/MainInter'
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
  ConfigProvider
} from "antd";
import {
  EditOutlined,
  CalendarOutlined,
  PlusCircleOutlined,
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { withAuthSync } from '../../../libs/auth';
import { Global } from "@emotion/core";
import { connect } from "react-redux";
import WebApiFiscal from '../../../api/WebApiFiscal';
import moment from 'moment';
import { verifyMenuNewForTenant } from "../../../utils/functions"
import esES from "antd/lib/locale/es_ES";

const integrationFactorsIndex = ({ ...props }) =>{

  const route = useRouter();
  const [ loading, setLoading ] = useState(false)
  const [ nodeId, setNodeId ] = useState(null)
  const [ deleted, setDeleted ] = useState(null)
  const [ integratorFsctorsList, setIntegratorfactorsList ] = useState([])

  useEffect(() => {
    props.currentNode && setNodeId(props.currentNode.id)
  },[props.currentNode])

  useEffect(() => {
    nodeId && getIntegrationFactors()
  }, [nodeId])

  useEffect(() => {
    if (deleted && deleted.id) {
      Modal.confirm({
        title: "¿Está seguro de eliminar este registro?",
        content: "Si lo elimina no podrá recuperarlo",
        icon: <ExclamationCircleOutlined />,
        okText: "Sí, eliminar",
        okButtonProps: {
          danger: true,
        },
        cancelText: "Cancelar",
        onOk() {
          deleteRegister();
        },
      });
    }
  },[deleted])


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

  const setDeleteRegister = (data) => {
    setDeleted(data);
  };

  const deleteRegister = () => {
    setLoading(true)
    WebApiFiscal.deleteIntegrationFactor(deleted.id)
    .then((response) => {
      setLoading(false)
      getIntegrationFactors()
      message.success('Registro eliminado')
    })
    .catch((error) => {
      setLoading(false)
      console.log('Error', error)
    })
  }

  const integrationFactorsColumns = [
    {
      title: "Nombre",
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
      title: "Días de aguinaldo",
      key: "bonus_days",
      dataIndex: "bonus_days"
    },
    {
      title: "Número de días de vacaciones",
      key: "vacations_days",
      dataIndex: "vacations_days"
    },
    {
      title: "Porcentaje de prima vacacional",
      key: "vacation_percent",
      dataIndex: "vacation_percent"
    },
    {
      title: 'Acciones',
      render: (item) => (
        <div>
          <Space>
          <Tooltip title="Ver">
              <EyeOutlined 
                style={{ cursor: 'pointer' }}
                onClick = { () => {
                  route.push({
                    pathname: "/business/integrationFactors/details",
                    query: {
                      id: item.id
                    }
                  })
                }}
              />
            </Tooltip>
            <Tooltip title="Editar">
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
            </Tooltip>
            <Tooltip title="Eliminar">
              <DeleteOutlined 
                style={{ cursor: 'pointer' }}
                onClick = { () => setDeleteRegister(item)}
              />
            </Tooltip>
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
        defaultOpenKeys={["strategyPlaning","company"]}
      >
        <Breadcrumb className={"mainBreadcrumb"}>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/home/persons/"})}
          >
            Inicio
          </Breadcrumb.Item>
          {verifyMenuNewForTenant() && 
            <Breadcrumb.Item>Estrategia y planeación</Breadcrumb.Item>
          }
          <Breadcrumb.Item>Empresa</Breadcrumb.Item>
          <Breadcrumb.Item>Prestaciones</Breadcrumb.Item>
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
                marginRight: 10
              }}
              onClick={() =>
                route.push({
                  pathname: "/business/integrationFactors/defaultFactors",
                })
              }
              key="btn_new"
              size="large"
            >
              <EyeOutlined />
              <small style={{ marginLeft: 10 }}>Ver prestaciones de ley</small>
            </Button>
          </Col>
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
              <small style={{ marginLeft: 10 }}>Agregar prestación</small>
            </Button>
          </Col>
        </Row>
        <Row justify="end" style={{ marginTop: 30 }}>
          <Col span={24}>
          <ConfigProvider locale={esES}>
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
              pagination = {{
                // pageSize: 10,
                total: integratorFsctorsList?.count,
                showSizeChanger:true
                
              }}
            />
          </ConfigProvider> 
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
import React, { useState, useEffect } from 'react'
import MainLayout from '../../../layout/MainLayout'
import IntegrationFactorsForm from '../../../components/forms/IntegrationFactorsForm';
import WebApiFiscal from '../../../api/WebApiFiscal';
import { Breadcrumb } from 'antd';
import { useRouter } from "next/router";
import { connect } from 'react-redux'

const add = ({ ...props }) => {

  const route = useRouter()
  const query = route.query? route.query : {}
  const [ nodeId, setNodeId ] = useState(null)
  const [ factor, setFactor ] = useState(null)

  useEffect(() => {
    props.currentNode && setNodeId(props.currentNode.id)
  },[props.currentNode])

  useEffect(() => {
    query.id && getIntegrationFactor()
  },[query.id])

  const getIntegrationFactor = () => {
    WebApiFiscal.getSpecificIntegratorFactor(query.id)
    .then((response) => {
      setFactor(response.data)
    })
    .catch((err) => {
      console.log('Error', err)
    })
  }

  return (<>
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
        <Breadcrumb.Item>Factores de integración</Breadcrumb.Item>
        <Breadcrumb.Item>Nuevo</Breadcrumb.Item>
      </Breadcrumb>

      <div
        className="container-border-radius"
        style={{ padding: 24, minHeight: 380, height: "100%" }}
      >
        <IntegrationFactorsForm
          nodeId={ nodeId }
          factor = { factor }
        />
      </div>
    </MainLayout>
  </>)
}

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(add)
import React, { useEffect, useState } from 'react'
import MainLayout from '../layout/MainLayout'
import OrgChart from '@balkangraph/orgchart.js';
import ChartOrg from '../components/business/ChartOrg'
import { Global, css } from '@emotion/core';
import { connect } from 'react-redux';
import {withAuthSync} from "../libs/auth";
import { pid } from 'process';
import WebApiPeople from '../api/WebApiPeople'
import { Spin } from 'antd';

const ChartOrgComponent = ({currentNode, cat_branches, ...props}) => {
  const [mainLogo, setMainLogo] = useState("");
  const [nodes, setNodes] = useState([])
  const [loading, setLoading] = useState(true)
  const isBrowser = () => typeof window !== "undefined";
  
  const getAllInfo = async () => {
    setLoading(true)
    let temp_nodes =  [...nodes]
    let company = setInfoCompanies()
    if (company){
      let branchs = getBranchsOffice()
      console.log('branchs',branchs)
      if(branchs.length > 0){
        let {deptos, persons } = await getPersonsDeptos();
        let new_nodes = [company].concat(branchs, deptos, persons);
        setNodes(new_nodes)
        setLoading(false)
      }

    }
  }


  useEffect(() => {
    if (isBrowser()) {
      setMainLogo(window.sessionStorage.getItem("image"));
    }
  }, []);


  const getBranchsOffice = () => {
    let branchs = []
    branchs = cat_branches?.map(item => {
      return {  
        id: item.id,
        pid: item.node,
        name: item.name,
        tags: ["Branch_office"],
      }
    })
    return branchs
  }

  const setInfoCompanies = () => {
    let mainNode = null
    if (currentNode){
      mainNode = {
        id: currentNode.id,
        name: currentNode.name,
        tags: ["Company"],
        title: "CEO",
        img: currentNode.image,
        email: "my@email.com",
        phone1: "+6465 6454 8787",
        phone2: "+2342 3433 5455",
        address: "T2"
      }
    }
    return mainNode
  }

  useEffect(() => {
    if(nodes < 1){
      getAllInfo()
    }
  }, [currentNode])
  
  const getPersonsDeptos = async () => {
    try {      
      let response = await WebApiPeople.filterPerson({node: currentNode.id });
      let deptos = []
      let persons = []
      if(response.status === 200){
        response?.data?.map(person => {
          /* Obtenemos los departamentos */
          if(person.work_title){
            var index = deptos.findIndex((depto, i) => {
              return depto.id === person.work_title.department.id
            });
            if(index < 0){
              deptos.push({
                id: person.work_title.department.id,
                name: person.work_title.department.name,
                pid: person.branch_node ? person.branch_node.id : person.node_user.id
              })
            }
          }
          persons.push({
            id: person.id,
            pid: person.work_title ? person.work_title.department.id : person.branch_node ? person.branch_node.id : person.node,
            name: person.first_name
          })
        })
        return {
          deptos : deptos,
          persons: persons
        }
      }else{
        return {
          deptos : [],
          persons: [persons]
        }
      }
    } catch (error) {
      console.log('error', error)
      return {
        deptos : null,
        persons: null
      }
      
    }
  }


  return (
    <>
      <Global
        styles={css`
          .div-main-layout{
            padding: 0px;
          }
        `}
      />
      <MainLayout defaultOpenKeys={['company']} currentKey={["chartOrg"]}>
        {/* {
          loading &&
          <div style={{ width:'100%',  height:'100vh', display: 'flex' }}>
            <span style={{ margin:'auto' }}>
              
            </span>
          </div>
        } */}
        {/* {
          nodes.length > 0 && !loading && */}
        <Spin spinning={loading} tip="Cargando información" >
          <ChartOrg mainLogo={mainLogo} nodes={nodes} />
        </Spin>
        {/* } */}
        
      </MainLayout>
    </>
  )
}

const mapState = (state) => {
  return {
      currentNode: state.userStore?.current_node,
      cat_branches: state.catalogStore.cat_branches,
  }
}



export default connect(mapState)(withAuthSync(ChartOrgComponent))
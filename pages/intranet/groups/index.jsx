import React, { useEffect, useState } from "react";
import { FormattedMessage} from 'react-intl'
import MainLayout from "../../../layout/MainLayout";
import {
    Row,
    Col,
    Table,
    Breadcrumb,
    Button,
    Form,
    Input,
    Select,
    Tooltip,
  } from "antd";
  import {
    EditOutlined,
    EyeOutlined,
  } from "@ant-design/icons";
  import axiosApi from "../../../libs/axiosApi";
  import Axios from 'axios'
  import { API_URL } from "../../../config/config";


const GroupView =()=>{
    const { Column } = Table;
    const [groups,setGroups] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(()=>{

        console.log(API_URL)
        getGroups()
    },[])

    const goToDetails=(group)=>{
        console.log('detail',group)
    }

    const goToEdit=(group)=>{
        console.log('edit',group)
    }

    const getGroups=async()=>{
        setLoading(true)
        try{
            const url = API_URL+'/intranet/group/'
            const res = await Axios.get(url);
            console.log(res)
            if(res.data.count>0){
                setGroups(res.data.results);
            }
        }catch(e){
            console.log(e)
        }finally{
            setLoading(false)
        }
    }

    return <MainLayout currentKey="11.1">
        <Breadcrumb className={"mainBreadcrumb"} key="mainBreadcrumb">
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          <FormattedMessage defaultMessage="Inicio"  id="web.init" />
        </Breadcrumb.Item>
        <Breadcrumb.Item><FormattedMessage defaultMessage="Grupos"  id="header.groups" /></Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>

        <Table
            dataSource={groups}
            key="table_groups"
            loading={loading}
        >
            <Column
                title="Imagen"
                dataIndex="image"
                key="image"
                render={(image) =>
                   image?<img src={image} style={{width:100}} />:'N/A'
                }
            ></Column>
            <Column
                    title="Nombre"
                    dataIndex="name"
                    key="name"
                  ></Column>
                  <Column
                    title="Descripción"
                    dataIndex="description"
                    key="description"
                  ></Column>
                  <Column
                    title="Acciones"
                    key="actions"
                    render={(text, record) => (
                      <>
                        <EyeOutlined
                          className="icon_actions"
                          onClick={()=> goToDetails(record)}
                          key={"goDetails_" + record.id}
                        />
                          <EditOutlined
                            className="icon_actions"
                            onClick={()=> goToEdit(record)}
                            key={"edit_" + record.id}
                          />
                        
                      </>
                    )}
                  ></Column>
        </Table>
      </div>
    </MainLayout>
}

export default GroupView
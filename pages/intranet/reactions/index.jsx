import {withAuthSync} from "../../../libs/auth";
import MainLayout from "../../../layout/MainLayout";
import {React, useEffect, useState} from "react";
import { useRouter } from "next/router";

import {
    Layout,
    Breadcrumb,
    Table,
    Tooltip,
    Row,
    Image,
    Col,
    List,
    Input,
    Select,
    Switch,
    Button,
    Typography,
    Form,
    Avatar,
    message,
    Modal,
    Alert,
    Menu,
    Dropdown,
} from "antd";
import {FormattedMessage} from "react-intl";
import {API_URL} from "../../../config/config";
import Axios from "axios";



const reactions =()=>{
    const router = useRouter();
    const { Column } = Table;
    const { Text } = Typography;
    const [groups,setGroups] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        getGroups()
    },[])

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

    return(
        <MainLayout currentKey="11.2">
            <Breadcrumb className={"mainBreadcrumb"} key="mainBreadcrumb">
                <Breadcrumb.Item
                    className={"pointer"}
                    onClick={() => router.push({ pathname: "/home" })}
                >
                    <FormattedMessage defaultMessage="Inicio"  id="web.init" />
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <FormattedMessage defaultMessage="Reacciones"  id="header.reactions" />
                </Breadcrumb.Item>
            </Breadcrumb>
            <div className="container" style={{ width: "100%" }}>

                <Table
                    dataSource={groups}
                    key="table_reactions"
                    loading={loading}
                >
                    <Column
                        title="Imagen"
                        dataIndex="image"
                        key="image"
                        render={(image) =>
                            image?<img src={image} style={{width:100}} />:'N/A'
                        }
                    />
                    <Column
                        title="Nombre"
                        dataIndex="name"
                        key="name"
                    />
                    <Column
                        title="Descripción"
                        dataIndex="description"
                        key="description"
                    />
                </Table>
            </div>
        </MainLayout>
    )

}
export default withAuthSync(reactions);

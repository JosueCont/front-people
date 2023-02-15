import React,{useEffect,useState} from "react";
import { Table,Spin } from "antd";
import WebApiPeople from "../../api/WebApiPeople";
import moment from 'moment';
import {  FileExcelOutlined } from '@ant-design/icons';

const AfilliateMovements = ({node, id}) => {
    const [loading,setLoading] = useState(false);
    const [data,setData] = useState([]);
    const columns = [
        {
            title: "Periodo",
            dataIndex: "period",
        },
        {
          title: "Descripción",
          dataIndex: "description",
        },
        {
           title: "Fecha",
           dataIndex: "timestamp",
           render:(item) =>(
                <>{moment(item).format('YYYY-MM-DD')}</>
           )
        },
        {
          title: "Documento",
          dataIndex: "file",
          render:(item) => (
            item != null ? <><a href={item}  download> <FileExcelOutlined /> Descargar </a></> : <span style={{color:'gray'}}>Sin documento</span>
          )
        },
    ];
    useEffect(() => {
        id && getAfilliateMovements()
    },[id]);


    const getAfilliateMovements = async() => {
        try {
            setLoading(true);
            let url = `?node_id=${node}&origin__type=4&patronal_registration_id=${id}`;
            const movements = await WebApiPeople.afilliateMovements(url);
            setLoading(false)
            setData(movements?.data?.results)
        } catch (e) {
            setData([])
            console.log('error',e)
        }finally {
            setLoading(false)
        }
    }

    return(
        <>
            <Spin tip="Cargando..." spinning={loading}>
                <Table
                    columns={columns}
                    dataSource={data}
                    key={(item,index) => index}
                    pagination={{showSizeChanger:true}}
                    locale={{
                      emptyText: loading
                        ? "Cargando..."
                        : "No se encontraron resultados.",
                    }}/>
            </Spin>
        </>
    )
};
export default AfilliateMovements;
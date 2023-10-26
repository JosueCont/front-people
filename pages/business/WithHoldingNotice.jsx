import React,{useEffect,useState} from "react";
import {Table, Spin, Button} from "antd";
import WebApiPeople from "../../api/WebApiPeople";
import moment from 'moment';
import {FilePdfOutlined, FileExcelOutlined, SyncOutlined} from '@ant-design/icons';

const WithHoldingNotice = ({getnotices, loading, data, message}) => {

    const columns = [
        {
           title: "Fecha",
           dataIndex: "generated_date",
           key:"generated_date",
            width: 300
        },
        {
          title: "Documento csv",
          dataIndex: "csv_document",
          render:(item) => (
            item != null ? <><a href={item} download> <FileExcelOutlined /> Descargar excel</a></> : <span style={{color:'gray'}}>Sin documento</span>
          )
        },
        {
            title: "Documento pdf",
            dataIndex: "pdf_document",
            render:(item) => (
              item != null ? <><a href={item} target={'_blank'} download> <FilePdfOutlined /> Descargar pdf</a></> : <span style={{color:'gray'}}>Sin documento</span>
            )
          },
    ];

    useEffect(() => {
        getnotices()
    },[]);


    return(
        <>

            <Spin tip="Cargando..." spinning={loading}>
            <Table
                columns={columns}
                dataSource={data}
                pagination={{showSizeChanger:true}}
                locale={{
                    emptyText: loading
                        ? "Cargando..."
                        : message,
                }}/>
        </Spin>
        </>

    )
} 

export default WithHoldingNotice;
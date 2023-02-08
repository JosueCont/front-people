import React,{useEffect,useState} from "react";
import { Table,Spin } from "antd";
import WebApiPeople from "../../api/WebApiPeople";
import moment from 'moment';
import {  FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';

const WithHoldingNotice = ({patronalData}) => {
    const [loading,setLoading] = useState(false);
    const [data,setData] = useState([]);
    const [message, setMessage] = useState('');

    const columns = [
        {
           title: "Fecha",
           dataIndex: "generated_date",
           render:(item) =>(
                <>{moment(item).format('YYYY-MM-DD')}</>
           )
        },
        {
          title: "Documento csv",
          dataIndex: "csv_document",
          render:(item) => (
            item != null ? <><a href={item}  download> <FileExcelOutlined /> Descargar excel</a></> : <span style={{color:'gray'}}>Sin documento</span>
          )
        },
        {
            title: "Documento pdf",
            dataIndex: "pdf_document",
            render:(item) => (
              item != null ? <><a href={item}  download> <FilePdfOutlined /> Descargar pdf</a></> : <span style={{color:'gray'}}>Sin documento</span>
            )
          },
    ];

    useEffect(() => {
        getnotices()
    },[]);

    const getnotices = async() => {
        try {
            let data = [
                {generated_date:'2023-01-30',csv_document:'prueba.csv',pdf_document:'prueba.pdf'}
            ];
            const {id,node,} = patronalData;
            let url = `?node_id=${node}&patronal_registration_id=${id}`;
            setLoading(true);
            const notices = await WebApiPeople.getWithHoldingNotice(url);
            setLoading(false);
            if(notices?.data?.message) setMessage(notices?.data?.message)
            else setData(notices?.data)
        } catch (e) {
            console.log(e)
        }finally {
            setLoading(false);
        }
    }


    return(
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
    )
} 

export default WithHoldingNotice;
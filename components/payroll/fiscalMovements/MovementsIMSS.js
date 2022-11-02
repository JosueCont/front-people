import { useEffect, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';
import { Table, Button, Upload, Row, Col } from 'antd';
import UploadFile from "../../UploadFile";

const MovementsIMSS=()=>{

    const [file, setFile]=useState(null)


    useEffect(()=>{
        if(file){
            alert('enviado archivo')
        }
    },[file])


    const columns = [
        {
            title: 'Fecha de envío',
            dataIndex: 'name',
        },
        {
            title: 'Lote',
            dataIndex: 'age',
        },
        {
            title: 'Tipo',
            dataIndex: 'address',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
        {
            title: 'Acuse',
            dataIndex: 'acse',
        },
        {
            title: 'Resultado',
            dataIndex: 'acse',
        },
        {
            title: 'Mensaje',
            dataIndex: 'msj',
        },
    ];


    const data = [
        {
            key: '1',
            name: '12/12/2022',
            age: 32,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: '12/12/2022',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: '12/12/2022',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
    ];


    const settingsUplod={
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };


    return (
        <>
            <h4>Consulta de movimientos</h4>

            <Row justify={'end'}>
                <Col span={5}>
                    <UploadFile
                        textButton={"Cargar DispMag"}
                        setFile={setFile}
                        validateExtension={".txt"}
                    />
                </Col>
            </Row>

            <Table style={{width:'100%'}} columns={columns} dataSource={data} size="middle" />
        </>
    )
}

export default MovementsIMSS;
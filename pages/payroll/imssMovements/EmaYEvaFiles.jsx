import React, { useState, useEffect } from "react";
import { Row, col, Table, Space, Button,Popconfirm,message } from "antd";
import WebApiPeople from '../../../api/WebApiPeople'
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

const EmaYEvaFiles = ({ files, loading, total=0, changePage, onRefresh }) => {

  const [deleting,setDeleting]=useState(false)

  const confirmDelete=async(fileEMA)=>{
    setDeleting(true)
    try{
      const res = await WebApiPeople.deleteEMAEBA(fileEMA.id);
      console.log(res?.data?.message)
      if(res && res?.data?.message){
        message.success(res?.data?.message)
      }
    }catch (e){
      console.log(e)
    }finally {
      setDeleting(false)
      onRefresh()
    }


  }

  const text = '¿Seguro de eliminar este archivo?';

  const colums = [
    {
      title: "Nombre del archivo",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Fecha de creación",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => moment(timestamp).format("DD-MM-YYYY"),
    },
    {
      title: "Periodo",
      dataIndex: "period",
      key: "period",
    },
    {
      title: "Descargar",
      key: "actions",
      render: (record) => (
          record?.file && <Space><a href={record.file}>
          <DownloadOutlined />
        </a>
            <ConfirmDelete item={record}/>

          </Space>
      ),
    },
  ];

  const ConfirmDelete=({item})=>{
    return (<Popconfirm placement="topLeft"
                        title={text}
                        onConfirm={()=>confirmDelete(item)} okText="Si" cancelText="Cancelar">
              <a>
                <DeleteOutlined />
              </a>
    </Popconfirm>)
  }

  return (
    <Table
      columns={colums}
      className={"mainTable table-persons"}
      rowKey={"id"}
      size="small"
      loading={loading || deleting}
      dataSource={files}
      locale={{
        emptyText: loading ? "Cargando..." : "No se encontraron resultados.",
      }}
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
        total: total,
        onChange: changePage
      }}
      scroll={{
        x: true,
      }}
    />
  );
};

export default EmaYEvaFiles;

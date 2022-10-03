import React, { useState, useEffect } from 'react'
import { Row, col, Table } from 'antd'
import { DownloadOutlined } from "@ant-design/icons";
import moment from 'moment';

const EmaYEvaFiles = ({ files, loading }) => {


  const colums = [
    {
      title: "Nombre del archivo",
      dataIndex: 'description',
      key:'description'
    },
    {
      title: "Fecha de creación",
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => moment(timestamp).format('YYYY-MM-DD')
    },
    {
      title: 'Descargar',
      key: 'actions',
      render: (record) => (
          <a href={record.file}>
            <DownloadOutlined />
          </a>

      )
    }
  ]

  return (
    <Table 
      columns={colums}
      className={"mainTable table-persons"}
      rowKey={"id"}
      size="small"
      loading = { loading }
      dataSource = { files }
      locale={{
        emptyText: loading ? "Cargando..." : "No se encontraron resultados.",
      }}
      pagination = {{
        pageSize: 10,
        total: files && files.lenght
      }}
      scroll = {{
        x: true
      }}
    />
  )
}

export default EmaYEvaFiles
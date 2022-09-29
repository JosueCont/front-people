import React, { useState, useEffect } from 'react'
import { Row, col, Table } from 'antd'

const EmaYEvaFiles = ({ files }) => {

  const [loading, setLoading] = useState(false)

  const colums = [
    {
      title: "Nombre del archivo",
      dataIndex: 'name',
      key:'name'
    },
    {
      title: "Fecha de creación",
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Descargar',
      key: 'actions',
      render: (record) => {
        <a href="#">link</a>
      }
    }
  ]

  return (
    <Table 
      columns={colums}
      className={"mainTable table-persons"}
      rowKey={"id"}
      size="small"
      loading = { loading }
      locale={{
        emptyText: loading ? "Cargando..." : "No se encontraron resultados.",
      }}
    />
  )
}

export default EmaYEvaFiles
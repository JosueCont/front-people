import {React, useEffect, useState} from 'react'
import {Row,
    Col,
    Card,
    Table} from 'antd'

export const GroupEmotionsPerDayChart = () => {
    const columns = [
        {
          title: 'Fecha',
          dataIndex: 'name',
          key: 'name',
          width:120,
        },
        {
          title: 'Estado de ánimo',
          dataIndex: 'age',
          key: 'age',
        },
      ];
      const data = [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
        },
        {
            key: '4',
            name: 'Joe Black',
            age: 32,
        },        
        {
            key: '5',
            name: 'Joe Black',
            age: 32,
          },
      ];

  return (
    <>
        <Card  
            className='card-dashboard'
            title="Emociones grupales por día"
            style={{
                width: '100%',
            }}>
            
            <Table columns={columns} dataSource={data} pagination={false} size={'100%'} />
        </Card>
    </>
  )
}

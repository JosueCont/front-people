import {React, useEffect, useState} from 'react'
import {Avatar, List,} from 'antd'

export const PeopleMostActive = () => {
    const data = [
        {
            title: 'Nombre usuario',
        },
        {
            title: 'Nombre usuario',
        },
        {
            title: 'Nombre usuario',
        },
        {
            title: 'Nombre usuario',
        },
    ];  
  return (
    <div>
        <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
            <List.Item>
                <List.Item.Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={<a href="https://ant.design">{item.title}</a>}
                />
            </List.Item>
            )}
        />
    </div>
  )
}

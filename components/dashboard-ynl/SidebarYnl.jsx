import {React, useEffect, useState} from 'react'
import {Avatar, Radio, Space,List} from 'antd'

export const SidebarYnl = () => {
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
    const [value, setValue] = useState(1);
    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };
  return (
    <div className='container-menu'>
        <div className='flex-item'>
            <div>
                <Avatar
                    size={{
                    xs: 100,
                    sm: 100,
                    md: 100,
                    lg: 100,
                    xl: 100,
                    xxl: 100,
                    }}
                    src="../../public/images/Recurso3.png"
                    style={{marginBottom:16}}
                />
                <div className='data-subtitle'>
                    <h2 className='subtitles'><b>Martes</b></h2>
                    <h2 className='subtitles'><b>06/Sep/22</b></h2>
                </div> 
            </div>
        </div>
        <hr />
        <div className='flex-item aligned-to-left subtitles'>
            <div>
                <h3 className='subtitles'><b>Filtrar por:</b></h3>
                <Radio.Group onChange={onChange} value={value}>
                    <Space direction="vertical">
                        <Radio value={1}>Departamento</Radio>
                        <Radio value={2}>Por puesto</Radio>
                        <Radio value={3}>Por grupo</Radio>
                        <Radio value={4}>Todos</Radio>
                    </Space>
                </Radio.Group>
            </div>
        </div>
        <hr />
        <div className='flex-item'>
            <div>
                <h3 className='aligned-to-left subtitles'><b>Top personas:</b></h3>
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
        </div>
        <hr />
        <div className='flex-item'>
            <div>
                <h3 className='aligned-to-left subtitles'><b>Personas más activas:</b></h3>
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
        </div>
    </div>
  )
}

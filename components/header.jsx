import { Layout, Menu, Avatar } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';

const { Header} = Layout;

export default function HeaderCustom()  {
    return (
        <>  
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <div className="logo" />           
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                <AppstoreOutlined style={{ fontSize: '26px', color: '#08c' }}/>
                <Menu.Item key="1" disabled='true'>nav 1</Menu.Item>
                <Menu.Item key="2" disabled='true'>nav 2</Menu.Item>
                <Menu.Item key="3" disabled='true'>nav 3</Menu.Item>
                <div  style={{float: 'right'}}>
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />                        
                </div>
            </Menu>                    
            </Header>
        </>
    )
}
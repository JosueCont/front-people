import React from 'react';
import { List } from 'antd';
import MyModal from '../../../common/MyModal';

const ViewContacts = ({
    title = 'Listado de contactos',
    close = () => {},
    visible = false,
    itemContact = {}
}) => {
    
    const getProperties = (item) =>{
        let name = item.name ?? 'N/A';
        let position = item.job_position ?? 'N/A';
        let email = item.email ?? 'N/A';
        let phone = item.phone ?? 'N/A';
        let title = `${name} - ${position}`;
        let description = `${email} - ${phone}`;
        return { title, description };
    }

    return (
        <MyModal
            title={title}
            visible={visible}
            close={close}
            widthModal={400}
        >
            <div className='elements_delete scroll-bar'>
                <List
                    size='small'
                    itemLayout='horizontal'
                    dataSource={itemContact?.contact_list}
                    renderItem={(item, index) =>(
                        <List.Item key={index}>
                            <List.Item.Meta {...getProperties(item)}/>
                        </List.Item>
                    )}
                />
            </div>
        </MyModal>
    )
}

export default ViewContacts
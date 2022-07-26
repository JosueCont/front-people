import React, {useState, useEffect} from 'react';
import MyModal from '../../../common/MyModal';
import { Row, Col, Button, List, Avatar, Input} from 'antd';
import {
    getFullName,
    getPhoto,
    getWork,
    valueToFilter
} from '../../../utils/functions';
import {
    CloseOutlined,
    UserOutlined,
    ProfileOutlined
} from "@ant-design/icons";

const ViewList = ({
    visible,
    close,
    actionDelete,
    isUsers,
    listData,
    setListData,
    ...props
}) => {

    const [nameItem, setNameItem] = useState('');
    const [listItems, setListItems] = useState([]);

    useEffect(()=>{
        if(listData.length > 0) setListItems(listData);
    },[listData])

    const getProperties = (item) =>{
        return isUsers ? {
            avatar: <Avatar src={getPhoto(item)}/>,
            title: getFullName(item),
            description: getWork(item)
        } : {
            title: item.name
        };

    }

    const deleteItem = (index) =>{
        let list = [...listData];
        list.splice(index,1);
        setListData(list)
    }

    const onSearchItem = ({target}) =>{
        setNameItem(target.value)
        if((target.value).trim()){
            let stringVal = valueToFilter(target.value);
            let result = isUsers ? filtersUser(stringVal) : filtersCompetence(stringVal);
            setListItems(result)
        }else{
            setListItems(listData)
        }
    }
    
    const filtersUser = (stringVal) =>{
        return listData.filter(item => 
            valueToFilter(item.first_name).includes(stringVal) ||
            valueToFilter(item.email).includes(stringVal) ||
            valueToFilter(item.flast_name).includes(stringVal) ||
            valueToFilter(item.mlast_name).includes(stringVal)
        )
    }

    const filtersCompetence = (stringVal) =>{
        return listData.filter(item => valueToFilter(item.name).includes(stringVal))
    }

    return (
        <MyModal
            visible={visible}
            close={close}
            title={isUsers ? 'Listado de usuarios' : 'Listado de perfiles'}
            widthModal={400}
        >
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <div className='content_inputs_element'>
                        <p>
                            {isUsers
                                ? <span>Buscar usuario</span>
                                : <span>Buscar perfil</span>
                            }
                        </p>
                        <Input
                            placeholder={
                                isUsers
                                    ? 'Ingresa nombre(s), apellido(s) o correo'
                                    : 'Ingrese un nombre'
                            }
                            onChange={onSearchItem}
                            value={nameItem}
                        />
                    </div>
                </Col>
                <Col span={24} className='elements_delete scroll-bar'>
                    <List
                        size='small'
                        itemLayout='horizontal'
                        dataSource={listItems}
                        renderItem={(item, index) =>(
                            <List.Item 
                                key={item.id}
                                actions={[<CloseOutlined onClick={()=> deleteItem(index)}/>]}
                            >
                                <List.Item.Meta {...getProperties(item)}/>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </MyModal>
  )
}

export default ViewList;
import React, { useState, useEffect } from 'react';
import { Table, Button, Menu, Dropdown } from 'antd';
import {
    ClearOutlined,
    SearchOutlined,
    FileTextOutlined,
    PlusCircleOutlined,
    CloseOutlined,
    EllipsisOutlined,
    DeleteOutlined,
    SyncOutlined,
    EditOutlined,
    EyeOutlined,
    EyeInvisibleOutlined
  } from "@ant-design/icons";

export const useClients = () =>{

    const [openModal, setOpenModal] = useState(false);
    const [itemSelected, setItemSelected] = useState({});

    const data = [
        {
            "id": "1",
            "name": "Customer Demo",
            "description": "Descripcion demo",
            "sector": "98402d82dda14d65bc9c0f7f37c916ed",
            "website": "https://grupohuman.people.hiumanlab.com/",
            "contact_name": "Demo contact",
            "job_contact": "Líder de atracción de Talento",
            "email_contact": "demo@hiumanlab.com",
            "phone_contact": "1234567899",
            "business_name": "Demo razon social",
            "comments": "",
            "auto_register": false,
            "registered_by": ""
        },
        {
            "id": "2",
            "name": "Customer Demo",
            "description": "Descripcion demo",
            "sector": "98402d82dda14d65bc9c0f7f37c916ed",
            "website": "https://grupohuman.people.hiumanlab.com/",
            "contact_name": "Demo contact",
            "job_contact": "Líder de atracción de Talento",
            "email_contact": "demo@hiumanlab.com",
            "phone_contact": "1234567899",
            "business_name": "Demo razon social",
            "comments": "",
            "auto_register": false,
            "registered_by": ""
        },
        {
            "id": "3",
            "name": "Customer Demo",
            "description": "Descripcion demo",
            "sector": "98402d82dda14d65bc9c0f7f37c916ed",
            "website": "https://grupohuman.people.hiumanlab.com/",
            "contact_name": "Demo contact",
            "job_contact": "Líder de atracción de Talento",
            "email_contact": "demo@hiumanlab.com",
            "phone_contact": "1234567899",
            "business_name": "Demo razon social",
            "comments": "",
            "auto_register": false,
            "registered_by": ""
        },
        {
            "id": "4",
            "name": "Customer Demo",
            "description": "Descripcion demo",
            "sector": "98402d82dda14d65bc9c0f7f37c916ed",
            "website": "https://grupohuman.people.hiumanlab.com/",
            "contact_name": "Demo contact",
            "job_contact": "Líder de atracción de Talento",
            "email_contact": "demo@hiumanlab.com",
            "phone_contact": "1234567899",
            "business_name": "Demo razon social",
            "comments": "",
            "auto_register": false,
            "registered_by": ""
        }
    ]

    const actionForm = (values) =>{
        console.log('los values------->', values)
    }

    const openModalEdit = (item)=>{

    }

    const menuTable = () => {
        return (
            <Menu>
                <Menu.Item
                    key={1}
                    icon={<DeleteOutlined/>}
                    // onClick={()=>viewModalManyDelete()}
                >
                    Eliminar
                </Menu.Item>
            </Menu>
        );
    };

    const menuItem = (item) => {
        return (
            <Menu>
                <Menu.Item
                    key={1}
                    icon={<EditOutlined/>}
                    // onClick={()=> viewModalEdit(item)}
                >
                    Editar
                </Menu.Item>
                <Menu.Item
                    key={2}
                    icon={<DeleteOutlined/>}
                    // onClick={()=> viewModalDelete(item)}
                >
                    Eliminar
                </Menu.Item>
            </Menu>
        );
    };

    const columns = [
        {
            title: 'Nombre',
            render: ({name})=>{
                return(
                    <span>{name}</span>
                )
            }
        },
        {
            title: 'Contacto',
            render: ({job_contact}) =>{
                return(
                    <span>{job_contact}</span>
                )
            }
        },
        {
            title: 'Correo',
            render: ({email_contact}) =>{
                return (
                    <span>{email_contact}</span>
                )
            }
        },
        {
            title: 'Teléfono',
            render: ({phone_contact})=>{
                return (
                    <span>{phone_contact}</span>
                )
            }
        },
        {
            title: ()=> {
                return(
                    <Dropdown overlay={menuTable}>
                        <Button size={'small'}>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            },
            render: (item) =>{
                return (
                    <Dropdown overlay={()=> menuItem(item)}>
                        <Button size={'small'}>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>
                )
            }
        }
    ]

    return {
        columns,
        data,
        openModal,
        setOpenModal,
        actionForm,
        itemSelected
    }
}
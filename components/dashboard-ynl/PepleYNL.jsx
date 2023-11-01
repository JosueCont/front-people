import React,{useState,useEffect} from "react";
import moment from 'moment/moment';
import {Card, Badge, Col, Row, Table, Avatar, Typography} from 'antd'
import { useSelector, useDispatch } from "react-redux";
import { getPhoto } from "../../utils/functions";
import { getListPeopleYNL } from "../../redux/ynlDuck";
const {Text} = Typography;

const LisPeopleYNL = ({page, }) => {
    const dispatch = useDispatch();
    const people = useSelector(state => state?.ynlStore.people)
    const loader = useSelector(state => state?.ynlStore.loadPeople)

    useEffect(() => {

    },[])

    const columns = [
        {
            title: 'Foto',
            show: true,
            dataIndex:'avatar',
            render: (item) => (
                <Avatar size='small' src={getPhoto(item, '/images/profile-sq.jpg')} />
            )
        },
        //{
        //    title: 'No. empleado',
        //    dataIndex:'id',
        //    render: item => <Text>{item}</Text>,
        //    show: true,
        //},
        {
            title: 'Nombres',
            dataIndex:'firstName',
            render: item => <Text>{item}</Text>,
            show: true
        },
        {
            title: 'Apellidos',
            dataIndex:'lastName',
            render: item => <Text>{item}</Text>,
            show: true
        },
        {
            title:'Genero',
            dataIndex:'gender',
            render: item => <Text>{getGetnder(item)}</Text>
        },
        {
            title: 'Correo',
            dataIndex: 'email',
            show: true,
            render: (item) => <Text>{item}</Text>
        },
       
    ];

    const genders = ['Femenino', 'Masculino', 'Prefiero no decir', 'No indicado']

    const getGetnder = (gender) => {
        return genders[gender]
    }

    const onChangePage = (page) => {
        let dataSend = {
            "page": page,
            "pageSize": people?.data?.per_page
        }
        dispatch(getListPeopleYNL(dataSend) )
    }

    return(
        <>
            <Table
                rowKey='id'
                size='small'
                dataSource={people?.data?.users}
                columns={columns}
                loading={loader}
                //rowSelection={rowSelection}
                //onChange={(data) => onChangePage(data)}
                className='ant-table-colla'
                pagination={{
                    total: people?.data?.total,
                    pageSizeOptions: [20, 50, 100],
                    pageSize: people?.data?.per_page,
                    current: people?.data?.page,
                    onChange:(data) => {
                        onChangePage(data)
                    },
                    showSizeChanger: true,
                    
                }}
            />
        </>
    )
}

export default LisPeopleYNL;
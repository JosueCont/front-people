import React,{useState,useEffect} from "react";
import moment from 'moment/moment';
import {Card, Badge, Col, Row, Table, Avatar, Typography, Input} from 'antd'
import { useSelector, useDispatch } from "react-redux";
import { getPhoto } from "../../utils/functions";
import { getListPeopleYNL } from "../../redux/ynlDuck";
import { FaUser, FaSearch, FaCircleNotch } from "react-icons/fa";
import { SearchOutlined } from '@ant-design/icons';
const {Text} = Typography;

const LisPeopleYNL = ({page, setReload}) => {
    const dispatch = useDispatch();
    const people = useSelector(state => state?.ynlStore.people)
    const loader = useSelector(state => state?.ynlStore.loadPeople)
    const [valueSearch, setValueSearch] = useState('')

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
            "pageSize": people?.data?.per_page,
            "filter": ''
        }
        dispatch(getListPeopleYNL(dataSend))
    }

    const onGeneralSearch = () => {
        console.log('search', valueSearch)
        let dataSend = {
            "page": page,
            "pageSize": people?.data?.per_page,
            "filter": valueSearch
        }
        dispatch(getListPeopleYNL(dataSend))
    }

    const onCleanSearch = () => {
        setValueSearch('')
        setReload()
    }

    return(
        <>
            <Card bodyStyle={{ padding: 12 }}>
                <Row gutter={[8, 8]}>
                    <Col style={{display:'flex',flexDirection:'column'}}>
                        <Text strong style={{fontSize:20}}>Filtros</Text>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <Text style={{display:'flex',alignSelf:'center', marginRight:10}}>Personas: </Text>
                            <Input
                                allowClear
                                //className='input-jb-clear'
                                placeholder='Búsqueda nombre, apellidos,correo'
                                value={valueSearch}
                                //disabled={valueSearch === ''}
                                onChange={(e) => setValueSearch(e.target.value)}
                                //onPressEnter={onGeneralSearch}
                                style={{
                                    width: 'calc(100% - 32px)',
                                    borderTopLeftRadius: '10px',
                                    borderBottomLeftRadius: '10px'
                                }}
                            />
                            <button
                                className='ant-btn-simple'
                                disabled={valueSearch === ''}
                                onClick={() => onGeneralSearch()}
                                style={{
                                    borderTopRightRadius: '10px',
                                    borderBottomRightRadius: '10px',
                                    backgroundColor:valueSearch === '' ? 'gray' : 'black',
                                    marginLeft:20
                                    
                                }}
                            >
                                <FaSearch size={15} color="white" />
                            </button>
                            <button
                                className='ant-btn-simple'
                                //disabled={valueSearch === ''}
                                onClick={onCleanSearch}
                                style={{
                                    borderTopRightRadius: '10px',
                                    borderBottomRightRadius: '10px',
                                    backgroundColor: 'black',
                                    marginLeft:5
                                    
                                }}
                            >
                                <FaCircleNotch size={15} color="white" />
                            </button>
                        </div>
                    </Col>
                </Row>
            </Card>
            <Row style={{marginBottom:20, marginTop:20, marginLeft:10}}>
                <FaUser size={20} color="black" style={{display:'flex', alignSelf:'center',marginRight:10}}/>
                <Text strong>{people?.totalUsers} Resultados</Text>
            </Row>
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
                    //pageSizeOptions: [20, 50, 100],
                    pageSize: people?.data?.per_page,
                    current: people?.data?.page,
                    onChange:(data) => {
                        onChangePage(data)
                    },
                    showSizeChanger: false,
                    
                }}
            />
        </>
    )
}

export default LisPeopleYNL;
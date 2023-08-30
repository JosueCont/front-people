import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import moment from "moment";
import {Table, Typography, Row, Col} from "antd";
import {movementsTypes} from "../../../utils/constant";

const { Title } = Typography;


const TableMovements=({movementType,title=null,...props})=>{
    const [movementsKeys, setMovementsKeys] = useState([]);
    const [data, setData] = useState([]);
    const movementsImss = useSelector(state => state.payrollStore.imss_movements);
    const loading = useSelector(state => state.payrollStore.loading);


    useEffect(()=>{
        if(movementsImss){
            let elementos = movementsImss.filter((ele)=> ele.movement_type === movementType)
            setData(elementos)
        }
    },[movementsImss])



    const rowSelection = {
        selectedRowKeys:movementsKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            console.log( selectedRowKeys, selectedRows)
            setMovementsKeys(selectedRowKeys)
            props.onSelectRow(selectedRowKeys)
        },
    };


    const columns = [
        {
            title: 'Colaborador',
            key:'person',
            render:(ele)=>{
                return <p>{ele.person ? `${ele?.person?.first_name} ${ele?.person?.flast_name ? ele?.person?.flast_name : ''}` : '--'}  </p>
            }

        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key:'dataIndex'
        },
        {
            title: 'Tipo',
            dataIndex: 'movement_type',
            key:'movement_type',
            render:data=><p>{movementsTypes[data]}</p>
        },
        {
            title: 'Estatus',
            dataIndex: 'status',
            key:'status',
            render: status => <p>{status === 1 ? "Por procesar" : status === 2 ? "En proceso" : status === 3 && "Procesado"}</p>
        },
        {
            title: 'Fecha',
            dataIndex: 'date',
            key:'date',
            render:data=><p>{data && moment(data).format('DD/MM/YYYY')}</p>
        },
        {
            title: 'Vigencia',
            dataIndex: 'validity_date',
            key:'validity_date',
            render:data=><p>{data && moment(data).format('DD/MM/YYYY')}</p>
        }
    ];

    return (
        <Row>
            <Col span={24}>
                {
                    title && <Title level={2}>{movementsTypes[movementType]}</Title>
                }
                <Table loading={loading} rowKey={'id'} key={movementType} rowSelection={rowSelection} columns={columns} dataSource={data} />
            </Col>

        </Row>
    )
}


export default TableMovements;
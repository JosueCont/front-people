import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Table, Row, Col, Menu, Dropdown, Button, message, Tooltip } from 'antd';
import WebApiAssessment from '../../../../api/WebApiAssessment';
import { optionsStatusApply } from '../../../../utils/constant';
import { getValueFilter } from '../../../../utils/functions';
import { 
    SearchOutlined, 
    EllipsisOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    UnorderedListOutlined,
    TeamOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useViewResults } from '../../hook/useViewResults';
import WebApiPeople from '../../../../api/WebApiPeople';

const TabKHOR = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [assignments, setAssignments] = useState([]);
    const [loadResults, setLoadResults] = useState({});
    const [infoPerson, setInfoPerson] = useState({});
    const { validateGetResults } = useViewResults({
        loadResults,
        setLoadResults,
        infoPerson
    });

    useEffect(()=>{
        if(!router.query?.person) return;
        getAssignments(router.query?.person);
        getPerson(router.query?.person);
    },[router.query?.person])

    const formatData = (data) =>{
        return data.reduce((acc, current) => {
            const some_ = item => item.code == current.code;
            if(acc.some(some_)) return acc;
            return [...acc, current];
        }, [])
    }

    const getAssignments = async (id) =>{
        try {
            setLoading(true)
            let body = {person: id};
            let response = await WebApiAssessment.getAssignListPersonal(body);
            setAssignments(formatData(response.data));
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const getPerson = async (id) =>{
        try {
            let response = await WebApiPeople.getPerson(id);
            setInfoPerson(response.data)
        } catch (e) {
            console.log(e)
        }
    }

    const columns = [
        {
            title: 'Evaluación',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Grupo',
            dataIndex: ['group', 'name'],
            key: ['group', 'name']
        },
        {
            title: 'Estatus',
            render: (item) =>{
                if(item.applys?.length <= 0) return 'Pendiente';
                return getValueFilter({
                    value: `${item.applys[0]?.status}`,
                    list: optionsStatusApply,
                    keyShow: 'label',
                    keyEquals: 'value'
                })
            }
        },
        {
            title: "Progreso",
            render: (item) =>{
                if(item.applys?.length <= 0) return null;
                let progress = `${item.applys[0]?.progress}`;
                return progress ? `${progress}%`  : null;
            }
        },
        {
            title: 'Acciones',
            width: 100,
            render: (item) =>{
                return item?.applys[0]?.status == 2 ? (
                    <Tooltip title='Ver resultados'>
                        <Button
                            size='small'
                            loading={loadResults[item?.code]}
                            onClick={()=> validateGetResults(item)}
                        >
                            <EyeOutlined/>
                        </Button>
                    </Tooltip>
                ) : <></>;
            }
        }
    ]

    return (
        <Row gutter={[0,24]}>
            <Col span={24}>
                <Table
                    rowKey='id'
                    size='small'
                    className='table-custom'
                    columns={columns}
                    loading={loading}
                    dataSource={assignments}
                    pagination={{
                        hideOnSinglePage: true,
                        showSizeChanger: false,
                    }}
                />
            </Col>
        </Row>
    )
}

export default TabKHOR
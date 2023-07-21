import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, Row, Col, Form } from 'antd';
import FormReport from './FormReport';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import WebApiAssessment from '../../../api/WebApiAssessment';

const TabsReport = () => {

    const columns_many = [
        {
            title: 'Persona',
            dataIndex: ['persons','fullName'],
            key: ['persons','fullName'],
            fixed: 'left',
            width: 70,
            show: true,
            ellipsis: true,
        }
    ];

    const {
        current_node,
        general_config
    } = useSelector(state => state.userStore);

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [infoReport, setInfoReport] = useState([]);
    const [typeReport, setTypeReport] = useState('p');
    const [columnsMany, setColumnsMany] = useState(columns_many);

    const [loadGroups, setLoadGroups] = useState(false);
    const [groupsPersons, setGroupsPersons] = useState([]);

    useEffect(()=>{
        if(current_node) getGroups(current_node?.id);
    },[current_node])

    const getGroups = async (nodeId) => {
        try {
            setLoadGroups(true)
            let body = {nodeId, name: '', queryParam: '&paginate=0'};
            let response = await WebApiAssessment.getGroupsPersons(body);
            setLoadGroups(false)
            setGroupsPersons(response.data)
        } catch (e) {
            console.log(e);
            setLoadGroups(false)
            setGroupsPersons([])
        }
    }

    const onChangeTab = (e) =>{
        setTypeReport(e)
        setLoading(false)
        setInfoReport([])
        setColumnsMany(columns_many)
    }

    const reportProps = {
        infoReport,
        setInfoReport,
        loading,
        setLoading,
        typeReport,
        columnsMany,
        setColumnsMany,
        columns_many,
        loadGroups,
        groupsPersons
    }

    return (
        <Tabs type='card' onChange={onChangeTab}>
            <Tabs.TabPane key='p' tab='Persona'>
                <FormReport
                    showSelectProfile={false}
                    showTitleProfile={false}
                    {...reportProps}
                />
            </Tabs.TabPane>
            <Tabs.TabPane key='pp' tab='Persona-Perfil'>
                <FormReport
                    showChart={true}
                    showTitleProfile={true}
                    {...reportProps}
                />
            </Tabs.TabPane>
            <Tabs.TabPane key='psp' tab='Personas-Perfil'>
                <FormReport
                    multiUser={true}
                    showChartModal={true}
                    useGroups={true}
                    {...reportProps}
                />
            </Tabs.TabPane>
            <Tabs.TabPane key='pps' tab='Persona-Perfiles'>
                <FormReport
                    multiProfile={true}
                    {...reportProps}
                />
            </Tabs.TabPane>
            <Tabs.TabPane key='psc' tab='Personas-Competencias'>
                <FormReport
                    multiUser={true}
                    useGroups={true}
                    {...reportProps}
                />
            </Tabs.TabPane>
        </Tabs>
    )
}

export default TabsReport
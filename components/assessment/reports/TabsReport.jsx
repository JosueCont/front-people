import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, Row, Col, Form } from 'antd';
import FormReport from './FormReport';
import { useRouter } from 'next/router';

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
    ]
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [infoReport, setInfoReport] = useState([]);
    const [typeReport, setTypeReport] = useState('p');
    const [columnsMany, setColumnsMany] = useState(columns_many);

    const reportProps = {
        infoReport,
        setInfoReport,
        loading,
        setLoading,
        typeReport,
        columnsMany,
        setColumnsMany,
        columns_many
    }

    const onChangeTab = (e) =>{
        setTypeReport(e)
        setLoading(false)
        setInfoReport([])
        setColumnsMany(columns_many)
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
            <Tabs.TabPane key='pp' tab='Persona-Perfil' forceRender>
                <FormReport
                    showChart={true}
                    showTitleProfile={true}
                    {...reportProps}
                />
            </Tabs.TabPane>
            <Tabs.TabPane key='psp' tab='Personas-Perfil' forceRender>
                <FormReport
                    multiUser={true}
                    showChartModal={true}
                    {...reportProps}
                />
            </Tabs.TabPane>
            <Tabs.TabPane key='pps' tab='Persona-Perfiles' forceRender>
                <FormReport
                    multiProfile={true}
                    {...reportProps}
                />
            </Tabs.TabPane>
            <Tabs.TabPane key='psc' tab='Personas-Competencias' forceRender>
                <FormReport
                    multiUser={true}
                    {...reportProps}
                />
            </Tabs.TabPane>
        </Tabs>
    )
}

export default TabsReport
import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Menu, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import WebApiAssessment from '../../api/WebApiAssessment';
import { useSelector } from 'react-redux';

const OptionsExport = dynamic(()=> import('../assessment/reports/ReportPDF/OptionsExport'), {ssr: false});

const DownloadReport = ({
    person = {}
}) => {

    const {
        current_node,
        general_config
    } = useSelector(state => state.userStore);

    const columns = [
        {
            title: 'Competencia',
            dataIndex: ['competence','name'],
        },
        {
            title: 'Nivel',
            dataIndex: 'level',
        },
        {
            title: 'Descripción',
            dataIndex: 'description'
        }
    ]

    const getReport = async (callBack = ()=>{}) =>{
        const key = 'updatable';
        message.loading({content: 'Obteniendo información...', key})
        try {
            let body = {
                node_id: current_node?.id,
                user_id: person?.id,
                calculation_type: general_config?.calculation_type
            }
            let response = await WebApiAssessment.getReportCompetences(body);
            setTimeout(()=>{
                callBack(response.data)
            },1000)
        } catch (e) {
            console.log(e)
            let error = e?.response?.data?.message;
            let msg = error ? error : 'Información no obtenida';
            setTimeout(()=>{
                message.error({content: msg, key})
            },2000)
        }
    }

    const OptionsReport = ({
        generatePDF,
        generateExcel
    }) => {
    
        return (
            <Menu.Item
              key="9"
              icon={<DownloadOutlined/>}
              onClick={()=> getReport(generatePDF)}
            >
                Descargar reporte competencias
            </Menu.Item>
        )
    }

    return (
        <OptionsExport
            typeReport='p'
            infoReport={[]}
            currentUser={person}
            currentProfile={{}}
            columns={columns}
        >
            <OptionsReport/>
        </OptionsExport>
    )
}

export default DownloadReport
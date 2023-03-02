import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { message, Menu } from 'antd';
import {
    DownloadOutlined
} from "@ant-design/icons";
import { pdf } from '@react-pdf/renderer';
import ReportCandidate from './ReportCandidate';
import ReportHighDirection from './ReportHighDirection';
import WebApiJobBank from '../../../../api/WebApiJobBank';

const OptionsReport = ({candidate = {}}) => {

    const currentNode = useSelector(state => state.userStore.current_node);
    const [widthAndHeight, setWidthAndHeight] = useState({
        width: 0,
        height: 0
    })

    const image = useMemo(()=> currentNode?.image? currentNode.image : '', [currentNode]);

    useEffect(()=>{
        if(!image) return;
        const widthImage = new Image();
        widthImage.src = image
        widthImage.onload = () => {
            setWidthAndHeight({
                width: widthImage.width,
                height: widthImage.height
            })
        }
    },[image])


    const downloadPDF = (urlBlob, type) =>{
        let names = {1: 'Reporte de', 2: 'Reporte de alta dirección'};
        let nameCandidate = `${candidate.first_name} ${candidate.last_name}`;
        const link = document.createElement("a");
        link.href = urlBlob;
        link.download = `${names[type]} ${nameCandidate}`;
        link.target = "_blank";
        link.click();
        window.URL.revokeObjectURL(urlBlob);
    }


    const generatePDF = async (propsDoc, type) =>{
        const Reports = {1: ReportCandidate, 2: ReportHighDirection};
        const MyDoc = Reports[type];
        let propsPDF = {...propsDoc, infoCandidate: candidate, image, widthAndHeight};
        let resp = await pdf(<MyDoc {...propsPDF}/>).toBlob();
        return window.URL.createObjectURL(resp);
    }

    const getInfoPDF = async (type = 1) =>{
        const key = 'updatable';
        message.loading({content: 'Generando PDF...', key});
        try {
            let responseEdu = await WebApiJobBank.getCandidateEducation(candidate.id, '&paginate=0');
            let responsePos = await WebApiJobBank.getCandidateLastJob(candidate.id, '&paginate=0');
            let responseExp = type == 2 ? await WebApiJobBank.getCandidateExperience(candidate.id, '&paginate=0') : [];
            let urlBlob = await generatePDF({
                infoEducation: responseEdu.data ?? [],
                infoExperience: responseExp.data ?? [],
                infoPositions: responsePos.data ?? []
            }, type);
            setTimeout(()=>{
                message.success({content: 'PDF generado', key})
            }, 1000)
            setTimeout(()=>{  
                downloadPDF(urlBlob, type)
            },2000)
        } catch (e) {
            console.log(e)
            setTimeout(()=>{
                message.error({content: 'PDF no generado', key});
            },2000)
        }
    }

    return (
        <Menu.SubMenu
            title="Descargar reporte"
            icon={<DownloadOutlined />}
        >
            <Menu.Item
                key='4'
                onClick={()=> getInfoPDF(1)}
            >
                Reporte candidato
            </Menu.Item>
            <Menu.Item
                key='5'
                onClick={()=> getInfoPDF(2)}
            >
                Reporte alta dirección
            </Menu.Item>
        </Menu.SubMenu>
    )
}

export default OptionsReport
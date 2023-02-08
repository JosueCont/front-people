import React, { useState } from 'react';
import { Button, Tooltip, message, Dropdown, Menu } from 'antd';
import { pdf } from '@react-pdf/renderer';
import DocExpedient from './DocExpedient';
import {
    DownloadOutlined,
    EyeOutlined
} from "@ant-design/icons";

const Expedient = ({
    infoCandidate,
    infoEducation,
    infoExperience,
    infoPositions
}) => {

    const [loading, setLoading] = useState(false);

    const MyDoc = (partial) => {

        let partialEducation = []
        let partialPositions = []

        if(partial && partial.partial){

            infoEducation.sort((a, b) => {
                if (a.end_date > b.end_date) return -1;
                if (a.end_date < b.end_date) return 1;
                return 0;
              });

            infoPositions.sort((a, b) => {
                if (a.end_date > b.end_date) return -1;
                if (a.end_date < b.end_date) return 1;
                return 0;
              });

            infoEducation.forEach((edu, index) => {
                index <= 2 && partialEducation.push(edu)
            })

            infoPositions.forEach((edu, index) => {
                index <= 2 && partialPositions.push(edu)
            })
            
        }

        return (<DocExpedient
            infoCandidate={infoCandidate}
            infoEducation={ partialEducation?.length > 0 ? partialEducation : infoEducation }
            infoExperience={infoExperience}
            infoPositions={ partialPositions?.length > 0 ? partialPositions : infoPositions}
        />)
    }

    const linkTo = (url, download = false ) =>{
        let nameFile = `${infoCandidate.fisrt_name} ${infoCandidate.last_name}`;
        const link = document.createElement("a");
        link.href = url;
        link.target = "_black";
        if(download) link.download = nameFile;
        link.click();
    }

    const generatePDF = async (download, partial) =>{
        const key = 'updatable';
        message.loading({content: 'Generando PDF...', key});
        try {
            setLoading(true)
            let resp = await pdf(<MyDoc partial = {partial}/>).toBlob();
            let url = URL.createObjectURL(resp);
            setTimeout(()=>{
                setLoading(false);
                message.success({content: 'PDF generado', key})
            }, 1000)
            setTimeout(()=>{  
                linkTo(url+'#toolbar=0', download);
            },2000)
        } catch (e) {
            console.log(e)
            setTimeout(()=>{
                setLoading(false)
                message.error({content: 'PDF no generado', key});
            },2000)
        }
    }

    const menuItems = 
        <Menu>
            <Menu.Item key={1}>
                <a
                    onClick={()=> generatePDF(true, false)}
                >
                    Expediente completo
                </a>
            </Menu.Item>
            <Menu.Item key={2}>
                <a
                    onClick={()=> generatePDF(true, true)}
                >
                    Expediente resumido
                </a>
            </Menu.Item>
        </Menu>


    return (
        <>
            <Tooltip title='Visualizar expediente'>
                <Button
                    loading={loading}
                    icon={<EyeOutlined/>}
                    onClick={()=> generatePDF()}
                >
                    Expediente
                </Button>
            </Tooltip>
            <Tooltip title=''>
                {/* <Button
                    loading={loading}
                    icon={<DownloadOutlined/>}
                    onClick={()=> generatePDF(true)}
                >
                    Expediente
                </Button> */}
                <Dropdown overlay={menuItems}>
                    <Button
                    loading={loading}
                    icon={<DownloadOutlined/>}
                    // onClick={()=> generatePDF(true)}
                >
                    Descargar expediente
                </Button>
                </Dropdown>
            </Tooltip>
        </>
    )
}

export default Expedient;
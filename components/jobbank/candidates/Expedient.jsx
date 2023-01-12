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

    const MyDoc = () => <DocExpedient
        infoCandidate={infoCandidate}
        infoEducation={infoEducation}
        infoExperience={infoExperience}
        infoPositions={infoPositions}
    />;

    const linkTo = (url, download = false ) =>{
        let nameFile = `${infoCandidate.fisrt_name} ${infoCandidate.last_name}`;
        const link = document.createElement("a");
        link.href = url;
        link.target = "_black";
        if(download) link.download = nameFile;
        link.click();
    }

    const generatePDF = async (download) =>{
        const key = 'updatable';
        message.loading({content: 'Generando PDF...', key});
        try {
            setLoading(true)
            let resp = await pdf(<MyDoc/>).toBlob();
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

                    // loading={loading}
                    // icon={<DownloadOutlined/>}
                    onClick={()=> generatePDF(true)}
                >
                    Expediente completo
                </a>
            </Menu.Item>
            <Menu.Item key={2}>
                <a
                    
                    // loading={loading}
                    // icon={<DownloadOutlined/>}
                    onClick={()=> generatePDF(true)}
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
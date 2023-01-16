import React, { useState } from 'react';
import { Button, Tooltip, message, Dropdown, Menu } from 'antd';
import { pdf } from '@react-pdf/renderer';
import DocExpedient from './DocExpedient';
import {
    DownloadOutlined,
    EyeOutlined
} from "@ant-design/icons";
// import { info } from 'console';

const Expedient = ({
    infoClient,
    contactList,
}) => {

    const [loading, setLoading] = useState(false);

    const MyDoc = () => 
        <DocExpedient
            infoClient = { infoClient }
            contactList = { contactList }
        />
    

    const linkTo = (url, download = false ) =>{
        let nameFile = `${infoClient.name}`;
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
            let resp = await pdf(<MyDoc />).toBlob();
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
            <Tooltip title='Descargar expediente'>
                    <Button
                    loading={loading}
                    icon={<DownloadOutlined/>}
                    onClick={()=> generatePDF(true)}
                >
                    Descargar expediente
                </Button>
            </Tooltip>
        </>
    )
}

export default Expedient;
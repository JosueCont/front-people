import React, { useState, useEffect, useMemo } from 'react';
import { Button, Tooltip, message, Dropdown, Menu } from 'antd';
import { pdf } from '@react-pdf/renderer';
import ReportExpedient from './ReportExpedient';
import {
    DownloadOutlined,
    EyeOutlined,
    EllipsisOutlined
} from "@ant-design/icons";
import { useSelector } from 'react-redux';

const OptionsExpedient = ({
    infoCandidate,
    infoEducation,
    infoExperience,
    infoPositions
}) => {

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


    const orderBydate = (a, b) =>{
        if (a.end_date > b.end_date) return -1;
        if (a.end_date < b.end_date) return 1;
        return 0;
    }

    const MyDoc = ({partial}) => {
        let partialEducation = []
        let partialPositions = []
        if(partial && partial){
            infoEducation.sort(orderBydate);
            infoPositions.sort(orderBydate);
            partialEducation = [...infoEducation ?? []].slice(0,3);
            partialPositions = [...infoPositions ?? []].slice(0,3);
        }
        return (<ReportExpedient
            infoCandidate={infoCandidate}
            infoEducation={partialEducation?.length > 0 ? partialEducation : infoEducation}
            infoExperience={infoExperience}
            infoPositions={partialPositions?.length > 0 ? partialPositions : infoPositions}
            widthAndHeight={widthAndHeight}
            image={image}
        />)
    }

    const linkTo = (url, download = false, partial = false ) =>{
        let nameFile = `Expediente ${infoCandidate.first_name} ${infoCandidate.last_name} - ${partial ? 'resumido' : 'completo'}`;
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
            let resp = await pdf(<MyDoc partial={partial}/>).toBlob();
            let url = URL.createObjectURL(resp);
            setTimeout(()=>{
                message.success({content: 'PDF generado', key})
            }, 1000)
            setTimeout(()=>{  
                linkTo(url+'#toolbar=0', download, partial);
            },2000)
        } catch (e) {
            console.log(e)
            setTimeout(()=>{
                message.error({content: 'PDF no generado', key});
            },2000)
        }
    }

    const menuItems = (
        <Menu>
            <Menu.Item
                key='1'
                icon={<EyeOutlined/>}
                onClick={()=> generatePDF()}
            >
                Visualizar expediente
            </Menu.Item>
            <Menu.Item
                key='2'
                icon={<DownloadOutlined/>}
                onClick={()=> generatePDF(true, true)}
            >
                Descargar expediente resumido
            </Menu.Item>
            <Menu.Item
                key='3'
                icon={<DownloadOutlined/>}
                onClick={()=> generatePDF(true, false)}
            >
                Descargar expediente completo
            </Menu.Item>
        </Menu>
    )

    return (
        <Dropdown overlay={menuItems}>
            <Button>
                <EllipsisOutlined/>
            </Button>
        </Dropdown>
    )
}

export default OptionsExpedient;
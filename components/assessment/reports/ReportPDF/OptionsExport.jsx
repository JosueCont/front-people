import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Button, Dropdown, Menu, message } from 'antd';
import {
    ExportOutlined
} from '@ant-design/icons';
import { CSVLink, CSVDownload } from 'react-csv';
import { pdf } from '@react-pdf/renderer';
import { getFullName } from '../../../../utils/functions';
import ReportPDF from './ReportPDF';
import axios from 'axios';
import { generateConfig } from '../hook/useChart';

const OptionsExport = ({
    infoReport,
    disabled = false,
    currentUser,
    currentProfile,
    typeReport,
    columns,
    children
}) => {

    const csvRef = useRef({});
    const [fileName, setFileName] = useState("");
    const [csvHeaders, setCsvHeaders] = useState([]);
    const [csvData, setCsvData] = useState([]);
    const [loading, setLoading] = useState(false);
    // Estate para renderizar el pdf
    const [renderData, setRenderData] = useState([]);

    // Solo para renderizar el pdf
    // useEffect(()=>{
    //     if(infoReport.length > 0) getRenderData();
    // },[infoReport])

    // const getRenderData = async () =>{
    //     try {
    //         let resp = await getData();
    //         setRenderData(resp)
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
    // Termina solo para renderizar el pdf

    useEffect(()=>{
        setCsvHeaders([])
        setCsvData([])
        setFileName("")
    },[typeReport])

    const getName = () =>{
        let name_report = {
            'p': 'Reporte competencias',
            'pp': 'Persona - Perfil',
            'psp': 'Personas - Perfil',
            'pps': 'Persona - Perfiles',
            'psc': 'Persona - Competencias'
        }
        let name_user = Array.isArray(currentUser) ? '' : getFullName(currentUser);
        let name_profile = Array.isArray(currentProfile) ? '' : currentProfile?.name;
        let name_select = typeReport == 'pp' ? `${name_user} - ${name_profile}` : (name_user || name_profile);
        let name_file = `${name_select || 'Reporte'} (${name_report[typeReport]})`;
        return name_file.replace(/\./g,'');
    }

    const getCompatibility = (item) => typeof item.compatibility == 'string'
        ? item.compatibility : `${item.compatibility?.toFixed(2)}%`;

    const getCompetences = (profiles) =>{
        return profiles?.competences?.map((item) =>{
            let compatibility = getCompatibility(item);
            return {...item, compatibility};
        })
    }

    const transformP = async (type) =>{
        // Para reporte excel
        if(type == 2) return infoReport;
        // Para reporte pdf
        let chart_img = null;
        const some_ = item => item.level == 'N/A';
        let result = infoReport.some(some_);
        if(!result){
            let params = [{fullName: "", data: infoReport}]
            let {fullName, ...args} = generateConfig({typeReport: 'p', infoReport: params});
            chart_img = await getChart({...args, type: 'radar'});
        }
        return {chart_img, competences: infoReport}
    }

    const transformPP = async (type) =>{
        // Para reporte excel
        let profiles = infoReport?.at(-1)?.profiles?.at(-1);
        let competences = getCompetences(profiles);
        if(type == 2) return competences;
        // Para reporte pdf
        let chart_img = null;
        let compatibility = getCompatibility(profiles);
        if(compatibility !== 'N/A'){
            let {fullName, ...args} = generateConfig({typeReport: 'pp', infoReport});
            chart_img = await getChart({...args, type: 'radar'});
        }
        return {chart_img, competences};
    }

    const transformPPS = async (type) =>{
        let results = [];
        let list = [...infoReport]?.at(-1)?.profiles;
        for(const item of list){
            // Para reporte excel
            let competences = getCompetences(item);
            let compatibility = getCompatibility(item);
            if(type == 2){
                results.push({...item, compatibility, competences});
            }else{
                //Para reporte pdf
                let chart_img = null;
                if(compatibility !== 'N/A'){
                    let record = [{persons: {fullName: ""}, profiles: [item]}];
                    let report = {typeReport: 'pp', infoReport: record};
                    let {fullName, ...args} = generateConfig(report);
                    chart_img = await getChart({...args, type: 'radar'});
                }
                results.push({...item, chart_img, compatibility, competences});
            }
        }
        return results;
    }

    const transformPSP = async (type) =>{
        let results = [];
        for(const item of infoReport){
            // Para reporte excel
            let self = item.profiles?.at(-1);
            let competences = getCompetences(self)
            let compatibility = getCompatibility(self);
            let profiles = {...self, compatibility, competences};
            if(type == 2){
                results.push({...item, profiles})
            }else{
                // Para reporte pdf
                let chart_img = null;
                if(compatibility !== 'N/A'){
                    let report = {typeReport: 'pp', infoReport: [item]}
                    let {fullName, ...args} = generateConfig(report);
                    chart_img = await getChart({...args, type: 'radar'});
                }
                results.push({...item, chart_img, profiles})
            }
        }
        return results;
    }

    const getCompetencesPSC = (record) =>{
        let competences = [...record.profiles[0].competences];
        return competences.reduce((acc, current) =>{
            let item = {level_person: current.level_person, name: current.name};
            return {...acc, [current.id]: item };
        },{})
    }

    const transformPSC = () =>{
        return infoReport.reduce((acc, current) =>{
            let profile = {...current.profiles[0]};
            let compatibility = getCompatibility(profile);
            if(profile.competences) delete profile.competences;
            let profiles = {...profiles, compatibility};
            let item =  {...current, ...getCompetencesPSC(current), profiles};
            return [...acc, item];
        },[])
    }

    const getData = async (type = 1) => {
        const actions = {
            // 'p': transformP,
            'pp': transformPP,
            'psp': transformPSP,
            'pps': transformPPS,
            'psc': type == 1 ? transformPSP : transformPSC
        }
        return await actions[typeReport]
            ? actions[typeReport](type)
            : infoReport;
    }

    const getKey = (record, key) =>{
        return Array.isArray(record[key])
            ? record[key].join('.')
            : record[key];
    }

    const getColumns = () =>{
        return [...columns].reduce((acc, current) =>{
            if(!current.dataIndex && !current.nested) return acc;
            let index = current?.nested ? 'nested' : 'dataIndex';
            let key = getKey(current, index);
            let label = current.name
                ? current.name : current.title;
            return [...acc, {label, key}];
        },[]);
    }

    const getChart = async (config) =>{
        try {
            if(config?.data?.datasets?.length <=0) return null;
            let body = {config, version: '3.7.0', width: 650, height: 650};
            return await toDataURL(body);     
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    const toDataURL = async (config) =>{
        const buf = await toBinary(config);
        if(!buf) return buf;
        const b64buf = buf.toString('base64');
        return `data:image/png;base64,${b64buf}`;
    }

    const toBinary = async({config, ...args}) =>{
        try {
            let data = {...args, chart: JSON.stringify(config)};
            let body = {responseType: 'arraybuffer'};
            const resp = await axios.post('https://quickchart.io/chart', data, body);
            if (resp.status !== 200) return null;
            return Buffer.from(resp.data, 'binary');
        } catch (e) {
            console.log(e)
            return null;
        }
    }
    
    const MyDoc = ({source = []}) => (
        <ReportPDF
            infoReport={infoReport}
            currentUser={currentUser}
            currentProfile={currentProfile}
            typeReport={typeReport}
            columns={columns}
            dataSource={source}
            fileName={getName()}
        />
    )

    const download = (resp) =>{
        let url = window.URL.createObjectURL(resp);
        const link = document.createElement("a");
        link.href = url;
        link.target = "_black";
        link.download = getName();
        link.click();
        window.URL.revokeObjectURL(url);
    }

    const generatePDF = async (data) =>{
        const key = 'updatable';
        message.loading({content: 'Generando PDF...', key})
        try {
            setLoading(true)
            let source = data ? data : await getData();
            let resp = await pdf(<MyDoc source={source}/>).toBlob();
            setTimeout(()=>{
                setLoading(false)
                message.success({content: 'PDF generado', key})
            }, 1000)
            setTimeout(()=>{  
                download(resp);
            },2000)
        } catch (e) {
            console.log(e)
            setTimeout(()=>{
                setLoading(false)
                message.error({content: 'PDF no generado', key});
            },2000)
        }
    }

    const generateExcel = async ()=>{
        const key = 'updatable';
        message.loading({content: 'Generando Excel...', key})
        try {
            setLoading(true)
            setFileName(getName())
            setCsvHeaders(getColumns())
            setCsvData(await getData(2))
            setTimeout(() => {
                message.success({content: 'Excel generado', key})
                setLoading(false)
            }, 1000)
            setTimeout(()=>{
                csvRef.current?.link?.click()
            },2000)
        } catch (e) {
            console.log(e)
            setTimeout(() => {
                message.error({content: 'Excel no generado', key});
                setLoading(false)
            }, 2000) 
        }
    }

    const Options = (
        <Menu disabled={disabled} items={[
            {label: 'PDF', key: '1', onClick: ()=> generatePDF()},
            {label: 'Excel', key: '2', onClick: ()=> generateExcel()}
        ]}/>
    )

    return (
        <>
            {children ? React.cloneElement(children, {generateExcel, generatePDF, loading})
                : (
                    <Dropdown overlay={Options}>
                        <Button
                            icon={<ExportOutlined />}
                            loading={loading}
                            style={{
                                marginTop: 'auto',
                                marginBottom: 24
                            }}
                        >
                            Exportar
                        </Button>
                    </Dropdown>
                )
            }
            <CSVLink
                headers={csvHeaders}
                filename={fileName}
                data={csvData}
                ref={csvRef}
                style={{display: 'none'}}
            >
                Descargar
            </CSVLink>
            {/* Solo para renderizar el pdf */}
            {/* {infoReport.length > 0
                && currentUser
                && currentProfile
            && (
                <MyDoc source={renderData}/>
            )} */}
        </>
    )
}

export default OptionsExport
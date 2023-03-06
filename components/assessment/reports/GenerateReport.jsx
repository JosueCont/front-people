import React, { useState, useRef } from 'react';
import { Dropdown, Button, Menu, message } from 'antd';
import {
    CloseOutlined,
    UserOutlined,
    ProfileOutlined,
    EyeOutlined,
    RadarChartOutlined,
    ExportOutlined
} from '@ant-design/icons';
import { CSVLink } from "react-csv";
import PDFReport from './PDFReport';
import { pdf } from '@react-pdf/renderer';

const GenerateReport = ({
    currentTab,
    getColumns =()=>{},
    getDataReport =()=>{},
    usersSelected = [],
    profilesSelected = [],
    csvHeaders = [],
    setCsvHeaders,
    csvDataSource = [],
    setCsvDataSource,
    nameFile = '',
    setNameFile,
    listReports = []
}) => {

    const [loadingExport, setLoadingExport] = useState(false);
    const csvLink = useRef();

    const reportP = (columns, rowReaders) =>{
        let nameFile = usersSelected.length > 0 ? 
            `Persona - ${usersSelected[0].first_name} ${usersSelected[0].flast_name}.csv`
            : 'Demo.csv'
        setNameFile(nameFile)
        columns.forEach((col) => {
            if(col.title === 'Competencia'){
                rowReaders.push({
                    label: col.title,
                    key: 'competence.name'
                })
            }
            if(col.title === 'Nivel'){
                rowReaders.push({
                    label: col.title,
                    key: 'level'
                })
            }
            if(col.title === 'Descripción'){
                rowReaders.push({
                    label: col.title,
                    key: 'description'
                })
            }
        })
    }

    const reportPP = (columns, rowReaders) =>{
        let nameFile = usersSelected.length > 0 ? 
            `Persona Perfil - ${usersSelected[0].first_name} ${usersSelected[0].flast_name} - ${profilesSelected[0].name}.csv`
            : 'Demo.csv'
        setNameFile(nameFile)
                
        columns.forEach((col) => {
            if(col.title === 'Competencia'){
                rowReaders.push({
                    label: col.title,
                    key: 'name'
                })
            }
            if(col.title === 'Nivel persona'){
                rowReaders.push({
                    label: col.title,
                    key: 'level_person'
                })
            }
            if(col.key === 'description_person'){
                rowReaders.push({
                    label: col.title,
                    key: 'description_person'
                })
            }
            if(col.title === 'Nivel perfil'){
                rowReaders.push({
                    label: col.title,
                    key: 'level_profile'
                })
            }
            if(col.key === 'description_profile'){
                rowReaders.push({
                    label: col.title,
                    key: 'description_profile'
                })
            }
            if(col.title === 'Compatibilidad'){
                rowReaders.push({
                    label: col.title,
                    key: 'compatibility'
                })
            }
        })
    }

    const reportPSP = (columns, rowReaders, data) =>{
        let nameFile = profilesSelected.length > 0 ? `Personas Perfil - ${profilesSelected[0].name}.csv` : 'Demo.csv'
        setNameFile(nameFile)
        columns.forEach((col) => {
            if(col.title === 'Persona'){
                rowReaders.push({
                    label: col.title,
                    key: 'fullname'
                })
            }
            if(col.title === 'Compatibilidad'){
                rowReaders.push({
                    label: col.title,
                    key: 'compatibility'
                })
            }
        })
        let newData = data.map((row) => {
            let num = `${row.profiles[0]?.compatibility}`;
            return {
                fullname: row.persons.fullName,
                compatibility: num ? parseFloat(num).toFixed(2) : num
            }
        })
        setCsvDataSource(newData)
    }

    const reportPPS = (columns, rowReaders) =>{
        let nameFile = usersSelected.length > 0 ? 
            `Persona Perfiles - ${usersSelected[0].first_name} ${usersSelected[0].flast_name}.csv`
            : 'Demo.csv'
        setNameFile(nameFile)
        columns.forEach((col) => {
            if(col.title === 'Perfil'){
                rowReaders.push({
                    label: col.title,
                    key: 'name'
                })
            }
            if(col.title === 'Compatibilidad'){
                rowReaders.push({
                    label: col.title,
                    key: 'compatibility'
                })
            }
        })
    }

    const reportPSC = (rowReaders, data) =>{
        let nameFile = profilesSelected.length > 0 ? `Personas competencias - ${profilesSelected[0].name}.csv` : 'Demo.csv'
        setNameFile(nameFile)
        let newDatasource = [];

        rowReaders.push({
            label: 'Persona',
            key: 'fullname'
        })

        data?.length > 0  && data[0].profiles[0].competences.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        }).forEach((com) => {
            let exist = rowReaders.find((row) => row.key == com.name.substring(0,3).toUpperCase())
            if(exist) {
                rowReaders.push({
                    label: com.name.substring(0,4).toUpperCase() + ` (${com.level_profile})`,
                    key: com.name.substring(0,4).toUpperCase()
                })
            } else {
                rowReaders.push({
                    label: com.name.substring(0,3).toUpperCase() + ` (${com.level_profile})`,
                    key: com.name.substring(0,3).toUpperCase()
                })
            }

        })

        rowReaders.push({
            label: 'Compatibilidad',
            key: 'compatibility'
        })

        data.map((row) => {
            
            let object = {}
            let numPercent = row.profiles[0]?.compatibility;
            object['fullname'] = row.persons.fullName;
            object['compatibility'] = numPercent ? parseFloat(numPercent).toFixed(2) : numPercent;
            let recuArray = row.profiles[0].competences

            recuArray.sort((a, b) => {
                if (a.name > b.name) return 1;
                if (a.name < b.name) return -1;
                return 0;
            })

            let recuArrayV2 = recuArray.reduce((acc, current, index) => {
                let nameCom = acc[current.name.substring(0,3).toUpperCase()] !== undefined
                    ? current.name.substring(0,4).toUpperCase()
                    : current.name.substring(0,3).toUpperCase()
                return{...acc, [nameCom] : current.level_person}
            }, object)

            newDatasource.push(recuArrayV2)
        })
        
        setCsvDataSource(newDatasource)
        let nameCol = rowReaders.find((record) => record.key === 'fullname')
        let nameComp = rowReaders.find((record) => record.key === 'compatibility')
        let unOrderedColumns = rowReaders.filter((reg) => reg.key !== 'fullname' && reg.key !== 'compatibility')
        let orderedColumns = unOrderedColumns.sort((a, b) => {
            if (a.key > b.key) return 1;
            if (a.key < b.key) return -1;
            return 0;
        })
        let arr = []
        arr.push(nameCol)
        let newArr = [...arr, ...orderedColumns]
        newArr.push(nameComp)
        setCsvHeaders(newArr)
    }

    const generateExcelReport = () => {
        if(listReports?.length <=0){
            message.error('Generar el reporte');
            return;
        }
        setLoadingExport(true)
        const key = 'updatable';
        let columns = getColumns();
        let data = getDataReport();
        let rowReaders = [];
        message.loading({content: 'Generando Excel...', key})
        try {
            if(currentTab == 'p'){
                reportP(columns, rowReaders)
                setCsvDataSource(data)
            }
            if(currentTab == 'pp'){
                reportPP(columns, rowReaders)
                setCsvDataSource(data)
            }
            if(currentTab == 'psp'){
                reportPSP(columns, rowReaders, data)
            }
            if(currentTab == 'pps'){
                reportPPS(columns, rowReaders)
                setCsvDataSource(data)
            }
            if(currentTab == 'psc'){
                reportPSC(rowReaders, data);
            }
            if(currentTab !== 'psc') setCsvHeaders(rowReaders)

            setTimeout(() => {
                message.success({content: 'Excel generado', key})
                setLoadingExport(false)
            }, 1000) 
            setTimeout(()=>{
                csvLink.current.link.click()
            },2000)
        } catch (e) {
            console.log(e)
            setTimeout(() => {
                message.error({content: 'Excel no generado', key});
                setLoadingExport(false)
            }, 2000) 
        }
    }

    const linkTo = (url) =>{
        let nameFile = ''
        if(currentTab === 'p'){
            nameFile = usersSelected.length > 0 ? 
            `Persona - ${usersSelected[0].first_name} ${usersSelected[0].flast_name}`
           : 'Demo';
        }
        if(currentTab === 'pp'){
            nameFile = usersSelected.length > 0 ? 
                `Persona Perfil - ${usersSelected[0].first_name} ${usersSelected[0].flast_name} - ${profilesSelected[0].name}`
                : 'Demo'
        }
        if(currentTab === 'psp'){
            nameFile = profilesSelected.length > 0
                ? `Personas Perfil - ${profilesSelected[0].name}` : 'Demo'
        }
        if(currentTab === 'pps'){
            nameFile = usersSelected.length > 0 ? 
                `Persona Perfiles - ${usersSelected[0].first_name} ${usersSelected[0].flast_name}`
                : 'Demo'
        }
        const link = document.createElement("a");
        link.href = url;
        link.target = "_black";
        link.download = nameFile;
        link.click();
        window.URL.revokeObjectURL(url);
    }

    const generatePDF = async () => {
        if(listReports?.length <=0){
            message.error('Generar el reporte');
            return;
        }
        const key = 'updatable';
        let columns = getColumns();
        let data = getDataReport();
        setLoadingExport(true)
        message.loading({content: 'Generando PDF...', key})
        try {
            let resp = await pdf(<PDFReport
                user={usersSelected}
                currentTab={currentTab}
                columns={columns}
                data={data}
                profilesSelected={profilesSelected}
                listReports={listReports}
            />).toBlob();
            let url = window.URL.createObjectURL(resp);
            setTimeout(()=>{
                setLoadingExport(false)
                message.success({content: 'PDF generado', key})
            }, 1000)
            setTimeout(()=>{  
                linkTo(url);
            },2000)
        } catch (e) {
            console.log(e)
            setTimeout(()=>{
                setLoadingExport(false)
                message.error({content: 'PDF no generado', key});
            },2000)
        }
    }


    const items = [
        {
            label: 'Excel',
            key: 1,
            onClick: () => generateExcelReport()
        },
        {
            label: 'PDF',
            key: 2,
            onClick: () => generatePDF()
        }

    ]

    const menuDropdown = (
        <Menu items={currentTab !== 'psc'? items : items.filter(e=>e.label=='Excel')} />
    )

    return (
        <>
            <Dropdown overlay={menuDropdown}>
                <Button
                    icon={<ExportOutlined />}
                    loading={loadingExport}
                >
                    Exportar a
                </Button>
            </Dropdown>
            <CSVLink
                headers={csvHeaders}
                filename={nameFile}
                data={csvDataSource}
                ref={csvLink}
                style={{display: 'none'}}
            >
                Descargar
            </CSVLink>
        </>
    )
}

export default GenerateReport
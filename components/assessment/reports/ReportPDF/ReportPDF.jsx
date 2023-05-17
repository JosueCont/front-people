import React, { useEffect, useMemo } from 'react';
import {
    PDFViewer,
    Document,
    Page,
    StyleSheet,
    View,
    Image
} from '@react-pdf/renderer';
import ReportHeader from './ReportHeader';
import GetReport from './GetReport';
import { getFullName, getWork } from '../../../../utils/functions';

const styles = StyleSheet.create({
    content: {
        display: 'flex',
        flexDirection: 'column',
        padding: 24
    },
    body:{
        paddingTop: 16,
        // display: 'flex',
        // flexDirection: 'column',
        // gap: 16
    },
    viewer: {
        width: '100%',
        minHeight: '100vh'
    }
})

const ReportPDF = ({
    infoReport,
    currentUser,
    currentProfile,
    typeReport = 'p',
    columns = [],
    dataSource = [] || {},
    fileName = ""
}) => {


    const columns_ = useMemo(() =>{
        if(!['p','pp'].includes(typeReport)) return [];
        return [...columns].reduce((acc, current) =>{
            if(!current.dataIndex && !current.nested) return acc;            
            let key = current.nested ? current.nested : current.dataIndex;
            let label = current.name ? current.name : current.title;
            return [...acc, {label, key}];
        },[]);
    },[columns])

    const getCompatibility = (item) =>{
        let num = item?.profiles?.at(-1)?.compatibility;
        if([undefined,null,""].includes(num)) return 'Pendiente';
        let percent = typeof num == "string" ? num : `${num?.toFixed(2)}%`;
        return `Compatibilidad: ${percent}`;
    }

    const getPhoto = () => {
        return currentUser?.photo_thumbnail
            ? currentUser?.photo_thumbnail
            : currentUser?.photo
            ? currentUser?.photo
            : null;
    }

    const propsHeader = useMemo(()=>{
        return {
            showPhoto: !['psp','psc'].includes(typeReport),
            photo: !Array.isArray(currentUser) ? getPhoto() : null,
            name: !Array.isArray(currentUser)
                ? getFullName(currentUser) : currentProfile?.name,
            description: !Array.isArray(currentUser)
                ?  getWork(currentUser)  : currentProfile?.description,
            title: typeReport == 'pp' ? currentProfile?.name : null,
            info: typeReport == 'pp' ? getCompatibility(infoReport?.at(-1)) : null
        }
    },[
        currentUser,
        currentProfile,
        infoReport,
        typeReport
    ])

    return (
        // <PDFViewer showToolbar={false} style={styles.viewer}>
            <Document title={fileName}>
                <Page
                    size='LETTER'
                    orientation={typeReport == 'pp' ? 'landscape' : 'portrait'}
                    style={styles.content} wrap={true}
                >
                    <ReportHeader {...propsHeader}/>
                    <View style={styles.body}>
                        <GetReport
                            typeReport={typeReport}
                            columns={columns_}
                            dataSource={dataSource}
                        />
                    </View>
                </Page>
            </Document>
        // </PDFViewer>
    )
}

export default ReportPDF
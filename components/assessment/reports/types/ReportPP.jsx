import React, {useEffect, useMemo} from 'react';
import {
    PDFViewer,
    Document,
    Page,
    StyleSheet,
    View,
    Text,
    Image
} from '@react-pdf/renderer';
import { Table } from '../ReportPDF/ReportUtils';

const styles = StyleSheet.create({
    content_img: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        maxHeight: 400
    }
})

const ReportPP = ({
    columns,
    dataSource,
    imgChart
}) => {
    
    const columns_ = useMemo(()=>{
        let width = {0: '15%', 1: '10%', 2: '28%', 3: '9%', 4: '28%', 5: '10%'};
        return columns?.map((item, idx) =>{
            return {...item, width: width[idx]}
        })
    },[columns])

    return (
        <>
            <Table
                columns={columns_}
                data={dataSource?.competences}
            />
            {dataSource?.chart_img && (
                <View style={styles.content_img}>
                    <Image src={dataSource?.chart_img}/>
                </View>
            )}
        </>
    )
}

export default ReportPP
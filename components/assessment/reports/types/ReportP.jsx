import React, {useEffect, useMemo} from 'react';
import {
    PDFViewer,
    Document,
    Page,
    StyleSheet,
    View,
    Text
} from '@react-pdf/renderer';
import { Table } from '../ReportPDF/ReportUtils';

const ReportP = ({
    columns,
    dataSource
}) =>{

    const columns_ = useMemo(()=>{
        let width = {0: '20%', 1: '10%', 2: '70%'};
        return columns.map((item, idx) =>{
            return {...item, width: width[idx]}   
        })
    },[columns])

    return(
        <Table
            columns={columns_}
            data={dataSource}
        />
    )
}

export default ReportP;
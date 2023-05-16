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
import _ from 'lodash';

const ReportPSC = ({
    columns,
    dataSource
}) => {

    const getCompetences = (record) =>{
        let competences = [...record.profiles[0].competences];
        return competences.reduce((acc, current) =>{
            let item = {level_person: current.level_person, name: current.name};
            return {...acc, [current.id]: item };
        },{})
    }

    const getCompatibility = (item) => typeof item.compatibility == 'string'
        ? item.compatibility : `${item.compatibility.toFixed(2)}%`;

    const columns_ = useMemo(()=>{
        if(columns?.length <=1) return [];
        let list = [...columns];
        let last = [...list.slice(-1)];
        let first = [...list.slice(0,1)]
        let rest = [...list.slice(1, -1)];
        if(rest.length <= 5) return [list];
        return _.chunk(rest, Math.ceil(rest.length/5)).map(item =>{
            return [first[0], ...item, last[0]]
        });
    },[columns])

    return (
       <>{columns_.map((col, idx) => (
            <Table key={idx} columns={col}/>
       ))}</>
    )
}

export default ReportPSC
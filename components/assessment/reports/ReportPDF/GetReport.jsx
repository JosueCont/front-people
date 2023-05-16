import React from 'react';
import ReportP from '../types/ReportP';
import ReportPP from '../types/ReportPP';
import ReportPSP from '../types/ReportPSP';
import ReportPPS from '../types/ReportPPS';
import ReportPSC from '../types/ReportPSC';

const GetReport = ({typeReport, ...props}) => {
    
    const Reports = {
        'p': ReportP,
        'pp': ReportPP,
        'psp': ReportPSP,
        'pps': ReportPPS,
        'psc': ReportPSP,
        '__default__': ()=> <></>
    }

    const Selected = Reports[typeReport] ?? Reports['__default__'];

    return <Selected {...props}/>;
}

export default GetReport
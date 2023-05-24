import React, {useMemo} from 'react';
import {
    StyleSheet,
    View,
    Image
} from '@react-pdf/renderer';
import { Table, CardTable } from '../ReportPDF/ReportUtils';

const ReportPP = ({
    columns,
    dataSource
}) => {
    
    // const columns_ = useMemo(()=>{
    //     let width = {0: '15%', 1: '10%', 2: '28%', 3: '9%', 4: '28%', 5: '10%'};
    //     return columns?.map((item, idx) =>{
    //         return {...item, width: width[idx]}
    //     })
    // },[columns])

    return (
        <>
            {dataSource?.chart_img && (
                <View style={styles.content_img}>
                    <Image src={dataSource?.chart_img}/>
                </View>
            )}
            {dataSource?.competences?.length > 0 && dataSource.competences.map((item, idx) =>(
                <CardTable
                    pos={idx}
                    key={idx}
                    item={item}
                    marginTop={idx > 0 ? 8 : 0}
                />
            ))}
            {/* <Table
                columns={columns_}
                data={dataSource?.competences}
            /> */}
        </>
    )
}

const styles = StyleSheet.create({
    content_img: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        maxHeight: 400,
        marginBottom: 8
    }
})

export default ReportPP
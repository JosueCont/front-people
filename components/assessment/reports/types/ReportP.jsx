import React, { useMemo } from 'react';
import {
    StyleSheet,
    View,
    Image
} from '@react-pdf/renderer';
import { Table } from '../ReportPDF/ReportUtils';

const ReportP = ({
    columns,
    dataSource
}) => {

    const columns_ = useMemo(() => {
        let width = { 0: '20%', 1: '10%', 2: '70%' };
        return columns.map((item, idx) => {
            return { ...item, width: width[idx] }
        })
    }, [columns])

    return (
        <>
            {/* {dataSource?.chart_img && (
                <View style={styles.content_img}>
                    <Image src={dataSource?.chart_img}/>
                </View>
            )} */}
            <Table
                columns={columns_}
                data={dataSource}
            />
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

export default ReportP;
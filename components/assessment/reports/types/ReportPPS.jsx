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
import { Table, CardTable, theme } from '../ReportPDF/ReportUtils';

const styles = StyleSheet.create({
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
    },
    title:{
        textAlign: 'center',
        fontSize: 10,
        color: theme.color.black
    },
    content_img: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        maxHeight: 400
    }
})

const ReportPPS = ({
    columns,
    dataSource
}) => {
    return (
    //    <Table data={dataSource} columns={columns}/>
        <View style={styles.section}>
            {dataSource?.map((item, idx) => (
                <View key={idx} style={styles.section}>
                    {item.competences?.map((record, index) => {
                        if(index == 0){
                            return (
                                <View key={index} style={styles.section} wrap={false}>
                                    <Text style={styles.title}>
                                        {`${item?.name} (${item?.compatibility})`}
                                    </Text>
                                    <CardTable pos={index} item={record}/>
                                </View>
                            )
                        }
                        return <CardTable pos={index} key={index} item={record}/>;
                    })}
                    {item.chart_img && (
                        <View style={styles.content_img}>
                            <Image src={item.chart_img}/>
                        </View>
                    )}
                </View>
            ))}
        </View>
    )
}

export default ReportPPS
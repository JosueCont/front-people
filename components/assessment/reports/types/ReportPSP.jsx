import React, {useEffect, useMemo} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image
} from '@react-pdf/renderer';
import { CardTable, theme } from '../ReportPDF/ReportUtils';

const ReportPSP = ({
    columns,
    dataSource
}) => {
    return (
        <>
            {dataSource?.length > 0 && dataSource?.map((item, idx) => (
                <View key={idx} style={[styles.section, {marginTop: idx > 0 ? 8 : 0}]}>
                    {item.profiles?.competences?.map((record, index) => {
                        if(index == 0){
                            return (
                                <View key={index} wrap={false} style={styles.section}>
                                    <Text style={styles.title}>
                                        {`${item.persons?.fullName} (${item.profiles?.compatibility})`}
                                    </Text>
                                    <CardTable pos={index} item={record} marginTop={8}/>
                                </View>
                            )
                        }
                        return <CardTable pos={index} key={index} item={record} marginTop={8}/>;
                    })}
                    {item.chart_img && (
                        <View style={styles.content_img}>
                            <Image src={item.chart_img}/>
                        </View>
                    )}
                </View>
            ))}
        </>
    )
}

const styles = StyleSheet.create({
    section: {
        display: 'flex',
        flexDirection: 'column'
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
        maxHeight: 400,
        marginTop: 8
    }
})

export default ReportPSP
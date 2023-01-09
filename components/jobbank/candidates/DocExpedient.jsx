import React, { useEffect, useState, memo } from 'react';
import {
    View,
    Text,
    Image,
    Document,
    Page,
    PDFViewer,
} from '@react-pdf/renderer';

const DocExpedient = ({
    infoCandidate,
    infoEducation,
    infoExperience,
    infoPositions
}) => {

    const SectionEducation = () => (
        <View style={{
            padding: 6,
            borderTopLeftRadius: 10,
            backgroundColor: 'rgb(251 237 224)'
        }}>
            <Text style={{
                fontSize: 14,
                letterSpacing: 1,
                paddingBottom: 3,
                borderBottom: '1px solid rgb(17 24 39)'
            }}>Educación</Text>
            {infoEducation.results?.length > 0 && (
                <View style={{
                    marginTop: 12,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {infoEducation.results?.map((item, idx) => (
                         <View key={idx} style={{
                            marginBottom: 4,
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Text style={{fontSize: 14, marginBottom: 2}}>{item.institution_name ?? null}</Text>
                            <Text style={{fontSize: 14, color: 'rgb(107 114 128)'}}>
                               {item.study_level?.name ?? null} - {item.end_date ?? null}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    )

    const SectionExperience = () => (
        <View style={{
            padding: 6,
            borderTopRightRadius: 10,
            backgroundColor: 'rgb(248 243 239)',
        }}>
            <Text style={{
                fontSize: 14,
                letterSpacing: 1,
                paddingBottom: 3,
                borderBottom: '1px solid rgb(17 24 39)'
            }}>Experiencia</Text>
            {infoPositions.results?.length > 0 && (
                <View style={{marginTop: 12}}>
                    {infoPositions?.results?.map((item, idx) =>(
                        <View key={idx} style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            marginBottom: 4
                        }}>
                            <View style={{
                                display: 'flex',
                                flexDirection: 'column',
                                paddingRight: 6
                            }}>
                                <Text style={{fontSize: 14, marginBottom: 2}}>{item.company}</Text>
                                <Text style={{fontSize: 14, color: 'rgb(107 114 128)'}}>
                                    {item.start_date?.substring(0,4)} - {item.end_date?.substring(0,4)}
                                </Text>
                            </View>
                            <View style={{
                                display: 'flex',
                                flexDirection: 'column',
                                paddingLeft: 6
                            }}>
                                <Text style={{fontSize: 14, marginBottom: 2}}>{item.position_name}</Text>
                                <Text style={{fontSize: 14, color: 'rgb(107 114 128)'}}>{item.sector?.name ?? null}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    )

    return (
        // <PDFViewer showToolbar={false} style={{width: '100%', minHeight: '100vh'}}>
            <Document title='Expediente'>
                <Page size='LETTER' style={{padding: 24}}>
                    <View style={{textAlign: 'center', marginBottom: 12}}>
                        <Text style={{fontSize: 28, fontWeight: 'bold', lineHeight: 1}}>
                            {infoCandidate?.fisrt_name} {infoCandidate?.last_name}
                        </Text>
                    </View>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap'
                    }}>
                        <View style={{
                            flex: '0 0 40%',
                            paddingRight: 6
                        }}>
                            <SectionEducation/>
                        </View>
                        <View style={{
                            flex: '0 0 60%',
                            paddingLeft: 6
                        }}>
                           <SectionExperience/>
                        </View>
                    </View>
                </Page>
            </Document>
        // </PDFViewer>
    )
}

export default memo(DocExpedient);
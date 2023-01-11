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

    console.log('infoCandidate', infoCandidate)
    console.log('infoEducation', infoEducation)

    const SectionHeader = () => (
        <View
           style={{
            marginBottom: 30
           }}
        >
            <View 
              style={{
                textAlign: 'right',
                marginBottom: 12,
            }}>
                    {/* <Image 
                        src={'/images/logo_HEX.png'}
                        style={{
                            width: '60px',
                            height: '25px',
                            border: '1px red solid'
                        }}
                    /> */}
                    <Text>
                        IMAGEN
                    </Text>
            </View>
            <View
                style={{
                    textAlign: 'center'
                }}
            >
                <Text>Información del candidato</Text>
            </View>
        </View>
    )

    const SectionDetails = () => (
        <View>
            <View style={{ marginBottom: 10}}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }} >Datos generales</Text>
            </View>
            <View
                style={{
                    backgroundColor: '#E9E9E9',
                    borderRadius: 5
                }}
            >
                <View style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        padding: '6px 12px',
                }}>
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>Nombre: {infoCandidate?.fisrt_name}</Text>
                    </View>
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>Apellidos: {infoCandidate?.last_name}</Text>
                    </View>
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>Fecha de nacimiento: {infoCandidate?.birthdate || ""}</Text>
                    </View>
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>Correo electrónico: {infoCandidate?.email}</Text>
                    </View>
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>Celular: {infoCandidate?.cell_phone}</Text>
                    </View>
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>Teléfono fijo: {infoCandidate?.telephone}</Text>
                    </View>
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>Estado: {infoCandidate?.state?.name}</Text>
                    </View>
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>Municipio: {infoCandidate?.municipality}</Text>
                    </View>
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>Dirección: {infoCandidate?.street_address}</Text>
                    </View>
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>Código postal: {infoCandidate?.postal_code}</Text>
                    </View>
                    <View style={{ flex: '0 0 100%', borderBottom: '1px solid rgb(17 24 39)', marginTop: 20, marginBottom: 10 }}></View>
                </View>
                <View
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        padding: '6px 12px',
                        marginBottom: 10
                }}
                >
                    <View style={{
                        flex: '0 0 100%',
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        flexDirection: 'row', }}>
                        <Text style={{ fontSize: 10, marginRight: 15 }}>Idiomas: </Text>
                        {
                            infoCandidate?.languages.length > 0 &&

                            infoCandidate.languages.map((lang) => (
                                <Text 
                                    key={lang.id} 
                                    style={{
                                        fontSize: 10,
                                        padding: '3px 5px',
                                        backgroundColor: '#FFF',
                                        marginRight: 5,
                                        borderRadius: 5
                                    }}
                                > 
                                    { lang.lang } / { lang.domain } 
                                </Text>
                            ))
                        }
                    </View>
                </View>
                <View
                   style={{
                       display: 'flex',
                       flexWrap: 'wrap',
                       flexDirection: 'row',
                       padding: '6px 12px',
                    }}
                >
                    <View style={{flex: '0 0 100%', marginBottom: 10 }}>
                        <Text style={{ fontSize: 10 }}>Acerca de tí:</Text>
                    </View>
                    <View style={{flex: '0 0 100%', backgroundColor: '#FFF', padding: '6px 12px', border: '1px solid gray', borderRadius: 5, marginBottom: 10 }}>
                        <Text style={{ fontSize: 10 }}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum alias voluptate laudantium quo, 
                        quia molestiae laboriosam nisi? Quae inventore ut rerum alias unde consequatur dolorem, 
                        quam architecto ipsum sapiente ab eligendi dolores minus consectetur esse.
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )

    const SectionEducation = () => (
        <View style={{ marginTop: 20 }}>
            <View style={{ marginBottom: 10}}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }} >Educación</Text>
            </View>
            <View
                style={{
                    backgroundColor: '#E9E9E9',
                    borderRadius: 5
                }}
            >
                <View
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        padding: '6px 12px',
                    }}
                >
                    <View style={{flex: '0 0 15%', border: '1px solid', textAlign: 'left' }}>
                        <Text style={{ fontSize: 10 }}>Escolaridad</Text>
                    </View>
                    <View style={{flex: '0 0 15%', border: '1px solid', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10 }}>Carrera</Text>
                    </View>
                    <View style={{flex: '0 0 20%', border: '1px solid', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10 }}>Estatus</Text>
                    </View>
                    <View style={{flex: '0 0 20%', border: '1px solid', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10 }}>Fecha de finalización</Text>
                    </View>
                    <View style={{flex: '0 0 30%', border: '1px solid', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10 }}>Nombre de la institucion</Text>
                    </View>
                </View>
            </View>
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
                    <SectionHeader />
                    <SectionDetails />
                    <SectionEducation />
                    
                    {/* <View style={{
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
                    </View> */}
                </Page>
            </Document>
        // </PDFViewer>
    )
}

export default memo(DocExpedient);
import React, { useEffect, useState, memo } from 'react';
import {
    View,
    Text,
    Image,
    Document,
    Page,
    PDFViewer,
} from '@react-pdf/renderer';
import moment from 'moment';

const ReportHighDirection = ({
    infoCandidate,
    infoEducation,
    infoPositions,
    image,
    widthAndHeight
}) => {
    const widthImage = widthAndHeight?.width > 100 ? '100px' : widthAndHeight?.width


    const list_status = [
        {
            "value": 1,
            "key": 1,
            "label": "En curso"
        },
        {
            "value": 2,
            "key": 2,
            "label": "Trunca"
        },
        {
            "value": 3,
            "key": 3,
            "label": "Concluida"
        }
    ]

    const listLanguages = [
        {
            "value": 1,
            "key": 1,
            "label": "Inglés",
            "children": [
                {
                    "value": 1,
                    "key": 1,
                    "label": "Básico"
                },
                {
                    "value": 2,
                    "key": 2,
                    "label": "Intermedio"
                },
                {
                    "value": 3,
                    "key": 3,
                    "label": "Avanzado"
                },
                {
                    "value": 4,
                    "key": 4,
                    "label": "Experto"
                }
            ]
        },
        {
            "value": 2,
            "key": 2,
            "label": "Francés",
            "children": [
                {
                    "value": 1,
                    "key": 1,
                    "label": "Básico"
                },
                {
                    "value": 2,
                    "key": 2,
                    "label": "Intermedio"
                },
                {
                    "value": 3,
                    "key": 3,
                    "label": "Avanzado"
                },
                {
                    "value": 4,
                    "key": 4,
                    "label": "Experto"
                }
            ]
        },
        {
            "value": 3,
            "key": 3,
            "label": "Italiano",
            "children": [
                {
                    "value": 1,
                    "key": 1,
                    "label": "Básico"
                },
                {
                    "value": 2,
                    "key": 2,
                    "label": "Intermedio"
                },
                {
                    "value": 3,
                    "key": 3,
                    "label": "Avanzado"
                },
                {
                    "value": 4,
                    "key": 4,
                    "label": "Experto"
                }
            ]
        }
    ]

    const listCap = [
        'Kerio Control Training Level 100',
        'Tanaza Profesional Certificado',
        'Tanaza Profesional del marketing',
        'Bitdefender Bussines Portfolio Certification Sales',
        'Bitdefender Bussines Portfolio Certification Technical'
    ]

    const SectionDetails = () => (
        <View
          style={{
            width: '80%',
            margin: 'auto'
          }}
        >
            <View style={{ marginBottom: 10}}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }} >I INFORMACIÓN PERSONAL</Text>
            </View>
            <View>
                <View style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                }}>
                    <View style={{
                      flex: '0 0 50%', 
                      borderTop: '2px solid black',
                      borderLeft: '2px solid black',
                      borderRight: '2px solid black',
                      borderBottom: '2px solid black',
                      padding: '6px 12px'
                    }}>
                        <Text style={{ fontSize: 10 }}>Nombre completo y apellidos:</Text>
                    </View>
                    <View style={{
                      flex: '0 0 50%',
                      borderTop: '2px solid black',
                      borderRight: '2px solid black',
                      borderBottom: '2px solid black',
                      padding: '6px 12px'
                    }}>
                        <Text style={{ fontSize: 10 }}>{infoCandidate?.first_name} {infoCandidate?.last_name}</Text>
                    </View>
                    <View style={{
                      flex: '0 0 50%',
                      borderLeft: '2px solid black',
                      borderRight: '2px solid black',
                      borderBottom: '2px solid black',
                      padding: '6px 12px'
                      }}
                    >
                        <Text style={{ fontSize: 10 }}>Lugar y fecha de nacimiento:</Text>
                    </View>
                    <View style={{
                      flex: '0 0 50%',
                      borderRight: '2px solid black',
                      borderBottom: '2px solid black',
                      padding: '6px 12px'
                    }}>
                        <Text style={{ fontSize: 10 }}>{ infoCandidate?.birthdate && moment(infoCandidate?.birthdate).format('DD-MM-YYYY') || ""} {infoCandidate?.municipality} {infoCandidate?.state?.name}</Text>
                    </View>
                    <View style={{
                      flex: '0 0 50%',
                      borderLeft: '2px solid black',
                      borderRight: '2px solid black',
                      borderBottom: '2px solid black',
                      padding: '6px 12px'
                    }}>
                        <Text style={{ fontSize: 10 }}>Estado civil:</Text>
                    </View>
                    <View style={{
                      flex: '0 0 50%',
                      borderRight: '2px solid black',
                      borderBottom: '2px solid black',
                      padding: '6px 12px' 
                    }}>
                        <Text style={{ fontSize: 10 }}>{''}</Text>
                    </View>
                    <View style={{
                      flex: '0 0 50%',
                      borderLeft: '2px solid black',
                      borderRight: '2px solid black',
                      borderBottom: '2px solid black',
                      padding: '6px 12px' 
                    }}>
                        <Text style={{ fontSize: 10 }}>Dirección:</Text>
                    </View>
                    <View style={{
                      flex: '0 0 50%',
                      borderRight: '2px solid black',
                      borderBottom: '2px solid black',
                      padding: '6px 12px' 
                    }}>
                        <Text style={{ fontSize: 10 }}>{infoCandidate?.street_address}</Text>
                    </View>
                    <View style={{
                      flex: '0 0 50%',
                      borderLeft: '2px solid black',
                      borderRight: '2px solid black',
                      borderBottom: '2px solid black',
                      padding: '6px 12px' 
                    }}>
                        <Text style={{ fontSize: 10 }}>Número telefónico particular: </Text>
                    </View>
                    <View style={{
                      flex: '0 0 50%',
                      borderRight: '2px solid black',
                      borderBottom: '2px solid black',
                      padding: '6px 12px'
                    }}>
                        <Text style={{ fontSize: 10 }}>{infoCandidate?.telephone}</Text>
                    </View>
                    <View style={{
                      flex: '0 0 50%',
                      borderLeft: '2px solid black',
                      borderRight: '2px solid black',
                      borderBottom: '2px solid black',
                      padding: '6px 12px' 
                    }}>
                        <Text style={{ fontSize: 10 }}>Número de celular: </Text>
                    </View>
                    <View style={{
                      flex: '0 0 50%',
                      borderRight: '2px solid black',
                      borderBottom: '2px solid black',
                      padding: '6px 12px'
                    }}>
                        <Text style={{ fontSize: 10 }}>{infoCandidate?.cell_phone}</Text>
                    </View>
                    <View style={{
                      flex: '0 0 50%',
                      borderLeft: '2px solid black',
                      borderRight: '2px solid black',
                      borderBottom: '2px solid black',
                      padding: '6px 12px' 
                    }}>
                        <Text style={{ fontSize: 10 }}>Dirección de correo electrónico: </Text>
                    </View>
                    <View style={{
                      flex: '0 0 50%',
                      borderRight: '2px solid black',
                      borderBottom: '2px solid black',
                      padding: '6px 12px'
                    }}>
                        <Text style={{ fontSize: 10 }}>{infoCandidate?.email}</Text>
                    </View>
                </View>
                {/* <View
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
                                    { lang && listLanguages.find((lg) =>  lg.value === lang.lang ).label + ' ' } 
                                    / 
                                    { lang && ' ' + listLanguages.find((lg) => lg.value === lang.lang ).children.find((dom) => dom.value === lang.domain).label } 
                                </Text>
                            ))
                        }
                    </View>
                </View> */}
            </View>
        </View>
    )

    const SectionEducation = () => (
        <View style={{ width: '80%', margin: 'auto'}}>
            <View style={{ marginBottom: 10}}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }} >II ESTUDIOS (Universitarios, Diplomados, Maestrías)</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
              }}
            >
              {
                infoEducation?.length > 0 && infoEducation.map((inst) => (

                  <View 
                    key={inst.id} 
                    style={{ 
                        marginBottom: 10, 
                        flex: '0 0 100%', 
                        borderRadius: 10, 
                        backgroundColor: '#E9E9E9',
                        padding: '6px 12px',
                    }}
                    >
                    <View>
                      <Text style={{fontSize: 10}}>Titulo obtenido: { inst?.specialitation_area } </Text>
                    </View>
                    <View>
                      <Text style={{fontSize: 10}}>Institución: { inst?.institution_name} </Text>
                    </View>
                    <View>
                      <Text style={{fontSize: 10}}>Periodo: { inst?.end_date && moment(inst?.end_date).format('DD-MM-YYYY')} </Text>
                    </View>
                  </View>
                ))
               }

               {/* <View style={{ width: '100%' }}>
                    <View style={{ marginBottom: 10}}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold' }} >Cursos de capacitación</Text>
                    </View>
                    {
                        listCap?.length > 0 && listCap.map((cap, index) => (
                            <View>
                                <Text style={{fontSize: 10}}>{index + 1}. {cap}</Text>
                            </View>
                        ))
                    }
               </View> */}

               <View>
                    <View style={{ marginTop: 10, marginBottom: 5}}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold' }} >Idiomas:</Text>
                    </View>
                    <View
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                        }}
                    >

                    {
                            infoCandidate?.languages?.length > 0 &&

                            infoCandidate.languages.map((lang) => (

                                <View 
                                    key={lang.id} 
                                    style={{
                                        borderRadius: 10, 
                                        backgroundColor: '#E9E9E9',
                                        padding: '6px 12px',
                                    }}
                                >

                                    <Text 
                                        style={{
                                            fontSize: 10,
                                            borderRadius: 5
                                        }}
                                    > 
                                        { lang && listLanguages.find((lg) =>  lg.value === lang.lang ).label + ' ' } 
                                        nivel
                                        { lang && ' ' + listLanguages.find((lg) => lg.value === lang.lang ).children.find((dom) => dom.value === lang.domain).label } 
                                    </Text>

                                </View>
                                
                            ))
                        }
                    </View>
               </View>

            </View>
        </View>
    )

    // const SectionExperience = () => (
    //     <View style={{ marginTop: 20 }}>
    //         <View style={{ marginBottom: 10}}>
    //             <Text style={{ fontSize: 14, fontWeight: 'bold' }} >Experiencia y especialización</Text>
    //         </View>
    //         <View
    //             style={{
    //                 backgroundColor: '#E9E9E9',
    //                 borderRadius: 8
    //             }}
    //         >
    //             <View
    //                 style={{
    //                     display: 'flex',
    //                     flexWrap: 'wrap',
    //                     flexDirection: 'row',
    //                     padding: '6px 12px',
    //                 }}
    //             >
    //                 <View style={{flex: '0 0 25%', textAlign: 'left' }}>
    //                     <Text style={{ fontSize: 10 }}>Categoría</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 25%', textAlign: 'left' }}>
    //                     <Text style={{ fontSize: 10 }}>Subcategoría</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 20%', textAlign: 'left' }}>
    //                     <Text style={{ fontSize: 10 }}>Años de experiencia</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 30%', textAlign: 'center' }}>
    //                     <Text style={{ fontSize: 10 }}>Competencias</Text>
    //                 </View>
    //             </View>
    //             <View
    //                 style={{
    //                     padding: '6px 12px',
    //                     display: 'flex',
    //                     flexWrap: 'wrap',
    //                     flexDirection: 'row',
    //                 }}
    //             >
    //                 {
    //                     infoExperience?.length > 0 && infoExperience.map((info) => (
    //                         <>
    //                        <View 
    //                          key={info.id}
    //                         style={{ 
    //                             backgroundColor: '#FFF',
    //                             display: 'flex',
    //                             flexWrap: 'wrap',
    //                             flexDirection: 'row',
    //                             borderRadius: 10,
    //                             padding: '0px 6px',
    //                             marginBottom: 5,
    //                             flex: '0 0 70%',
    //                             maxHeight: 12
    //                         }}
    //                     >
    //                         <View style={{flex: '0 0 35%', textAlign: 'left' }}>
    //                             <Text style={{ fontSize: 10 }}> { info?.category?.name } </Text>
    //                         </View>
    //                         <View style={{flex: '0 0 35%', textAlign: 'left' }}>
    //                             <Text style={{ fontSize: 10 }}>{ info?.sub_category?.name }</Text>
    //                         </View>
    //                         <View style={{flex: '0 0 30%', textAlign: 'center' }}>
    //                             <Text style={{ fontSize: 10 }}> { info?.experience_years } </Text>
    //                         </View>
    //                     </View>

    //                     <View
    //                         style={{ 
    //                             display: 'flex',
    //                             flexWrap: 'wrap',
    //                             flexDirection: 'row',
    //                             padding: '0px 6px',
    //                             marginBottom: 5,
    //                             flex: '0 0 30%'
    //                         }}
    //                     >
    //                        {
    //                             info?.competences?.length > 0 && info.competences.map((comp) => (
    //                                 <View key={comp.id} style={{ textAlign: 'center', backgroundColor: '#FFF', borderRadius: 10, marginRight: 3, marginBottom: 3 }}>
    //                                     <Text style={{ fontSize: 10 }}> { comp.name } </Text>
    //                                 </View>
    //                             ))
    //                        }
    //                     </View>
    //                     </>
    //                     ))

    //                 }
    //             </View>
    //         </View>
    //     </View>
    // )

    const SectionUltimateJobs = () => (
        <View style={{ width: '80%', margin: 'auto' }}>
            <View style={{ marginBottom: 10}}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }} >III EXPERIENCIA PROFESIONAL</Text>
            </View>
            <View
            >
                <View
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                    }}
                >
                    {
                        infoPositions?.length > 0 && infoPositions.map((pos) => (

                            <View 
                                key={pos.id} 
                                style={{ 
                                    marginBottom: 10, 
                                    flex: '0 0 100%',
                                    borderRadius: 10, 
                                    backgroundColor: '#E9E9E9',
                                    padding: '6px 12px', 
                                }}
                            >
                            <View>
                              <Text style={{fontSize: 10}}>Nombre de la compañia: { pos?.company } </Text>
                            </View>
                            <View>
                              <Text style={{fontSize: 10}}>Fechas: { pos?.start_date && moment(pos?.start_date).format('DD-MM-YYYY')} - { pos?.end_date && moment(pos?.end_date).format('DD-MM-YYYY') } </Text>
                            </View>
                            <View>
                              <Text style={{fontSize: 10}}>Giro: { pos?.sector?.name} </Text>
                            </View>
                            <View>
                              <Text style={{fontSize: 10}}>Puesto: { pos?.position_name} </Text>
                            </View>
                          </View>
                        ))
                    }

                </View>
            </View>
        </View>
    )

    return (
        // <PDFViewer showToolbar={false} style={{width: '100%', minHeight: '100vh'}}>
            <Document title='Expediente'>
                <Page size='LETTER' style={{padding: 24}} wrap={true}>
                <View
                    style={{
                        marginBottom: 30,
                    }}
                >
                    <View 
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            marginBottom: 12,
                        }}
                    >
                        <View style={{ flex:'0 0 95px', marginRight: 20 }}>
                            <Image 
                                src={'/images/LogoKhorconnect_1.png'}
                                style={{
                                    width: '95px',
                                    height: '30px',
                                }}
                            />
                        </View>
                        <View style={{ flex:'0 0 auto' }}>
                            <Image 
                                src={{ 
                                    uri: image, 
                                    method: "GET", 
                                    headers: { 
                                        "Cache-Control": "no-cache" }, 
                                    body: "" }} 
                                style={{
                                    width: widthAndHeight?.width > widthAndHeight?.height ? widthImage  : '30px',
                                    height: '30px',
                                }}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        <Text>Reporte de alta dirección</Text>
                    </View>
                </View>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 20
                  }}
                >
                  <SectionDetails />
                </View>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 20
                  }}
                >
                  <SectionEducation />
                </View>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <SectionUltimateJobs />
                </View>
                </Page>
            </Document>
        // </PDFViewer>
    )
}

export default memo(ReportHighDirection);
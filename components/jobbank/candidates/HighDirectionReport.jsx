import React, { useEffect, useState, memo } from 'react';
import {
    View,
    Text,
    Image,
    Document,
    Page,
    PDFViewer,
} from '@react-pdf/renderer';

const HighDirectionReport = ({
    infoCandidate,
    infoEducation,
    // infoExperience,
    // infoPositions,
}) => {

    const [marginTop, setMarginTop ] = useState(80)

    // useEffect(() => {
    //     if(infoCandidate && infoCandidate.about_me && infoCandidate.about_me.length > 0){
    //         if(infoCandidate.about_me.length > 100){
    //             setMarginTop(marginTop - 30)
    //         } else {
    //             setMarginTop(marginTop + 10)
    //         }
    //     }
    // },[infoCandidate])

    // useEffect(() => {
    //     if (infoExperience && infoExperience.length > 0) {
    //         if (infoExperience.length > 2) {
    //             setMarginTop(marginTop - 25)
    //         }
    //     }
    // },[infoExperience])

    // useEffect(() => {
    //     if(infoEducation && infoEducation.length > 0){
    //         if(infoEducation.length <= 3){
    //             setMarginTop(marginTop + 25)
    //         }
    //     }
    // },[infoCandidate])

    console.log('info education', infoEducation)


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
                        <Text style={{ fontSize: 10 }}>{infoCandidate?.fisrt_name} {infoCandidate?.last_name}</Text>
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
                        <Text style={{ fontSize: 10 }}>{infoCandidate?.birthdate || ""} {infoCandidate?.municipality} {infoCandidate?.state?.name}</Text>
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

                  inst?.study_level && inst?.study_level?.id >= 6 &&

                  <View key={inst.id} style={{ marginBottom: 10, flex: '0 0 100%' }}>
                    <View>
                      <Text style={{fontSize: 10}}>Titulo obtenido: { inst?.specialitation_area } </Text>
                    </View>
                    <View>
                      <Text style={{fontSize: 10}}>Institución: { inst?.institution_name} </Text>
                    </View>
                    <View>
                      <Text style={{fontSize: 10}}>Periodo: { inst?.end_date} </Text>
                    </View>
                  </View>
                ))
              }
                {/* <View
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
                </View> */}
                {/* <View
                    style={{
                        padding: '6px 12px',
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
                                backgroundColor: '#FFF',
                                display: 'flex',
                                flexWrap: 'wrap',
                                flexDirection: 'row',
                                borderRadius: 10,
                                padding: '0px 6px',
                                marginBottom: 5
                            }}
                        >
                            <View style={{flex: '0 0 15%', border: '1px solid', textAlign: 'left' }}>
                                <Text style={{ fontSize: 10 }}> { inst?.study_level?.name } </Text>
                            </View>
                            <View style={{flex: '0 0 15%', border: '1px solid', textAlign: 'center' }}>
                                <Text style={{ fontSize: 10 }}> { inst?.specialitation_area } </Text>
                            </View>
                            <View style={{flex: '0 0 20%', border: '1px solid', textAlign: 'center' }}>
                                <Text style={{ fontSize: 10 }}> { inst && list_status.find((sch) => sch.value == inst.status).label } </Text>
                            </View>
                            <View style={{flex: '0 0 20%', border: '1px solid', textAlign: 'center' }}>
                                <Text style={{ fontSize: 10 }}> { inst?.end_date } </Text>
                            </View>
                            <View style={{flex: '0 0 30%', border: '1px solid', textAlign: 'center' }}>
                                <Text style={{ fontSize: 10 }}> { inst?.institution_name } </Text>
                            </View>
                        </View>
                        ))
                    }

                </View> */}
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

    // const SectionUltimateJobs = () => (
    //     <View style={{ marginTop: marginTop }}>
    //         <View style={{ marginBottom: 10}}>
    //             <Text style={{ fontSize: 14, fontWeight: 'bold' }} >Últimos puestos</Text>
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
    //                 <View style={{flex: '0 0 15%', border: '1px solid', textAlign: 'left' }}>
    //                     <Text style={{ fontSize: 10 }}>Puesto</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 15%', border: '1px solid', textAlign: 'center' }}>
    //                     <Text style={{ fontSize: 10 }}>Empresa</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 25%', border: '1px solid', textAlign: 'center' }}>
    //                     <Text style={{ fontSize: 10 }}>Sector</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 20%', border: '1px solid', textAlign: 'center' }}>
    //                     <Text style={{ fontSize: 10 }}>Fecha de inicio</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 25%', border: '1px solid', textAlign: 'center' }}>
    //                     <Text style={{ fontSize: 10 }}>Fecha de finalización</Text>
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
    //                     infoPositions?.length > 0 && infoPositions.map((inst) => (

    //                     <View 
    //                         key={inst.id}
    //                         style={{ 
    //                             backgroundColor: '#FFF',
    //                             display: 'flex',
    //                             flexWrap: 'wrap',
    //                             flexDirection: 'row',
    //                             borderRadius: 10,
    //                             padding: '0px 6px',
    //                             marginBottom: 5
    //                         }}
    //                     >
    //                         <View style={{flex: '0 0 15%', border: '1px solid', textAlign: 'left' }}>
    //                             <Text style={{ fontSize: 10 }}> { inst?.position_name } </Text>
    //                         </View>
    //                         <View style={{flex: '0 0 15%', border: '1px solid', textAlign: 'center' }}>
    //                             <Text style={{ fontSize: 10 }}> { inst?.company } </Text>
    //                         </View>
    //                         <View style={{flex: '0 0 25%', border: '1px solid', textAlign: 'center' }}>
    //                             <Text style={{ fontSize: 10 }}> { inst?.sector?.name } </Text>
    //                         </View>
    //                         <View style={{flex: '0 0 20%', border: '1px solid', textAlign: 'center' }}>
    //                             <Text style={{ fontSize: 10 }}> { inst?.start_date } </Text>
    //                         </View>
    //                         <View style={{flex: '0 0 25%', border: '1px solid', textAlign: 'center' }}>
    //                             <Text style={{ fontSize: 10 }}> { inst?.end_date} </Text>
    //                         </View>
    //                     </View>
    //                     ))
    //                 }

    //             </View>
    //         </View>
    //     </View>
    // )

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
                        justifyContent: 'center',
                        marginBottom: 12,
                    }}>
                            <Image 
                                src={'/images/logo_HEX.png'}
                                style={{
                                    width: '110px',
                                    height: '25px',
                                    marginLeft: '90%',
                                }}
                            />
                    </View>
                    <View
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: 12,
                        }}
                    >
                        <View 
                          style={{
                            width: '80%',
                            margin: 'auto'
                          }}
                        >
                           <Text style={{ fontSize: 10}}>Lee detenidamente el siguiente formato de currículum vitae y llena cada uno de los puntos que loconforman utilizando mayúsculas y minúsculas.</Text>
                        </View>
                       
                    </View>
                    <View
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                    >
                        <View 
                          style={{
                            width: '80%',
                            margin: 'auto'
                          }}
                        >
                           <Text style={{ fontSize: 10}}>Una vez que lo hayas concluido, te agradeceremos que nos lo hagas llegar lo antes posible porcorreo electrónico al correo: <Text style={{ fontWeight: 'bold' }}>miguel.lumbreras@iucorporation.com Gracias.</Text></Text>
                        </View>
                       
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
                  }}
                >
                  <SectionEducation />
                </View>
                    {/* <SectionDetails />
                    <SectionEducation />
                    <SectionExperience />
                    <SectionUltimateJobs />
                     */}
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

export default memo(HighDirectionReport);
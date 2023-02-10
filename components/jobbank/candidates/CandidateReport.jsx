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

const CandidateReport = ({
    infoCandidate,
    infoEducation,
    infoExperience,
    infoPositions,
}) => {

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

    const ageCandidate = (date) => {
      let birthdate = moment(date)
      let currentDate = moment()
      let age = currentDate.diff(birthdate, 'years')
      let stringAge = `${age} años`
      return stringAge
    }

    const maxEducation = () => {
      let listEducationIds = infoEducation.map((item) => item.study_level.id )
      let max = Math.max(listEducationIds)
      let maxEdu = infoEducation.find((item) => item.study_level.id === max)
      let maxEduStatus = list_status.find((item) => item.value === maxEdu.status).label
      let stringMaxEdu = `${maxEdu.study_level.name} ${maxEduStatus.toLocaleLowerCase()}`
      return stringMaxEdu
    }

    infoPositions.sort((a, b) => {
            if (a.end_date > b.end_date) return -1;
            if (a.end_date < b.end_date) return 1;
            return 0;
    });
    
    console.log('xdxdxd', infoPositions)

    const SectionDetails = () => (
        <View
          style={{
            width: '80%',
            margin: 'auto'
          }}
        >
            <View>
                <View style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                }}>
                    <View style={{
                      flex: '0 0 100%',
                      flexDirection: 'row',
                    }}>
                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>Nombre del candidato: </Text>
                        <Text style={{ fontSize: 12 }}>{infoCandidate?.first_name} {infoCandidate?.last_name}</Text>
                    </View>
                    <View style={{
                      flex: '0 0 100%',
                      flexDirection: 'row',
                      }}
                    >
                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>Edad: </Text>
                        <Text style={{ fontSize: 12 }}>{ infoCandidate?.birthdate && ageCandidate(infoCandidate.birthdate) }</Text>
                    </View>
                    <View style={{
                      flex: '0 0 100%',
                      flexDirection: 'row',
                    }}>
                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>Fecha de nacimiento: </Text>
                        <Text style={{ fontSize: 12 }}>{ infoCandidate?.birthdate && moment(infoCandidate?.birthdate).format('DD-MM-YYYY') || ""}</Text>
                    </View>
                    <View style={{
                      flex: '0 0 100%',
                      flexDirection: 'row',
                    }}>
                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>Grado maximo de estudios: </Text>
                        <Text style={{ fontSize: 12 }}>{ maxEducation() }</Text>
                    </View>
                </View>
                <View
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        marginTop: 20,
                        marginBottom: 20
                    }}
                >
                    <View
                        style={{
                            flex: '0 0 100%'
                        }}
                    >
                        <Text style={{ fontSize: 13, marginBottom: 20, fontWeight: 'bold' }}>Resumen: </Text>
                    </View>
                    <View
                        style={{
                            flex: '0 0 100%'
                        }}
                    >
                        <Text style={{ fontSize: 12, marginBottom: 10 }}>
                        {infoCandidate?.first_name} {infoCandidate?.last_name}, reside actualmente en { infoCandidate?.municipality } en el estado de 
                        { ' ' + infoCandidate?.state.name }, { infoCandidate.availability_to_travel? 'cuenta ' : 'no cuenta ' } 
                        con disponibilidad para viajar, su ultimo trabajo fue el {  infoPositions?.length > 0 ? moment (infoPositions[0]?.end_date).format('DD-MM-YYYY') + ' ' : " " }
                        como {  infoPositions?.length > 0 ? infoPositions[0]?.position_name : "" } en { infoPositions?.length > 0 ? infoPositions[0]?.company + ' ' : ' '}
                        </Text>
                        <Text style={{ fontSize: 12, marginBottom: 10 }}>
                            Cuenta con experiencia en:
                        </Text>
                        
                        <View style={{ display: 'flex', flexDirection: 'row', flexWrap:'wrap' }}>
                        {
                            infoExperience?.length > 0 && infoExperience.map((pos) => (
                                <View key={pos.id} style={{ flex: '0 0 100%' }}>
                                    <Text  style={{ fontSize: 12, marginBottom: 10 }}>
                                        { 
                                            pos.experience_years > 1? 
                                            `${'\u2022 ' + pos.experience_years} años de experiencia en ${pos.category.name} en el area de ${pos.sub_category.name}.` 
                                            : 
                                            `${'\u2022 ' + pos.experience_years} año de experiencia en ${pos.category.name} en el area de ${pos.sub_category.name}.` 
                                        } 
                                    </Text>
                                </View>
                            ))
                        }

                        </View>

                        <Text style={{ fontSize: 12, marginBottom: 10 }}>
                            Tiene conocimientos en los siguientes lenguajes:
                        </Text>

                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap'
                          }}
                        >
                            {
                                infoCandidate?.languages.length > 0 &&

                                infoCandidate.languages.map((lang) => (
                                    <View key={lang.id} style={{ flex: '0 0 100%' }}>
                                        <Text 
                                            style={{
                                                fontSize: 12,
                                                marginBottom: 10
                                            }}
                                        > 
                                            { lang && listLanguages.find((lg) =>  lg.value === lang.lang ).label + ' ' } 
                                            / 
                                            { lang && ' ' + listLanguages.find((lg) => lg.value === lang.lang ).children.find((dom) => dom.value === lang.domain).label } 
                                        </Text>
                                    </View>
                                ))
                            }
                        </View>
 

                    </View>
                </View>
                {/* <View
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        marginBottom: 20
                    }}
                >
                    <View style={{
                      flex: '0 0 100%',
                      flexDirection: 'row'
                    }}>
                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>Motivo de salida último empleo: </Text>
                        <Text style={{ fontSize: 12 }}>Recorte de personal</Text>
                    </View>
                </View> */}
                {/* <View
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        marginBottom: 20
                    }}
                >
                    <View style={{
                      flex: '0 0 100%',
                    }}>
                        <Text style={{ fontSize: 13, marginBottom: 10, fontWeight: 'bold' }}>Sueldo último empleo incluyendo prestaciones:</Text>

                        <ul>
                            <li><Text style={{ fontSize: 12 }}>&middot; $2,400 libres semanales</Text></li>
                            <li><Text style={{ fontSize: 12 }}>&middot; Seguro de Vida</Text></li>
                            <li><Text style={{ fontSize: 12 }}>&middot; Utilidades</Text></li>
                            <li><Text style={{ fontSize: 12 }}>&middot; Vales de Despensa</Text></li>
                            <li><Text style={{ fontSize: 12 }}>&middot; Vacaciones</Text></li>
                            <li><Text style={{ fontSize: 12 }}>&middot; Aguinaldo</Text></li>
                            <li><Text style={{ fontSize: 12 }}>&middot; Ayuda transporte y útiles</Text></li>
                        </ul>
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

                  <View key={inst.id} style={{ marginBottom: 10, flex: '0 0 100%' }}>
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
                    {
                            infoCandidate?.languages.length > 0 &&

                            infoCandidate.languages.map((lang) => (
                                <Text 
                                    key={lang.id} 
                                    style={{
                                        fontSize: 10,
                                        borderRadius: 5
                                    }}
                                > 
                                    { lang && listLanguages.find((lg) =>  lg.value === lang.lang ).label + ' ' } 
                                    nivel
                                    { lang && ' ' + listLanguages.find((lg) => lg.value === lang.lang ).children.find((dom) => dom.value === lang.domain).label } 
                                </Text>
                            ))
                        }
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

                            <View key={pos.id} style={{ marginBottom: 10, flex: '0 0 100%' }}>
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
                        justifyContent: 'center',
                        marginBottom: 20,
                    }}
                    >
                      <Image 
                        src={'/images/logo_HEX.png'}
                        style={{
                                width: '30px',
                                height: '25px',
                                marginLeft: '10%'
                              }}
                      />
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
                {/* <View
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
                </View> */}
                </Page>
            </Document>
        // </PDFViewer>
    )
}

export default memo(CandidateReport);
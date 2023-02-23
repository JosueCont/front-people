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

const PDFReport = ({
  user,
  currentTab,
  columns,
  data,
  profilesSelected
}) => {

    console.log('profile', profilesSelected)

    const findPhoto = (id) => {
      let userSelected = user.find((us) => us.id === id)
      let photoUser = userSelected.photo? userSelected.photo : '/images/usuario.png'
      return photoUser
    }

    const SectionProfileCard = () => (
      <View>
        <View 
          style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              height: '50px',
              marginBottom: 15
            }}
          >
            <View
              style={{ 
                flex: '0 0 100%',
                display: 'flex',
                flexDirection: 'row',
                height: '100%',
              }}
            >
              
              { currentTab !== 'psp' && 
              
                <View style={{ flex:'0 0 10%', alignItems: 'center' }}>
                  <Image 
                    src={{ 
                      uri: user[0].photo? user[0].photo : '/images/usuario.png', 
                      method: "GET", 
                      headers: {"Cache-Control": "no-cache" }, 
                      body: ""
                    }}
                    style={{
                            width: '40px',
                            height: '40px',
                            marginTop: '3px',
                            borderRadius: '50%'
                    }}
                  />
                </View>
              }
              <View 
                style={{ 
                  flex:'0 0 40%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  textAlign:'left',
                  alignItems: 'left',
                  marginRight: 20 
                }}
              >
                  <Text style={{ fontSize: 14, marginTop: '10px' }}>
                    {
                      currentTab !== 'psp' ? 
                        `${user[0].first_name} ${user[0].flast_name} ${user[0].mlast_name || ''}` 
                      : 
                        profilesSelected[0].name? profilesSelected[0].name : 'N/A'
                    }
                  </Text>
                  <Text style={{ fontSize: 10, textAlign: 'left', marginTop: 5 }}>
                    {
                      currentTab !== 'psp' ? 
                        user[0].work_title ? 
                          `${user[0].work_title.name}` 
                        : 
                          'N/A' 
                      : 
                      profilesSelected[0]? profilesSelected[0].description : 'N/A'
                    }
                  </Text>
              </View>
            </View>
        </View>
      </View>
    )

    const SectionTablePerson = () => (
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
        > 
              <View 
                key={columns[0].title} 
                style={{
                  flex: `0 0 20%`,
                  backgroundColor: '#E9E9E9',
                  paddingLeft: '10px',
                  paddingTop: 10
                }}
              >
                <Text style={{fontSize: 10}}>{ columns[0].title }</Text>
              </View>
              <View 
                key={columns[1].title} 
                style={{
                  flex: `0 0 10%`,
                  backgroundColor: '#E9E9E9',
                  paddingLeft: '10px',
                  paddingTop: 10
                }}
              >
                <Text style={{fontSize: 10}}>{ columns[1].title }</Text>
              </View>
              <View 
                key={columns[2].title} 
                style={{
                  flex: `0 0 70%`,
                  backgroundColor: '#E9E9E9',
                  paddingLeft: '10px',
                  paddingTop: 10
                }}
              >
                <Text style={{fontSize: 10}}>{ columns[2].title }</Text>
              </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            backgroundColor: '#E9E9E9'
          }}        
        >
          {
            data.length > 0 && data.map((row, index) => (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 15,
                  marginBottom: data.length === index + 1 ? '10px' : 0
                }}               
              >
                <View style={{flex: '0 0 20%', paddingLeft: 10}}>
                  <Text style={{ fontSize: 10 }}>
                  {
                    row.competence.name
                  }
                  </Text>
                </View>
                <View style={{flex: '0 0 10%', textAlign: 'center'}}>
                  <Text style={{ fontSize: 10 }}>
                  {
                    row.level
                  }
                  </Text>
                </View>
                <View style={{flex: '0 0 70%', paddingLeft: 10,paddingRight: 10}}>
                  <Text style={{ fontSize: 10 }}>
                  {
                    row.description
                  }
                  </Text>
                </View>
              </View>
            ))
          }
        </View>
      </View>
    )

    const SectionTablePersonProfile = () => (
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row'            
          }}
        >
                        <View 
                key={columns[0].title} 
                style={{
                  flex: `0 0 15%`,
                  backgroundColor: '#E9E9E9',
                  paddingLeft: '10px',
                  paddingTop: 10
                }}
              >
                <Text style={{fontSize: 10}}>{ columns[0].title }</Text>
              </View>
              <View 
                key={columns[1].title} 
                style={{
                  flex: `0 0 10%`,
                  backgroundColor: '#E9E9E9',
                  paddingLeft: '10px',
                  paddingTop: 10
                }}
              >
                <Text style={{fontSize: 10}}>{ columns[1].title }</Text>
              </View>
              <View 
                key={columns[2].title} 
                style={{
                  flex: `0 0 25%`,
                  backgroundColor: '#E9E9E9',
                  paddingLeft: '10px',
                  paddingTop: 10
                }}
              >
                <Text style={{fontSize: 10}}>{ columns[2].title }</Text>
              </View>
              <View 
                key={columns[3].title} 
                style={{
                  flex: `0 0 10%`,
                  backgroundColor: '#E9E9E9',
                  paddingLeft: '10px',
                  paddingTop: 10
                }}
              >
                <Text style={{fontSize: 10}}>{ columns[3].title }</Text>
              </View>
              <View 
                key={columns[4].title} 
                style={{
                  flex: `0 0 25%`,
                  backgroundColor: '#E9E9E9',
                  paddingLeft: '10px',
                  paddingTop: 10
                }}
              >
                <Text style={{fontSize: 10}}>{ columns[4].title }</Text>
              </View>
              <View 
                key={columns[5].title} 
                style={{
                  flex: `0 0 15%`,
                  backgroundColor: '#E9E9E9',
                  paddingLeft: '10px',
                  paddingTop: 10
                }}
              >
                <Text style={{fontSize: 10}}>{ columns[5].title }</Text>
              </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            backgroundColor: '#E9E9E9'
          }}        
        >
          {
            data.length > 0 && data.map((row, index) => (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 15,
                  marginBottom: data.length === index + 1 ? '10px' : 0
                }}               
              >
                <View style={{flex: '0 0 15%', paddingLeft: 10}}>
                  <Text style={{ fontSize: 10 }}>
                  {
                    row.name
                  }
                  </Text>
                </View>
                <View style={{flex: '0 0 10%', textAlign: 'center'}}>
                  <Text style={{ fontSize: 10 }}>
                  {
                    row.level_person
                  }
                  </Text>
                </View>
                <View style={{flex: '0 0 25%', paddingRight: 10}}>
                  <Text style={{ fontSize: 10 }}>
                  {
                    row.description_person
                  }
                  </Text>
                  
                </View>
                <View style={{flex: '0 0 10%', paddingLeft: 10, textAlign: 'center'}}>
                  <Text style={{ fontSize: 10 }}>
                  {
                    row.level_profile
                  }
                  </Text>
                </View>
                <View style={{flex: '0 0 25%', textAlign: 'center'}}>
                  <Text style={{ fontSize: 10 }}>
                  {
                    row.description_profile
                  }
                  </Text>
                </View>
                <View style={{flex: '0 0 15%', textAlign: 'center',paddingRight: 10}}>
                  <Text style={{ fontSize: 10 }}>
                  {
                    row.compatibility !== 'N/A'? row.compatibility.toFixed(2) + '%' : 'N/A'
                  }
                  </Text>
                  
                </View>
              </View>
            ))
          }
        </View>
      </View>
    )

    const SectionPersonsProfile = () => (
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
        > 
              <View 
                key={columns[0].title} 
                style={{
                  flex: `0 0 20%`,
                  backgroundColor: '#E9E9E9',
                  paddingLeft: '10px',
                  paddingTop: 10
                  
                }}
              >
                <Text style={{fontSize: 10}}>{ columns[0].title }</Text>
              </View>
              <View 
                key={columns[1].title} 
                style={{
                  flex: `0 0 50%`,
                  backgroundColor: '#E9E9E9',
                  paddingLeft: '10px',
                  paddingTop: 10
                }}
              >
                <Text style={{fontSize: 10}}>{ columns[1].title }</Text>
              </View>
              <View 
                key={columns[2].title} 
                style={{
                  flex: `0 0 30%`,
                  backgroundColor: '#E9E9E9',
                  paddingLeft: '10px',
                  paddingTop: 10
                }}
              >
                <Text style={{fontSize: 10}}>{ columns[2].title }</Text>
              </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            backgroundColor: '#E9E9E9'
          }}        
        >
          {
            data.length > 0 && data.map((row, index) => (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 15,
                  marginBottom: data.length === index + 1 ? '10px' : 0
                }}               
              >
                <View style={{flex: '0 0 20%', paddingLeft: 10}}>
                  <Image 
                    src={{ 
                        uri: findPhoto(row.persons.id), 
                        method: "GET", 
                        headers: { 
                          "Cache-Control": "no-cache" }, 
                        body: ""
                    }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%'
                    }}                     
                  />
                </View>
                <View style={{flex: '0 0 50%', paddingLeft: 10, paddingTop: 15}}>
                  <Text style={{ fontSize: 10 }}>
                  {
                    row.persons.fullName
                  }
                  </Text>
                </View>
                <View style={{flex: '0 0 30%', paddingLeft: 10, paddingTop: 15}}>
                  <Text style={{ fontSize: 10 }}>
                  {
                    row.profiles[0].compatibility !== 'N/A'? row.profiles[0].compatibility.toFixed(2) + '%' : 'N/A'
                  }
                  </Text>
                </View>
              </View>
            ))
          }
        </View>
      </View>
    )

    const SectionPersonProfiles = () => (
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
        > 
              <View 
                key={columns[0].title} 
                style={{
                  flex: `0 0 50%`,
                  backgroundColor: '#E9E9E9',
                  paddingLeft: '10px',
                  paddingTop: 10
                  
                }}
              >
                <Text style={{fontSize: 10}}>{ columns[0].title }</Text>
              </View>
              <View 
                key={columns[1].title} 
                style={{
                  flex: `0 0 50%`,
                  backgroundColor: '#E9E9E9',
                  paddingLeft: '10px',
                  paddingTop: 10
                }}
              >
                <Text style={{fontSize: 10}}>{ columns[1].title }</Text>
              </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            backgroundColor: '#E9E9E9'
          }}        
        >
          {
            data.length > 0 && data.map((row, index) => (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 15,
                  marginBottom: data.length === index + 1 ? '10px' : 0
                }}               
              >
                <View style={{flex: '0 0 50%', paddingLeft: 10}}>
                  <Text style={{ fontSize: 10 }}>
                  {
                    row.name
                  }
                  </Text>
                </View>
                <View style={{flex: '0 0 50%', paddingLeft: 10}}>
                  <Text style={{ fontSize: 10 }}>
                  {
                    row.compatibility !== 'N/A'? row.compatibility.toFixed(2) + '%' : 'N/A'
                  }
                  </Text>
                </View>
              </View>
            ))
          }
        </View>        
      </View>
    )


    // const SectionDetails = () => (
    //     <View>
    //         <View style={{ marginBottom: 10}}>
    //             <Text style={{ fontSize: 14, fontWeight: 'bold' }} >Datos generales</Text>
    //         </View>
    //         <View
    //             style={{
    //                 backgroundColor: '#E9E9E9',
    //                 borderRadius: 8
    //             }}
    //         >
    //             <View style={{
    //                     display: 'flex',
    //                     flexWrap: 'wrap',
    //                     flexDirection: 'row',
    //                     padding: '6px 12px',
    //             }}>
    //                 <View style={{flex: '0 0 50%' }}>
    //                     <Text style={{ fontSize: 10 }}>Nombre: {infoCandidate?.first_name}</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 50%' }}>
    //                     <Text style={{ fontSize: 10 }}>Apellidos: {infoCandidate?.last_name}</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 50%' }}>
    //                     <Text style={{ fontSize: 10 }}>Fecha de nacimiento: {infoCandidate?.birthdate? moment(infoCandidate?.birthdate).format('DD-MM-YYYY'): ''}</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 50%' }}>
    //                     <Text style={{ fontSize: 10 }}>Correo electrónico: {infoCandidate?.email}</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 50%' }}>
    //                     <Text style={{ fontSize: 10 }}>Celular: {infoCandidate?.cell_phone}</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 50%' }}>
    //                     <Text style={{ fontSize: 10 }}>Teléfono fijo: {infoCandidate?.telephone}</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 50%' }}>
    //                     <Text style={{ fontSize: 10 }}>Estado: {infoCandidate?.state?.name}</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 50%' }}>
    //                     <Text style={{ fontSize: 10 }}>Municipio: {infoCandidate?.municipality}</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 50%' }}>
    //                     <Text style={{ fontSize: 10 }}>Dirección: {infoCandidate?.street_address}</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 50%' }}>
    //                     <Text style={{ fontSize: 10 }}>Código postal: {infoCandidate?.postal_code}</Text>
    //                 </View>
    //                 <View style={{ flex: '0 0 100%', borderBottom: '1px solid rgb(17 24 39)', marginTop: 20, marginBottom: 10 }}></View>
    //             </View>
    //             <View
    //                 style={{
    //                     display: 'flex',
    //                     flexWrap: 'wrap',
    //                     flexDirection: 'row',
    //                     padding: '6px 12px',
    //                     marginBottom: 10
    //             }}
    //             >
    //                 <View style={{
    //                     flex: '0 0 100%',
    //                     display: 'flex',
    //                     alignItems: 'center',
    //                     flexWrap: 'wrap',
    //                     flexDirection: 'row', }}>
    //                     <Text style={{ fontSize: 10, marginRight: 15 }}>Idiomas: </Text>
    //                     {
    //                         infoCandidate?.languages.length > 0 &&

    //                         infoCandidate.languages.map((lang) => (
    //                             <Text 
    //                                 key={lang.id} 
    //                                 style={{
    //                                     fontSize: 10,
    //                                     padding: '3px 5px',
    //                                     backgroundColor: '#FFF',
    //                                     marginRight: 5,
    //                                     borderRadius: 5
    //                                 }}
    //                             > 
    //                                 { lang && listLanguages.find((lg) =>  lg.value === lang.lang ).label + ' ' } 
    //                                 / 
    //                                 { lang && ' ' + listLanguages.find((lg) => lg.value === lang.lang ).children.find((dom) => dom.value === lang.domain).label } 
    //                             </Text>
    //                         ))
    //                     }
    //                 </View>
    //             </View>
    //             <View
    //                style={{
    //                    display: 'flex',
    //                    flexWrap: 'wrap',
    //                    flexDirection: 'row',
    //                    padding: '6px 12px',
    //                 }}
    //             >
    //                 <View style={{flex: '0 0 100%', marginBottom: 10 }}>
    //                     <Text style={{ fontSize: 10 }}>Acerca de tí:</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 100%', backgroundColor: '#FFF', padding: '6px 12px', border: '1px solid gray', borderRadius: 5, marginBottom: 10 }}>
    //                     <Text style={{ fontSize: 10 }}>
    //                     {
    //                         infoCandidate?.about_me
    //                     }
    //                     </Text>
    //                 </View>
    //             </View>
    //         </View>
    //     </View>
    // )

    // const SectionEducation = () => (
    //     <View style={{ marginTop: 20 }}>
    //         <View style={{ marginBottom: 10}}>
    //             <Text style={{ fontSize: 14, fontWeight: 'bold' }} >Educación</Text>
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
    //                 <View style={{flex: '0 0 15%', border: '1px solid', textAlign: 'center' }}>
    //                     <Text style={{ fontSize: 10 }}>Escolaridad</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 15%', border: '1px solid', textAlign: 'center' }}>
    //                     <Text style={{ fontSize: 10 }}>Carrera</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 20%', border: '1px solid', textAlign: 'center' }}>
    //                     <Text style={{ fontSize: 10 }}>Estatus</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 20%', border: '1px solid', textAlign: 'center' }}>
    //                     <Text style={{ fontSize: 10 }}>Fecha de finalización</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 30%', border: '1px solid', textAlign: 'center' }}>
    //                     <Text style={{ fontSize: 10 }}>Nombre de la institucion</Text>
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
    //                     infoEducation?.length > 0 && infoEducation.map((inst) => (

    //                     <View 
    //                          key={inst.id}
    //                         style={{ 
    //                             backgroundColor: '#FFF',
    //                             display: 'flex',
    //                             flexWrap: 'wrap',
    //                             flexDirection: 'row',
    //                             borderRadius: 10,
    //                             marginBottom: 5
    //                         }}
    //                     >
    //                         <View style={{flex: '0 0 15%', border: '1px solid', textAlign: 'center' }}>
    //                             <Text style={{ fontSize: 10 }}> { inst?.study_level?.name } </Text>
    //                         </View>
    //                         <View style={{flex: '0 0 15%', border: '1px solid', textAlign: 'center' }}>
    //                             <Text style={{ fontSize: 10 }}> { inst?.specialitation_area } </Text>
    //                         </View>
    //                         <View style={{flex: '0 0 20%', border: '1px solid', textAlign: 'center' }}>
    //                             <Text style={{ fontSize: 10 }}> { inst && list_status.find((sch) => sch.value == inst.status).label } </Text>
    //                         </View>
    //                         <View style={{flex: '0 0 20%', border: '1px solid', textAlign: 'center' }}>
    //                             <Text style={{ fontSize: 10 }}> { inst?.end_date && moment(inst.end_date).format('DD-MM-YYYY') } </Text>
    //                         </View>
    //                         <View style={{flex: '0 0 30%', border: '1px solid', textAlign: 'center' }}>
    //                             <Text style={{ fontSize: 10 }}> { inst?.institution_name } </Text>
    //                         </View>
    //                     </View>
    //                     ))
    //                 }

    //             </View>
    //         </View>
    //     </View>
    // )

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
    //                 <View style={{flex: '0 0 25%', textAlign: 'center' }}>
    //                     <Text style={{ fontSize: 10 }}>Categoría</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 25%', textAlign: 'center' }}>
    //                     <Text style={{ fontSize: 10 }}>Subcategoría</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 20%', textAlign: 'center' }}>
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
    //                             marginBottom: 5,
    //                             flex: '0 0 70%',
    //                             maxHeight: 12
    //                         }}
    //                     >
    //                         <View style={{flex: '0 0 35%', textAlign: 'center' }}>
    //                             <Text style={{ fontSize: 10 }}> { info?.category?.name } </Text>
    //                         </View>
    //                         <View style={{flex: '0 0 35%', textAlign: 'center' }}>
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
    //                 <View style={{flex: '0 0 15%', textAlign: 'center' }}>
    //                     <Text style={{ fontSize: 10, }}>Puesto</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 15%', textAlign: 'center' }}>
    //                     <Text style={{ fontSize: 10, }}>Empresa</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 25%', textAlign: 'center' }}>
    //                     <Text style={{ fontSize: 10, }}>Sector</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 20%', textAlign: 'center' }}>
    //                     <Text style={{ fontSize: 10, }}>Fecha de inicio</Text>
    //                 </View>
    //                 <View style={{flex: '0 0 25%', textAlign: 'center' }}>
    //                     <Text style={{ fontSize: 10, }}>Fecha de finalización</Text>
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
    //                             marginBottom: 5
    //                         }}
    //                     >
    //                         <View style={{flex: '0 0 15%', textAlign: 'center' }}>
    //                             <Text style={{ fontSize: 10 }}> { inst?.position_name } </Text>
    //                         </View>
    //                         <View style={{flex: '0 0 15%', textAlign: 'center' }}>
    //                             <Text style={{ fontSize: 10 }}> { inst?.company } </Text>
    //                         </View>
    //                         <View style={{flex: '0 0 25%', textAlign: 'center' }}>
    //                             <Text style={{ fontSize: 10 }}> { inst?.sector?.name } </Text>
    //                         </View>
    //                         <View style={{flex: '0 0 20%', textAlign: 'center' }}>
    //                             <Text style={{ fontSize: 10 }}> { inst?.start_date && moment(inst.start_date).format('DD-MM-YYYY') } </Text>
    //                         </View>
    //                         <View style={{flex: '0 0 25%', textAlign: 'center' }}>
    //                             <Text style={{ fontSize: 10 }}> { inst?.end_date && moment(inst.end_date).format('DD-MM-YYYY')} </Text>
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
                      display : 'flex', 
                      justifyContent: 'center',
                    }}
                  >
                      <SectionProfileCard />
                      {
                        currentTab === 'p' && (
                          <SectionTablePerson />
                        )
                      }
                      {
                        currentTab === 'pp' && (
                          <SectionTablePersonProfile />
                        )
                      }
                      {
                        currentTab === 'psp' && (
                          <SectionPersonsProfile />
                        )
                      }
                      {
                        currentTab === 'pps' && (
                          <SectionPersonProfiles />
                        )
                      }
                  </View>
                {/* <View
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
                        {/* <View style={{ flex:'0 0 auto' }}>
                            <Image 
                                src={{ 
                                    uri: image, 
                                    method: "GET", 
                                    headers: { 
                                        "Cache-Control": "no-cache" }, 
                                    body: "" }} 
                                style={{
                                    width: widthAndHeight.width > widthAndHeight.height ? widthImage  : '30px',
                                    height: '30px',
                                }}
                            />
                        </View> */}
                    {/* </View>
                    <View
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        <Text>Información del candidato</Text>
                    </View> */}
                {/* </View>  */}
                {/* <SectionProfileCard /> */}

                    {/* <SectionDetails />
                    <SectionEducation />
                    <SectionExperience />
                    <SectionUltimateJobs /> */}
                    
                </Page>
            </Document>
        // </PDFViewer>
    )
}

export default memo(PDFReport);
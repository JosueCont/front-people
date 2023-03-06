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
import { getWork } from '../../../utils/functions';

const PDFReport = ({
  user = [],
  currentTab = '',
  columns = [],
  data = [],
  profilesSelected = [],
  listReports = []
}) => {
    
    const findPhoto = (id) => {
        let userSelected = user.find((us) => us.id === id);
        return userSelected?.photo
            ? userSelected.photo
            : userSelected?.photo_thumbnail
            ? userSelected?.photo_thumbnail
            : '/images/usuario.png';
    }

    const SectionProfileCard = () => (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: '50px',
            marginBottom: 5
        }}>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                {currentTab !== 'psp' && (
                    <Image 
                        src={{ 
                            uri: user[0]?.photo
                                ? user[0].photo : user[0]?.photo_thumbnail
                                ? user[0].photo_thumbnail : '/images/usuario.png', 
                            method: "GET", 
                            headers: {"Cache-Control": "no-cache" }, 
                            body: ""
                        }}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%'
                        }}
                    />
                )}
                <View style={{
                    marginLeft: currentTab !== 'psp' ? 8 : 0,
                    display: 'flex', 
                    flexDirection: 'column',
                    // flex: '0 1 50%'
                }}>
                    <Text style={{fontSize: 14}}>
                        {currentTab !== 'psp'
                            ? `${user[0]?.first_name} ${user[0]?.flast_name} ${user[0]?.mlast_name || ''}` 
                            : profilesSelected[0]?.name? profilesSelected[0]?.name : 'N/A'
                        }
                    </Text>
                    <Text
                        style={{
                            fontSize: 10,
                            textAlign: 'left',
                            marginTop: 3,
                            color: 'rgba(0,0,0,0.5)'
                        }}
                    >
                        {currentTab !== 'psp'
                            ? getWork(user[0] ?? {})
                            : profilesSelected[0] ? profilesSelected[0]?.description : 'N/A'
                        }
                    </Text>
                </View>
            </View>
            {currentTab == 'pp' && (
                <View style={{
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'center'
                }}>
                    <Text style={{fontSize: 14}}>
                        {profilesSelected[0]?.name}
                    </Text>
                    <Text style={{
                        fontSize: 10,
                        marginTop: 3,
                        color: 'rgba(0,0,0,0.5)'
                    }}>
                        Compatibilidad: {listReports[0]?.profiles[0]?.compatibility
                            ? listReports[0]?.profiles[0]?.compatibility.toFixed(2) + "%"
                            : null
                        }
                    </Text>
                </View>
            )}
        </View>
    )

    const SectionTablePerson = () => (
        <>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: '#E9E9E9',
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderBottom: '1px solid #d9d9d9'
            }}> 
                <View style={{
                    flex: `0 0 20%`,
                    borderRight: '1px solid #d9d9d9'
                }}>
                    <Text style={{fontSize: 10}}>{columns[0].title}</Text>
                </View>
                <View style={{
                    flex: `0 0 10%`,
                    borderRight: '1px solid #d9d9d9',
                    paddingLeft: 5
                }}>
                    <Text style={{fontSize: 10}}>{columns[1].title}</Text>
                </View>
                <View style={{
                    flex: `0 0 70%`,
                    paddingLeft: 5
                }}>
                    <Text style={{fontSize: 10}}>{columns[2].title}</Text>
                </View>
            </View>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                backgroundColor: '#0000000f'
            }}>
                {data.length > 0 && data.map((row, index) => (
                    <View
                        key={index}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: '1px solid #d9d9d9'
                        }}               
                    >
                        <View style={{flex: '0 0 20%'}}>
                            <Text style={{ fontSize: 10 }}>
                                {row.competence.name}
                            </Text>
                        </View>
                        <View style={{flex: '0 0 10%', paddingLeft: 5}}>
                            <Text style={{ fontSize: 10 }}>
                                {row.level}
                            </Text>
                        </View>
                        <View style={{flex: '0 0 70%', paddingLeft: 5}}>
                            <Text style={{ fontSize: 10 }}>
                                {row.description}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </>
    )

    const SectionTablePersonProfile = () => (
        <>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: '#E9E9E9',
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderBottom: '1px solid #d9d9d9'
            }}>
                <View style={{
                    flex: `0 0 15%`,
                    borderRight: '1px solid #d9d9d9'
                }}>
                    <Text style={{fontSize: 10}}>{columns[0].title }</Text>
                </View>
                <View style={{
                    flex: `0 0 10%`,
                    borderRight: '1px solid #d9d9d9',
                    paddingLeft: 5,
                }}>
                    <Text style={{fontSize: 10}}>{columns[1].title}</Text>
                </View>
                <View style={{
                    flex: `0 0 28%`,
                    borderRight: '1px solid #d9d9d9',
                    paddingLeft: 5,
                }}>
                    <Text style={{fontSize: 10}}>{ columns[2].title }</Text>
                </View>
                <View style={{
                    flex: `0 0 9%`,
                    borderRight: '1px solid #d9d9d9',
                    paddingLeft: 5
                }}>
                    <Text style={{fontSize: 10}}>{ columns[3].title }</Text>
                </View>
                <View style={{
                    flex: `0 0 28%`,
                    borderRight: '1px solid #d9d9d9',
                    paddingLeft: 5,
                }}>
                    <Text style={{fontSize: 10}}>{ columns[4].title }</Text>
                </View>
                <View style={{
                    flex: `0 0 10%`,
                    paddingLeft: 5
                }}>
                    <Text style={{fontSize: 10}}>{ columns[5].title }</Text>
                </View>
            </View>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                backgroundColor: '#0000000f'
            }}>
                {data.length > 0 && data.map((row, index) => (
                    <View
                        key={index}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderBottom: '1px solid #d9d9d9'
                        }}             
                    >
                        <View style={{flex: '0 0 15%', paddingRight: 5}}>
                            <Text style={{ fontSize: 10 }}>
                                {row.name}
                            </Text>
                        </View>
                        <View style={{flex: '0 0 10%', paddingLeft: 5}}>
                            <Text style={{ fontSize: 10 }}>
                                {row.level_person}
                            </Text>
                        </View>
                        <View style={{flex: '0 0 28%', paddingRight: 5, paddingRight: 5}}>
                            <Text style={{ fontSize: 10, wordBreak: 'break-word'}}>
                                {row.description_person}
                            </Text>
                        </View>
                        <View style={{flex: '0 0 9%', paddingLeft: 5}}>
                            <Text style={{ fontSize: 10 }}>
                                {row.level_profile}
                            </Text>
                        </View>
                        <View style={{flex: '0 0 28%', paddingLeft: 5, paddingRight: 5}}>
                            <Text style={{ fontSize: 10 }}>
                                {row.description_profile}
                            </Text>
                        </View>
                        <View style={{flex: '0 0 10%', paddingLeft: 5}}>
                            <Text style={{ fontSize: 10 }}>
                                {row.compatibility !== 'N/A'? row.compatibility.toFixed(2) + '%' : 'N/A'}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </>
    )

    const SectionPersonsProfile = () => (
      <>
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#E9E9E9',
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
            borderBottom: '1px solid #d9d9d9'
        }}> 
            <View style={{
                flex: `0 0 15%`,
                borderRight: '1px solid #d9d9d9',
            }}>
                <Text style={{fontSize: 10}}>{ columns[0].title }</Text>
            </View>
            <View style={{
                flex: `0 0 55%`,
                borderRight: '1px solid #d9d9d9',
                paddingLeft: 5,
            }}>
                <Text style={{fontSize: 10}}>{ columns[1].title }</Text>
            </View>
            <View style={{
                flex: `0 0 30%`,
                paddingLeft: 5,
            }}>
                <Text style={{fontSize: 10}}>{ columns[2].title }</Text>
            </View>
        </View>
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            backgroundColor: '#0000000f'
        }}>
            {data.length > 0 && data.map((row, index) => (
                <View
                    key={index}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
                        borderBottom: '1px solid #d9d9d9'
                    }}              
                >
                    <View style={{flex: '0 0 15%'}}>
                        <Image 
                            src={{ 
                                uri: findPhoto(row.persons.id), 
                                method: "GET", 
                                headers: { "Cache-Control": "no-cache" }, 
                                body: ""
                            }}
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%'
                            }}                     
                        />
                    </View>
                    <View style={{flex: '0 0 55%', paddingLeft: 5, justifyContent: 'center'}}>
                        <Text style={{ fontSize: 10 }}>
                            {row.persons.fullName}
                        </Text>
                    </View>
                    <View style={{flex: '0 0 30%', paddingLeft: 5, justifyContent: 'center'}}>
                        <Text style={{ fontSize: 10 }}>
                            { row.profiles[0].compatibility !== 'N/A'? row.profiles[0].compatibility.toFixed(2) + '%' : 'N/A'}
                        </Text>
                    </View>
                </View>
            ))}
        </View>
      </>
    )

    const SectionPersonProfiles = () => (
      <>
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#E9E9E9',
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
            borderBottom: '1px solid #d9d9d9'
        }}> 
            <View style={{
                flex: `0 0 75%`,
                borderRight: '1px solid #d9d9d9',
            }}>
                <Text style={{fontSize: 10}}>{ columns[0].title }</Text>
            </View>
            <View style={{
                flex: `0 0 25%`,
                paddingLeft: 5
            }}>
                <Text style={{fontSize: 10}}>{ columns[1].title }</Text>
            </View>
        </View>
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            backgroundColor: '#0000000f'
        }}>
            {data.length > 0 && data.map((row, index) => (
                <View
                    key={index}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
                        borderBottom: '1px solid #d9d9d9'
                    }}                
                >
                    <View style={{flex: '0 0 75%'}}>
                        <Text style={{ fontSize: 10 }}>
                            {row.name}
                        </Text>
                    </View>
                    <View style={{flex: '0 0 25%', paddingLeft: 5}}>
                        <Text style={{ fontSize: 10 }}>
                            {row.compatibility !== 'N/A'? row.compatibility.toFixed(2) + '%' : 'N/A'}
                        </Text>
                    </View>
                </View>
            ))}
        </View>        
      </>
    )

    return (
        // <PDFViewer style={{width: '100%', minHeight: '100vh'}}>
            <Document title='Reporte'>
                <Page
                    orientation={currentTab == 'pp' ? 'landscape' : 'portrait'}
                    size='LETTER'
                    style={{padding: 24}}
                    wrap={true}
                >
                    <SectionProfileCard />
                    {currentTab === 'p' && <SectionTablePerson />}
                    {currentTab === 'pp' && <SectionTablePersonProfile />}
                    {currentTab === 'psp' && <SectionPersonsProfile />}
                    {currentTab === 'pps' && <SectionPersonProfiles />}
                </Page>
            </Document>
        // </PDFViewer>
    )
}

export default PDFReport;
import React, { useEffect, useState, memo } from 'react';
import {
    View,
    Text,
    Image,
    Document,
    Page,
    PDFViewer,
} from '@react-pdf/renderer';
import { optionsBusinessName } from '../../../utils/constant';

const DocExpedient = ({
    infoClient,
    contactList,
}) => {

    console.log('infoClient', infoClient)
    console.log('contactList', contactList)

    const SectionDetails = () => (
        <View>
            <View style={{ marginBottom: 10}}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }} >Datos generales</Text>
            </View>
            <View
                style={{
                    backgroundColor: '#E9E9E9',
                    borderRadius: 8
                }}
            >
                <View style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        padding: '6px 12px',
                }}>
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>Nombre del cliente: {infoClient?.name}</Text>
                    </View>
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>RFC del cliente: {infoClient?.rfc}</Text>
                    </View>
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>Sector: {infoClient?.sector || ""}</Text>
                    </View>
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>Url de si sitio: {infoClient?.website}</Text>
                    </View>
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>Razon social: {infoClient?.business_name && optionsBusinessName.find((op) => op.value == infoClient.business_name).label}</Text>
                    </View>
                    <View style={{ flex: '0 0 100%', borderBottom: '1px solid rgb(17 24 39)', marginTop: 20, marginBottom: 10 }}></View>
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
                        <Text style={{ fontSize: 10 }}>Descripcion del cliente:</Text>
                    </View>
                    <View style={{flex: '0 0 100%', backgroundColor: '#FFF', padding: '6px 12px', border: '1px solid gray', borderRadius: 5, marginBottom: 10 }}>
                        <Text style={{ fontSize: 10 }}>
                        {
                            infoClient?.description
                        }
                        </Text>
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
                        <Text style={{ fontSize: 10 }}>Comentarios adicionales:</Text>
                    </View>
                    <View style={{flex: '0 0 100%', backgroundColor: '#FFF', padding: '6px 12px', border: '1px solid gray', borderRadius: 5, marginBottom: 10 }}>
                        <Text style={{ fontSize: 10 }}>
                        {
                            infoClient?.comments
                        }
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )

    const SectionContactList = () => (
        <View style={{ marginTop: 20 }}>
            <View style={{ marginBottom: 10}}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }} >Lista de contactos</Text>
            </View>
            <View
                style={{
                    backgroundColor: '#E9E9E9',
                    borderRadius: 8
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
                    <View style={{flex: '0 0 25%', border: '1px solid', textAlign: 'left' }}>
                        <Text style={{ fontSize: 10 }}>Nombre</Text>
                    </View>
                    <View style={{flex: '0 0 25%', border: '1px solid', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10 }}>Puesto</Text>
                    </View>
                    <View style={{flex: '0 0 25%', border: '1px solid', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10 }}>Correo</Text>
                    </View>
                    <View style={{flex: '0 0 25%', border: '1px solid', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10 }}>Teléfono</Text>
                    </View>
                </View>
                <View
                    style={{
                        padding: '6px 12px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                    }}
                >
                    {
                        contactList?.length > 0 && contactList.map((cont, index) => (

                        <View 
                             key={index}
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
                            <View style={{flex: '0 0 25%', border: '1px solid', textAlign: 'left' }}>
                                <Text style={{ fontSize: 10 }}> { cont?.name } </Text>
                            </View>
                            <View style={{flex: '0 0 25%', border: '1px solid', textAlign: 'center' }}>
                                <Text style={{ fontSize: 10 }}> { cont?.job_position } </Text>
                            </View>
                            <View style={{flex: '0 0 25%', border: '1px solid', textAlign: 'center' }}>
                                <Text style={{ fontSize: 10 }}> { cont?.email } </Text>
                            </View>
                            <View style={{flex: '0 0 25%', border: '1px solid', textAlign: 'center' }}>
                                <Text style={{ fontSize: 10 }}> { cont?.phone } </Text>
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
                            textAlign: 'center'
                        }}
                    >
                        <Text>Información del cliente</Text>
                    </View>
                </View>
                <SectionDetails />
                <SectionContactList />
                </Page>
            </Document>
        // </PDFViewer>
    )
}

export default memo(DocExpedient);
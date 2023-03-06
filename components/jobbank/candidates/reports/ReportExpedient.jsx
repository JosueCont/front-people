import React, { useEffect, useState, memo, useMemo } from 'react';
import {
    View,
    Text,
    Image,
    Document,
    Page,
    PDFViewer,
} from '@react-pdf/renderer';
import moment from 'moment';
import {
    optionsStatusAcademic,
    optionsLangVacant,
    optionsDomainLang
} from '../../../../utils/constant';

const ReportExpedient = ({
    infoCandidate,
    infoEducation,
    infoExperience,
    infoPositions,
    image, 
    widthAndHeight
}) => {

    const [marginTop, setMarginTop ] = useState(80)
    const widthImage = widthAndHeight.width > 100 ? '100px' : widthAndHeight.width

    useEffect(() => {
        if(infoCandidate && infoCandidate.about_me && infoCandidate.about_me.length > 0){
            if(infoCandidate.about_me.length > 100){
                setMarginTop(marginTop - 30)
            } else {
                setMarginTop(marginTop + 10)
            }
        }
    },[infoCandidate])

    useEffect(() => {
        if (infoExperience && infoExperience.length > 0) {
            if (infoExperience.length > 2) {
                setMarginTop(marginTop - 25)
            }
        }
    },[infoExperience])

    useEffect(() => {
        if(infoEducation && infoEducation.length > 0){
            if(infoEducation.length <= 3){
                setMarginTop(marginTop + 25)
            }
        }
    },[infoCandidate])

    const getLang = (lang) =>{
        const find_ = item => item.value == lang;
        let result = optionsLangVacant.find(find_);
        return result.label;
    }

    const getDomain = (dom) =>{
        const find_ = item => item.value == dom;
        let result = optionsDomainLang.find(find_);
        return result.label;
    }

    const getStatus = (inst) =>{
        const find_ = item => item.value == inst.status;
        let result = optionsStatusAcademic.find(find_);
        return result.label;
    }

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
                <View
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        padding: '6px 12px',
                    }}
                >
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>Nombre: {infoCandidate?.first_name}</Text>
                    </View>
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>Apellidos: {infoCandidate?.last_name}</Text>
                    </View>
                    <View style={{flex: '0 0 50%' }}>
                        <Text style={{ fontSize: 10 }}>Fecha de nacimiento: {infoCandidate?.birthdate? moment(infoCandidate?.birthdate).format('DD-MM-YYYY'): ''}</Text>
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
                    <View 
                        tyle={{
                            flex: '0 0 100%',
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            flexDirection: 'row'
                        }}
                    >
                        <Text style={{ fontSize: 10, marginRight: 15 }}>Idiomas: </Text>
                        {infoCandidate?.languages.length > 0 && infoCandidate.languages.map((lang) => (
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
                                {getLang(lang.lang)} / {getDomain(lang.domain)} 
                            </Text>
                        ))}
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
                            {infoCandidate?.about_me}
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
                    <View style={{flex: '0 0 15%', border: '1px solid', textAlign: 'center' }}>
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
                <View
                    style={{
                        padding: '6px 12px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                    }}
                >
                    {infoEducation?.length > 0 && infoEducation.map((inst) => (
                        <View 
                            key={inst.id}
                            style={{ 
                                backgroundColor: '#FFF',
                                display: 'flex',
                                flexWrap: 'wrap',
                                flexDirection: 'row',
                                borderRadius: 10,
                                marginBottom: 5
                            }}
                        >
                            <View style={{flex: '0 0 15%', border: '1px solid', textAlign: 'center' }}>
                                <Text style={{ fontSize: 10 }}> { inst?.study_level?.name } </Text>
                            </View>
                            <View style={{flex: '0 0 15%', border: '1px solid', textAlign: 'center' }}>
                                <Text style={{ fontSize: 10 }}> { inst?.specialitation_area } </Text>
                            </View>
                            <View style={{flex: '0 0 20%', border: '1px solid', textAlign: 'center' }}>
                                <Text style={{ fontSize: 10 }}> { inst && getStatus(inst) } </Text>
                            </View>
                            <View style={{flex: '0 0 20%', border: '1px solid', textAlign: 'center' }}>
                                <Text style={{ fontSize: 10 }}> { inst?.end_date && moment(inst.end_date).format('DD-MM-YYYY') } </Text>
                            </View>
                            <View style={{flex: '0 0 30%', border: '1px solid', textAlign: 'center' }}>
                                <Text style={{ fontSize: 10 }}> { inst?.institution_name } </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    )

    const SectionExperience = () => (
        <View style={{ marginTop: 20 }}>
            <View style={{ marginBottom: 10}}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }} >Experiencia y especialización</Text>
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
                    <View style={{flex: '0 0 25%', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10 }}>Categoría</Text>
                    </View>
                    <View style={{flex: '0 0 25%', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10 }}>Subcategoría</Text>
                    </View>
                    <View style={{flex: '0 0 20%', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10 }}>Años de experiencia</Text>
                    </View>
                    <View style={{flex: '0 0 30%', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10 }}>Competencias</Text>
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
                    {infoExperience?.length > 0 && infoExperience.map((info) => (
                        <>
                            <View 
                                key={info.id}
                                style={{ 
                                    backgroundColor: '#FFF',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    flexDirection: 'row',
                                    borderRadius: 10,
                                    marginBottom: 5,
                                    flex: '0 0 70%',
                                    maxHeight: 12
                                }}
                            >
                                <View style={{flex: '0 0 35%', textAlign: 'center' }}>
                                    <Text style={{ fontSize: 10 }}> { info?.category?.name } </Text>
                                </View>
                                <View style={{flex: '0 0 35%', textAlign: 'center' }}>
                                    <Text style={{ fontSize: 10 }}>{ info?.sub_category?.name }</Text>
                                </View>
                                <View style={{flex: '0 0 30%', textAlign: 'center' }}>
                                    <Text style={{ fontSize: 10 }}> { info?.experience_years } </Text>
                                </View>
                            </View>
                            <View
                                style={{ 
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    flexDirection: 'row',
                                    padding: '0px 6px',
                                    marginBottom: 5,
                                    flex: '0 0 30%'
                                }}
                            >
                                {info?.competences?.length > 0 && info.competences.map((comp) => (
                                    <View key={comp.id} style={{ textAlign: 'center', backgroundColor: '#FFF', borderRadius: 10, marginRight: 3, marginBottom: 3 }}>
                                        <Text style={{ fontSize: 10 }}> { comp.name } </Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    ))}
                </View>
            </View>
        </View>
    )

    const SectionUltimateJobs = () => (
        <View style={{ marginTop: marginTop }}>
            <View style={{ marginBottom: 10}}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }} >Últimos puestos</Text>
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
                    <View style={{flex: '0 0 15%', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10, }}>Puesto</Text>
                    </View>
                    <View style={{flex: '0 0 15%', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10, }}>Empresa</Text>
                    </View>
                    <View style={{flex: '0 0 25%', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10, }}>Sector</Text>
                    </View>
                    <View style={{flex: '0 0 20%', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10, }}>Fecha de inicio</Text>
                    </View>
                    <View style={{flex: '0 0 25%', textAlign: 'center' }}>
                        <Text style={{ fontSize: 10, }}>Fecha de finalización</Text>
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
                    {infoPositions?.length > 0 && infoPositions.map((inst) => (
                        <View 
                            key={inst.id}
                            style={{ 
                                backgroundColor: '#FFF',
                                display: 'flex',
                                flexWrap: 'wrap',
                                flexDirection: 'row',
                                borderRadius: 10,
                                marginBottom: 5
                            }}
                        >
                            <View style={{flex: '0 0 15%', textAlign: 'center' }}>
                                <Text style={{ fontSize: 10 }}> { inst?.position_name } </Text>
                            </View>
                            <View style={{flex: '0 0 15%', textAlign: 'center' }}>
                                <Text style={{ fontSize: 10 }}> { inst?.company } </Text>
                            </View>
                            <View style={{flex: '0 0 25%', textAlign: 'center' }}>
                                <Text style={{ fontSize: 10 }}> { inst?.sector?.name } </Text>
                            </View>
                            <View style={{flex: '0 0 20%', textAlign: 'center' }}>
                                <Text style={{ fontSize: 10 }}> { inst?.start_date && moment(inst.start_date).format('DD-MM-YYYY') } </Text>
                            </View>
                            <View style={{flex: '0 0 25%', textAlign: 'center' }}>
                                <Text style={{ fontSize: 10 }}> { inst?.end_date && moment(inst.end_date).format('DD-MM-YYYY')} </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    )

    return (
        // <PDFViewer showToolbar={false} style={{width: '100%', minHeight: '100vh'}}>
            <Document title='Expediente'>
                <Page size='LETTER' style={{padding: 24}} wrap={true}>
                <View style={{marginBottom: 30}}>
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
                                    width: widthAndHeight.width > widthAndHeight.height ? widthImage  : '30px',
                                    height: '30px',
                                }}
                            />
                        </View>
                    </View>
                    <View style={{textAlign: 'center'}}>
                        <Text>Información del candidato</Text>
                    </View>
                </View>
                <SectionDetails />
                <SectionEducation />
                <SectionExperience />
                <SectionUltimateJobs />
                </Page>
            </Document>
        // </PDFViewer>
    )
}

export default memo(ReportExpedient);
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

    const formatNeed = 'DD-MM-YYYY';
    const formatRecive = 'YYYY-MM-DD';
    const [marginTop, setMarginTop ] = useState(80)
    const widthImage = widthAndHeight?.width > 100 ? '100px' : widthAndHeight?.width

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

    const FieldCandidate = ({name = '', value = ''}) =>(
        <View style={{flex: '0 0 50%', fontSize: 10, marginBottom: 2}}>
            <Text>{name}: <Text style={{color: 'rgba(0,0,0,0.5)'}}>{value}</Text></Text>
        </View>
    )

    const cleanKey = (key = '') =>{
        let withoutSpace = key.includes(' ') ? key?.replace(/\s/g,'') : key;
        return withoutSpace.includes(',') ? withoutSpace.split(',') : [withoutSpace];
    }

    const accessValue = (key = '', item) =>{
        let keysArray = cleanKey(key);
        return keysArray.reduce((acc, current) =>{
            if(!acc) return null;
            return acc[current] ?? null;
        }, item)
    }

    const getValue = (key, item) =>{
        if(!key.trim()) return null;
        return accessValue(key, item);
    }

    const HeaderTable = ({fields = []}) =>(
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            padding: '5px 10px',
            borderBottom: '1px solid #d9d9d9',
            backgroundColor: '#E9E9E9',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8
        }}>
            {fields.map((item, index) => (
                <View key={index} style={{
                    flex: `0 0 ${item.size}`,
                    borderRight: item.border ? item.border : '1px solid #d9d9d9',
                    paddingLeft: item.pleft ? item.pleft : 5
                }}>
                    <Text style={{fontSize: 10}}>
                        {item.name}
                    </Text>
                </View>
            ))}
        </View> 
    )

    const RowTable = ({children, isLast = false}) => (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#0000000f',
            padding: '5px 10px',
            borderBottom: '1px solid #d9d9d9',
            borderBottomLeftRadius: isLast ? 8 : 0,
            borderBottomRightRadius: isLast ? 8 : 0
        }}>
            {children}
        </View>
    )

    const BodyTable = ({data = [], cells = []}) => (
        <>
            {data.length > 0 ? data.map((item, index) => (
                <RowTable key={`row_${index}`} isLast={data.length == (index + 1)}>
                    {cells.map((record, idx) => (
                        <View key={`row_${index}_${idx}`} style={{
                            flex: `0 0 ${record.size}`,
                            paddingLeft: record.pleft ? record.pleft: 5
                        }}>
                            <Text style={{ fontSize: 10, textAlign: record.center ? 'center':  'left'}}>
                                {typeof record.key == 'function'
                                    ? record.key(item)
                                    : getValue(record.key, item)
                                }
                            </Text>
                        </View>
                    ))}
                </RowTable>
            )) : (
                <RowTable isLast={true}>
                    <Text style={{
                        color: '#cccc',
                        fontSize: 10,
                        textAlign: 'center',
                        width: '100%'
                    }}>
                        Sin información
                    </Text>
                </RowTable>
            )}
        </>
    )

    const TagLang = ({children, isPlaceholder = false}) => (
        <Text style={{
            lineHeight: 1,
            fontSize: 10,
            padding: '3px 5px',
            backgroundColor: '#ffff',
            marginRight: 5,
            borderRadius: 5,
            color: isPlaceholder ? '#d9d9d9' : 'black'
        }}> 
            {children} 
        </Text>
    )

    const SectionDetails = () => (
        <>
            <View style={{ marginBottom: 8}}>
                <Text style={{fontSize: 14, fontWeight: 'bold'}}>Datos generales</Text>
            </View>
            <View style={{
                backgroundColor: '#E9E9E9',
                borderRadius: 8,
                border: '1px solid #d9d9d9'
            }}>
                <View style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    padding: '12px',
                    borderBottom: '1px solid #d9d9d9'
                }}>
                    <FieldCandidate name='Nombre' value={infoCandidate?.first_name}/>
                    <FieldCandidate name='Apellidos' value={infoCandidate?.last_name}/>
                    <FieldCandidate
                        name='Fecha de nacimiento'
                        value={infoCandidate?.birthdate
                            ? moment(infoCandidate.birthdate, formatRecive).format(formatNeed)
                            : null
                        }
                    />
                    <FieldCandidate name='Correo electrónico' value={infoCandidate?.email}/>
                    <FieldCandidate name='Celular' value={infoCandidate?.cell_phone}/>
                    <FieldCandidate name='Teléfono fijo' value={infoCandidate?.telephone}/>
                    <FieldCandidate name='Estado' value={infoCandidate?.state?.name}/>
                    <FieldCandidate name='Municipio' value={infoCandidate?.municipality}/>
                    <FieldCandidate name='Dirección' value={infoCandidate?.street_address}/>
                    <FieldCandidate name='Código postal' value={infoCandidate?.postal_code}/>
                </View>
                <View style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    flexDirection: 'row',
                    padding: '8px 12px'
                }}>
                    <Text style={{ fontSize: 10, marginRight: 4}}>Idiomas:</Text>
                    {infoCandidate?.languages?.length > 0 ? infoCandidate.languages.map((item) => (
                        <TagLang key={item.id}>
                            {getLang(item.lang)} / {getDomain(item.domain)} 
                        </TagLang>
                    )) : (
                        <TagLang isPlaceholder={true}>
                            Ningún idioma seleccionado
                        </TagLang>
                    )}
                </View>
                <View style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    flexDirection: 'row',
                    padding: '0px 12px 12px'
                }}>
                    <View style={{marginBottom: 8}}>
                        <Text style={{ fontSize: 10 }}>Acerca de tí:</Text>
                    </View>
                    <View style={{
                        backgroundColor: '#ffff',
                        padding: '6px',
                        border: '1px solid #d9d9d9',
                        borderRadius: 5,
                        width: '100%',
                        minHeight: '30px',
                    }}>
                        <Text style={{
                            fontSize: 10,
                            color: infoCandidate?.about_me ? 'black' : '#d9d9d9',
                            textAlign: infoCandidate?.about_me ? 'left' : 'center'
                        }}>
                            {infoCandidate?.about_me ? infoCandidate?.about_me : 'Sin información'}
                        </Text>
                    </View>
                </View>
            </View>
        </>
    )


    const SectionEducation = () => (
        <>
            <View style={{ marginBottom: 8, marginTop: 16}}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }} >Educación</Text>
            </View>
            <HeaderTable fields={[
                {name: 'Escolaridad', size: '23%', pleft: '0px'},
                {name: 'Carrera', size: '23%'},
                {name: 'Estatus', size: '12%'},
                {name: 'Fecha fin', size: '12%'},
                {name: 'Institución', size: '30%', border: 'none'}
            ]} />
            <BodyTable
                data={infoEducation}
                cells={[
                    {size: '23%', key: 'study_level, name', pleft: '0px'},
                    {size: '23%', key: 'specialitation_area'},
                    {size: '12%', key: getStatus},
                    {size: '12%', key: e => e?.end_date
                        ? moment(e.end_date, formatRecive).format(formatNeed)
                        : null
                    },
                    {size: '30%', key: 'institution_name'}
                ]}
            />
        </>
    )

    const SectionExperience = () => (
        <>
            <View style={{ marginBottom: 8, marginTop: 16}}>
                <Text style={{fontSize: 14, fontWeight: 'bold'}}>Experiencia y especialización</Text>
            </View>
            <HeaderTable fields={[
                {name: 'Categoría', size: '25%', pleft: '0px'},
                {name: 'Subcategoría', size: '25%'},
                {name: 'Años de exp.', size: '13%'},
                {name: 'Competencias', size: '37%', border: 'none'}
            ]} />
            <BodyTable
                data={infoExperience}
                cells={[
                    {size: '25%', key: 'category, name', pleft: '0px'},
                    {size: '25%', key: 'sub_category, name'},
                    {size: '13%', key: 'experience_years', center: true},
                    {size: '37%', key: e => e.competences?.length > 0
                        ? e.competences?.map(item => item.name).join(', ')
                        : null
                    }
                ]}
            />
        </>
    )

    const SectionUltimateJobs = () => (
        <>
            <View style={{ marginTop: 16, marginBottom: 8}}>
                <Text style={{fontSize: 14,fontWeight: 'bold'}} >Últimos puestos</Text>
            </View>
            <HeaderTable fields={[
                {name: 'Puesto', size: '20%', pleft: '0px'},
                {name: 'Empresa', size: '28%'},
                {name: 'Sector', size: '28%'},
                {name: 'Fecha inicio', size: '12%'},
                {name: 'Fecha fin', size: '12%', border: 'none'}
            ]} />
             <BodyTable
                data={infoPositions}
                cells={[
                    {size: '20%', key: 'position_name', pleft: '0px'},
                    {size: '28%', key: 'company'},
                    {size: '28%', key: 'sector, name'},
                    {size: '12%', key: e => e?.start_date
                        ? moment(e.start_date, formatRecive).format(formatNeed)
                        : null
                    },
                    {size: '12%', key: e => e?.end_date
                        ? moment(e.end_date, formatRecive).format(formatNeed)
                        : null
                    }
                ]}
            />
        </>
    )


    const HeaderExpediente = () => (
        <>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8
            }}>
                <Image 
                    src='/images/LogoKhorconnect_1.png'
                    style={{width: 'auto', height: 30, marginRight: 8}}
                />
                {image && (
                    <Image
                        src={image}
                        style={{width: 'auto', height: 30}}
                    />
                )}
            </View>
            <View style={{textAlign: 'center'}}>
                <Text>Información del candidato</Text>
            </View>
        </>
    )

    return (
        // <PDFViewer showToolbar={false} style={{width: '100%', minHeight: '100vh'}}>
            <Document title='Expediente'>
                <Page size='LETTER' style={{padding: 24}} wrap={true}>
                    <HeaderExpediente/>
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
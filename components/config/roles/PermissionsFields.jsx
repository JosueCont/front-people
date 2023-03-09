import React, { useState, useEffect, Fragment } from 'react';
import {
    Row,
    Col,
    Checkbox,
    Form,
    Divider,
    Skeleton
} from 'antd';
import { useSelector } from 'react-redux';
import _ from 'lodash';

const data = {
    "main": [
        {
            "field": "job_position",
            "name": "Vacante"
        },
        {
            "field": "vo_bo",
            "name": "Visto bueno"
        },
        {
            "field": "assignment_date",
            "name": "Fecha de asignación"
        },
        {
            "field": "product",
            "name": "Producto"
        },
        {
            "field": "sub_product",
            "name": "Subproducto"
        },
        {
            "field": "num_project",
            "name": "Número de proyecto"
        },
        {
            "field": "qty",
            "name": "Número de posiciones a reclutar"
        },
        {
            "field": "description",
            "name": "Descripción"
        },
        {
            "field": "report_to",
            "name": "Reporta a"
        },
        {
            "field": "working_hours",
            "name": "Horario laboral"
        },
        {
            "field": "type_job",
            "name": "Tipo de trabajo"
        },
        {
            "field": "type_of_contract",
            "name": "Tipo de contratación"
        },
        {
            "field": "rotative_turn",
            "name": "Turno rotativo"
        },
        {
            "field": "turns_to_rotate",
            "name": "Turnos para rotar"
        },
        {
            "field": "requires_travel_availability",
            "name": "¿Requiere disponibilidad para viajar?"
        },
        {
            "field": "age_range",
            "name": "Rango de edad"
        },
        {
            "field": "gender",
            "name": "Género"
        },
        {
            "field": "have_subordinates",
            "name": "¿Tendrá subordinados?, ¿cuántos?"
        },
        {
            "field": "location",
            "name": "Localidad"
        },
        {
            "field": "municipality",
            "name": "Municipio"
        }
    ],
    "education_and_competence": [
        {
            "field": "main_category",
            "name": "Categoría principal"
        },
        {
            "field": "sub_category",
            "name": "Subcategoría"
        },
        {
            "field": "study_level",
            "name": "Último grado de estudios"
        },
        {
            "field": "status_level_study",
            "name": "Estatus del nivel de estudios"
        },
        {
            "field": "knowledge",
            "name": "Conocimientos"
        },
        {
            "field": "technical_skills",
            "name": "Habilidades técnicas"
        },
        {
            "field": "years_experience",
            "name": "Años de experiencia"
        },
        {
            "field": "experience",
            "name": "Descripción de experiencia"
        },
        {
            "field": "similar_degree",
            "name": "Carrera afín"
        },
        {
            "field": "language_activities",
            "name": "¿Para qué actividades utiliza el idioma?"
        }
    ],
    "salary_and_benefits": [
        {
            "field": "gross_salary",
            "name": "Sueldo Mensual Bruto"
        },
        {
            "field": "payment_period",
            "name": "Periodo de pago"
        },
        {
            "field": "economic_benefits",
            "name": "Prestaciones"
        },
        {
            "field": "economic_benefits_description",
            "name": "Descripción de prestaciones"
        },
        {
            "field": "benefits",
            "name": "Beneficios"
        },
        {
            "field": "rewards",
            "name": "Bonos"
        },
        {
            "field": "work_tools",
            "name": "Herramientas de trabajo"
        }
    ],
    "recruitment_process": [
        {
            "field": "interviews_number",
            "name": "Número de entrevistas"
        },
        {
            "field": "interviewers",
            "name": "¿Quiénes entrevistan?"
        },
        {
            "field": "observations",
            "name": "Particularidades a tomar en cuenta"
        },
        {
            "field": "rejection_reasons",
            "name": "Motivos potenciales de posible rechazo"
        }
    ]
}

const PermissionsFields = ({
    permissions = [],
    checkedPermissions = {},
    setCheckedPermissions
}) => {

    const onChecked = ({target: {checked}}, id) =>{
        let cheks = {...checkedPermissions, [id]: checked};
        setCheckedPermissions(cheks);
    }

    return (
        <Row gutter={[8,0]} className='section-list-fields'>
            {permissions?.length > 0 ? _.chunk(permissions, Math.ceil(permissions.length/4)).map((record, idx) => (
                <Col
                    xs={24} md={12} lg={8} xl={6}
                    key={`record_${idx}`}
                    style={{display: 'flex', flexDirection: 'column'}}
                >
                    {record.map((item, index) => (
                        <Checkbox
                            key={`item_${idx}_${index}`}
                            style={{marginLeft: 0}}
                            checked={checkedPermissions[item.id]}
                            onChange={e=> onChecked(e, item.id)}
                        >
                            {item.perm_name}
                        </Checkbox>
                    ))}
                </Col>
            )) :(
                <div className='placeholder-list-items'>
                    <p>Ningún permiso encontrado</p>
                </div>
            )}
        </Row>
    )
}

export default PermissionsFields
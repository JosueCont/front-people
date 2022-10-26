import {React, useEffect, useState} from 'react'
import { Tabs, Table, Button, Tooltip, Empty, Modal, message  } from 'antd'
import { DeleteOutlined, RedoOutlined, RetweetOutlined, EyeOutlined } from '@ant-design/icons';
import WebApiAssessment from '../../../api/WebApiAssessment';
import { useRouter } from 'next/router';
import moment from 'moment/moment';
import { useSelector } from 'react-redux'

const TableAssessments = () => {
  const infoPerson = useSelector((state) => state?.userStore?.people_company)
  const router = useRouter();
  moment.locale("es-mx");
  const [dataAssessments, setDataAssessments] = useState([]);
  const [idUser, setIdUser] = useState({});
  const [dataUser, setDataUser] = useState({});
  const dataExample = [
      {
          "id": "4dc2bd79af78455f942ffd10c7ee5311",
          "total_questions": 1,
          "total_sections": 1,
          "total_applys": 2,
          "code": "AGILE-EN",
          "language": "ES",
          "name": "Agilidad",
          "name_es": "Agilidad",
          "name_en": "Agility",
          "category": "K",
          "description": "<p>Esta prueba contiene dos secciones:</p>\r\n\r\n<p><strong>Secci&oacute;n 1: Conocimiento</strong><br />\r\nDetermina cuanto conoces sobre practicas &aacute;giles.<br />\r\n<br />\r\n<strong>Secci&oacute;n 2: Comportamiento</strong><br />\r\nDescubre qu&eacute; tan bien lo est&aacute;s haciendo y cu&aacute;les son las &aacute;reas en las que puedes mejorar para maximizar tu potencial como l&iacute;der &aacute;gil.<br />\r\n<br />\r\n<strong>&iexcl;Necesitar&aacute;s aproximadamente 20-30 minutos!</strong></p>",
          "description_es": "<p>Esta prueba contiene dos secciones:</p>\r\n\r\n<p><strong>Secci&oacute;n 1: Conocimiento</strong><br />\r\nDetermina cuanto conoces sobre practicas &aacute;giles.<br />\r\n<br />\r\n<strong>Secci&oacute;n 2: Comportamiento</strong><br />\r\nDescubre qu&eacute; tan bien lo est&aacute;s haciendo y cu&aacute;les son las &aacute;reas en las que puedes mejorar para maximizar tu potencial como l&iacute;der &aacute;gil.<br />\r\n<br />\r\n<strong>&iexcl;Necesitar&aacute;s aproximadamente 20-30 minutos!</strong></p>",
          "description_en": null,
          "random_order": false,
          "single_attempt": false,
          "max_questions": null,
          "is_active": false,
          "success_score": 0,
          "success_text": null,
          "success_text_es": null,
          "success_text_en": null,
          "fail_text": "fail",
          "fail_text_es": "fail",
          "fail_text_en": "",
          "final_text": "final",
          "final_text_es": "final",
          "final_text_en": "",
          "instructions_es": "<p>Esta prueba contiene dos secciones:</p>\r\n\r\n<p><strong>Secci&oacute;n 1: Conocimiento</strong><br />\r\nDetermina cuanto conoces sobre practicas &aacute;giles.<br />\r\n<br />\r\n<strong>Secci&oacute;n 2: Comportamiento</strong><br />\r\nDescubre qu&eacute; tan bien lo est&aacute;s haciendo y cu&aacute;les son las &aacute;reas en las que puedes mejorar para maximizar tu potencial como l&iacute;der &aacute;gil.<br />\r\n<br />\r\n<strong>&iexcl;Necesitar&aacute;s aproximadamente 20-30 minutos!</strong></p>",
          "instructions_en": "<p>This test contains two sections:</p>\r\n\r\n<p><strong>Section 1: Knowledge </strong><br />\r\nDetermine how much you know about agile practices.<br />\r\n<br />\r\n<strong>Section 2: Behavior </strong><br />\r\nFind out how well you are doing and what are the areas in which you can improve to maximize your potential as a leader agile.<br />\r\n<br />\r\n<strong>You will need approximately 20-30 minutes! </strong></p>",
          "image": null,
          "time_limit": null,
          "activate_elapsed_time": false,
          "psychometric": false,
          "companies": [
            1
          ],
          "categories": [
            "183c6b0c439c442a8a6616122304a750"
          ],
          "applys": [
            {
              "id": "7a35f8ef702d44ab8d0ad24c0d963b18",
              "user_id": "a042f8935bc742f7a3404ebd7f09656d",
              "status": 0,
              "apply_date": null,
              "end_date": null,
              "url_results": "",
              "send_khor": false,
              "elapsed_time": null,
              "finished_sections": 0,
              "time_limit": null,
              "question_scenario": null,
              "progress": 0,
              "results": {},
              "variable_results": {},
              "updated": "2022-10-19T17:36:50.397208-05:00",
              "is_last": false,
              "assessment": "4dc2bd79af78455f942ffd10c7ee5311",
              "period": null,
              "last_question": null
            }
          ],
          "node": {
            "id": 10,
            "name": "Grupo Human"
          },
          "type": "GroupAssesment",
          "createdAt": "2022-10-19T21:45:48.828313+00:00",
          "origin": "group"
      },
      {
          "id": "edf84df020a34d5f9bc492b2dc697d27",
          "total_questions": 173,
          "total_sections": 10,
          "total_applys": 6,
          "code": "2_KHOR_COGN",
          "language": "ES",
          "name": "Cognición",
          "name_es": "Cognición",
          "name_en": null,
          "category": "K",
          "description": null,
          "description_es": null,
          "description_en": null,
          "random_order": false,
          "single_attempt": false,
          "max_questions": null,
          "is_active": true,
          "success_score": 0,
          "success_text": null,
          "success_text_es": null,
          "success_text_en": null,
          "fail_text": "",
          "fail_text_es": "",
          "fail_text_en": "",
          "final_text": "",
          "final_text_es": "",
          "final_text_en": "",
          "instructions_es": "<p>Esta es una prueba de habilidad mental. En esta prueba se eval&uacute;an capacidades como la abstracci&oacute;n, juicio, habilidad num&eacute;rica, razonamiento, an&aacute;lisis y s&iacute;ntesis. Esta prueba se compone de diez series con ejercicios de diferente tipo. Al inicio de cada serie, se le proporcionar&aacute;n las instrucciones de los ejercicios espec&iacute;ficos de esa serie. Tambi&eacute;n se le informar&aacute; del tiempo disponible para responder cada serie.</p>\r\n\r\n<p>Por favor lea cuidadosamente las instrucciones antes de resolver cada serie. Antes de iniciar, aseg&uacute;rese de haberlas comprendido. Tenga a su mano hojas blancas y l&aacute;piz por si las requiere para hacer alguna operaci&oacute;n matem&aacute;tica para resolver alg&uacute;n problema.</p>\r\n\r\n<p>La duraci&oacute;n aproximada de esta evaluaci&oacute;n es de 40 minutos. Al inicio de cada secci&oacute;n, se le informar&aacute; de cu&aacute;nto tiempo dispone para resolverla. Trabaje lo m&aacute;s r&aacute;pido que pueda y trate de no cometer errores.</p>\r\n\r\n<p>Conteste todas las preguntas que se le presenten dentro del tiempo destinado para la serie.</p>\r\n\r\n<p>Gracias por su participaci&oacute;n</p>",
          "instructions_en": "",
          "image": null,
          "time_limit": null,
          "activate_elapsed_time": false,
          "psychometric": false,
          "companies": [
            26,
            30,
            35,
            8,
            53,
            1
          ],
          "categories": [],
          "applys": [
            {
              "id": "bb39514b8a864a628ad1bc07ee7d157e",
              "user_id": "a042f8935bc742f7a3404ebd7f09656d",
              "status": 1,
              "apply_date": "2022-09-05T13:20:58.109368-05:00",
              "end_date": null,
              "url_results": "",
              "send_khor": false,
              "elapsed_time": null,
              "finished_sections": 0,
              "time_limit": "00:01:40",
              "question_scenario": null,
              "progress": 1,
              "results": {},
              "variable_results": {},
              "updated": "2022-10-19T17:36:50.397208-05:00",
              "is_last": false,
              "assessment": "edf84df020a34d5f9bc492b2dc697d27",
              "period": null,
              "last_question": "941dc1ffd5114d60a52827525665b9c1"
            }
          ],
          "node": {
            "id": 10,
            "name": "Grupo Human"
          },
          "type": "GroupAssesment",
          "createdAt": "2022-10-19T21:45:48.828313+00:00",
          "origin": "group"
      },
      {
          "id": "75e0f757be8944a8b463f36528c2fe90",
          "total_questions": 1,
          "total_sections": 1,
          "total_applys": 5,
          "code": "67_KHOR_COLORS",
          "language": "ES",
          "name": "Colores",
          "name_es": "Colores",
          "name_en": "Colors",
          "category": "K",
          "description": null,
          "description_es": null,
          "description_en": null,
          "random_order": false,
          "single_attempt": false,
          "max_questions": null,
          "is_active": true,
          "success_score": 0,
          "success_text": null,
          "success_text_es": null,
          "success_text_en": null,
          "fail_text": "",
          "fail_text_es": "",
          "fail_text_en": "",
          "final_text": "",
          "final_text_es": "",
          "final_text_en": "",
          "instructions_es": "<p>A continuaci&oacute;n se le presentar&aacute; una serie de ocho colores. Obs&eacute;rvelos cuidadosamente. Piense bien cual es su color preferido. Se dar&aacute; cuenta que debajo de la serie de colores hay &quot;espacios&quot; vac&iacute;os. Lo que usted tiene que hacer es ordenar, en la serie vac&iacute;a y de izquierda a derecha, los ocho colores con base en su preferencia personal.</p>\r\n\r\n<p>Seleccione con el mouse su color preferido y arr&aacute;strelo hacia el primer espacio vac&iacute;o a la izquierda. Despu&eacute;s seleccione su segundo color preferido y arr&aacute;strelo hacia el siguiente espacio vac&iacute;o a la derecha del anterior. Proceda entonces con su tercer color preferido y as&iacute; sucesivamente hasta que haya coloque en el &uacute;ltimo espacio vac&iacute;o el color que m&aacute;s le desagrade. Para concluir, de clic en el bot&oacute;n &quot;Terminar&quot;.</p>\r\n\r\n<p>La duraci&oacute;n aproximada de esta evaluaci&oacute;n es de 5 minutos. Gracias por su participaci&oacute;n</p>",
          "instructions_en": "",
          "image": null,
          "time_limit": null,
          "activate_elapsed_time": false,
          "psychometric": false,
          "companies": [
            30,
            35,
            53,
            1
          ],
          "categories": [],
          "applys": [
            {
              "id": "10f1be8ff5d04c11a6cf9dfecda7b1db",
              "user_id": "a042f8935bc742f7a3404ebd7f09656d",
              "status": 0,
              "apply_date": null,
              "end_date": null,
              "url_results": "",
              "send_khor": false,
              "elapsed_time": null,
              "finished_sections": 0,
              "time_limit": null,
              "question_scenario": null,
              "progress": 0,
              "results": {},
              "variable_results": {},
              "updated": "2022-10-24T12:33:10.357590-05:00",
              "is_last": true,
              "assessment": "75e0f757be8944a8b463f36528c2fe90",
              "period": null,
              "last_question": null
            },
            {
              "id": "dfac503c366a4927ac081e7967f1b6c2",
              "user_id": "a042f8935bc742f7a3404ebd7f09656d",
              "status": 2,
              "apply_date": "2022-08-11T14:02:26.005397-05:00",
              "end_date": "2022-08-11T14:02:38.586330-05:00",
              "url_results": "",
              "send_khor": false,
              "elapsed_time": null,
              "finished_sections": 1,
              "time_limit": null,
              "question_scenario": null,
              "progress": 100,
              "results": "{\"idKuiz\":\"a042f8935bc742f7a3404ebd7f09656d\",\"assessment_code\":\"67_KHOR_COLORS\",\"assessment_date\":\"2022-08-11 14:02\",\"assessment_results\":\"13275046\"}",
              "variable_results": {
                "results": [
                  "1",
                  "3",
                  "2",
                  "7",
                  "5",
                  "0",
                  "4",
                  "6"
                ],
                "interpretation": [
                  {
                    "Title": "Objetivo deseado",
                    "Interpretation": "Quiere relacionarse de manera armónica y cordial; busca la relación cercana en la que haya entendimiento y comprensión mutua; llega a sacrificarse por los demás."
                  },
                  {
                    "Title": "Situación presente",
                    "Interpretation": "Dará seguimiento a sus proyectos y persigue con obstinación sus objetivos. Es difícil hacerlo cambiar de ideas."
                  },
                  {
                    "Title": "Característica inadecuada",
                    "Interpretation": "Puede ser egocéntrico y fácilmente se siente ofendido, presenta indiferencia hacia los proyectos estéticos o el cuidado de su imagen."
                  },
                  {
                    "Title": "Característica que rechaza",
                    "Interpretation": "Se muestra tenso por el autocontrol de imaginación e ingenio hacia los proyectos. Su fuerza para suprimir debilidades llega a los procesos mentales y a la imaginación. Es fuerte ante la adversidad pero débil en su entusiasmo hacia proyectos. Se muestra indiferente y decepcionado."
                  },
                  {
                    "Title": "El problema actual",
                    "Interpretation": "Quiere la tranquilidad mediante el autocontrol de necesidades e instintos. Desea una vida apacible a través del reconocimiento de sus cualidades."
                  }
                ]
              },
              "updated": "2022-10-19T17:36:50.397208-05:00",
              "is_last": false,
              "assessment": "75e0f757be8944a8b463f36528c2fe90",
              "period": null,
              "last_question": "f7b70acf830a4a8e9d294a1ea28d2779"
            }
          ],
          "node": {
            "id": 10,
            "name": "Grupo Human"
          },
          "type": "GroupAssesment",
          "createdAt": "2022-10-19T21:45:48.828313+00:00",
          "origin": "personal"
      },
  ]
  const columnsAssessments = [
    {
        title: 'Evaluación',
        dataIndex: 'name',
        key: 'name',
    },
  ];
  
  const expandedRowRender = (item) => {
    const columnsHistory = [
      {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
      },
      {
          title: 'Fecha inicio evaluación',
          dataIndex: "apply_date",
          render: record => record != null ? <span>{moment.parseZone(record).format('LL')}</span> : <span></span>
      },
      {
          title: 'Fecha fin evaluación',
          dataIndex: "end_date",
          render: record => record != null ? <span>{moment.parseZone(record).format('LL')}</span> : <span></span>
      },
      {
        title: 'Estatus',
        dataIndex: "status",
        render: (record) => {
          if(record == 0){
            return(
              <span>Pendiente</span>
            )
          }else if(record == 1) {
            return(
              <span>Iniciada</span>
            )
          }else if(record ==2) {
            return(
              <span>Finalizada</span>
            )
          }
        }
      },
      {
        title: 'Progreso',
        dataIndex: "progress",
        render: record => <span>{record}%</span>,
      },
      {
        title: 'Acciones',
        render: (record) => {
          if(record.status == 0){
            return(
              <Button onClick={()=> modalDelete(record.id)}>
                <Tooltip title="Eliminar evaluación">
                  <DeleteOutlined />
                </Tooltip>
              </Button>
            )
          }else if(record.status == 1) {
            return(
              <>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <Button onClick={()=> modalRestart(record.id)}>
                    <Tooltip title="Reiniciar evaluación">
                      <RedoOutlined />
                    </Tooltip>
                  </Button>
                  <Button onClick={()=> modalDelete(record.id)}>
                    <Tooltip title="Eliminar evaluación">
                      <DeleteOutlined/>
                    </Tooltip>
                  </Button>
                </div>
              </>
            )
          }else if(record.status ==2) {
            return(
              <>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <Button>
                    <Tooltip title="Ver resultados">
                      <EyeOutlined />
                    </Tooltip>
                  </Button>
                  <Button onClick={()=> modalReset(record.id)}>
                    <Tooltip title="Reasignar evaluación">
                      <RetweetOutlined />
                    </Tooltip>
                  </Button>
                  <Button onClick={()=> modalDelete(record.id)}>
                    <Tooltip title="Eliminar evaluación">
                      <DeleteOutlined/>
                    </Tooltip>
                  </Button>
                </div>
              </>
            )
          }
        }
      },
    ];
    return <Table columns={columnsHistory}
              dataSource={item.applys}
              pagination={false}
              style={{marginTop:"8px", marginBottom:"8px"}}
              locale={{emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin historial de esta evaluación" />}}
            />;
  };

  useEffect(()=>{
    if(router.query.id){
      let info = infoPerson.filter(item => item.value === router.query.id);
      setDataUser(info.at(-1));
      let data = { person: router.query.id }
      // let data = {person: "a042f8935bc742f7a3404ebd7f09656d"}
      setIdUser(data);
      getUserListAssessments(data)
    }
  },[router])

  const getUserListAssessments = async (data) =>{
    try {
      let response = await WebApiAssessment.getUserListAssessments(data);
      setDataAssessments(response.data);
      // setDataAssessments(dataExample);
    } catch (e) {
      console.error(e.name + ": " + e.message);
    }
  };

  const modalDelete = (data) =>{
    let dataApply = { apply_id: data }
    Modal.confirm({
      title: "¿Está seguro de eliminar esta evaluación?",
      content: "Si lo elimina no podrá recuperarlo",
      cancelText: "Cancelar",
      okText: "Sí, eliminar",
      onOk: () => {deleteApply(dataApply)}
    });
  }

  const deleteApply = async (data) => {
    try {
      let response = await WebApiAssessment.deleteAssessmentUser(data);
      console.log("respuesta del apply eliminado",response);
      message.success("La asignación se elimino correctamente");
      getUserListAssessments(idUser);
    } catch (e) {
      console.error(e.name + ": " + e.message);
    }
  }

  const modalRestart = (data) =>{
    let dataApply = { apply_id: data}
    Modal.confirm({
      title: "¿Está seguro de reiniciar esta evaluación?",
      content: "",
      cancelText: "Cancelar",
      okText: "Sí, reiniciar",
      onOk: () => {resetApply(dataApply)}
    });
  }

  const restartApply = async (data) => {
    try {
      let response = await WebApiAssessment.restartAssessmentUser(data);
      console.log("respuesta del apply reasignar",response);
      getUserListAssessments(idUser);
      message.success("La asignación se reasigno correctamente");
    } catch (e) {
      console.error(e.name + ": " + e.message);
    }
  }

  const modalReset = (data) =>{
    let dataApply = { apply_id: data}
    Modal.confirm({
      title: "¿Está seguro de reasignar esta evaluación?",
      content: "",
      cancelText: "Cancelar",
      okText: "Sí, reasignar",
      onOk: () => {restartApply(dataApply)}
    });
  }

  const resetApply = async (data) =>{
    try {
      let response = await WebApiAssessment.resetAssessmentUser(data);
      console.log("respuesta del apply reiniciar",response);
      message.success("La asignación se reinicio correctamente");
      getUserListAssessments(idUser);
    } catch (e) {
      console.error(e.name + ": " + e.message);
    }
  }
    
  return (
    <>
        <div style={{padding:"16px", backgroundColor:"white", borderRadius:"15px"}}>
            <h2>Asignaciones de {dataUser?.label}</h2>
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Individuales" key="1" forceRender={true}>
                  <Table
                    rowKey={record => record.id}
                    columns={columnsAssessments}
                    expandable={{
                    expandedRowRender,
                    defaultExpandedRowKeys: ["id"],
                    }}
                    dataSource={dataAssessments.filter(item => item.origin === "personal")}
                    size="small"
                    style={{marginTop:"16px"}}
                    locale={{emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin asignaciones personales" />}}
                  />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Grupales" key="2" forceRender={true}>
                  <Table
                    rowKey={record => record.id}
                    columns={columnsAssessments}
                    expandable={{
                    expandedRowRender,
                    defaultExpandedRowKeys: ["id"],
                    }}
                    dataSource={dataAssessments.filter(item => item.origin === "group")}
                    size="small"
                    style={{marginTop:"16px"}}
                    locale={{emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin asignaciones grupales" />}}
                  />
                </Tabs.TabPane>
            </Tabs>
        </div>
    </>
  )
}

export default TableAssessments
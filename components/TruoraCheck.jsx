import { Global, css } from '@emotion/core'
import { Avatar, Badge, Button, Col, Divider, List, Popconfirm, Progress, Row, Space, Tag, Tooltip, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import WebApiPeople from '../api/WebApiPeople';
import { downLoadFileBlob, getDomain } from '../utils/functions'
import { API_URL_TENANT } from "../config/config";

import {FilePdfOutlined, SyncOutlined} from '@ant-design/icons';

import moment from 'moment';

const TruoraCheck = ({person, ...props}) => {

    const { Title, Text } = Typography
    const [loading, setLoading] = useState(false)
    const [checkId, setCheckId] = useState(null)
    const [showDetails, setShowDetails] = useState(false)
    const [errorRequest, setErrorRequest] = useState(null)
    const [checkDetails, setCheckDetails] = useState(null)
    


    const valuesColors = [
      {
        color:"#0008ff",
        text: "0-2",
        values: [1,2]
      },
      {
        color: "#2f35f1",
        text: "3-4",
        values: [3,4]
      },
      {
        color: "#6c70f7",
        text: "5-6",
        values: [5,6]
      },
      {
        color: "#9093ef",
        text: "7-8",
        values: [7,8]
      },
      {
        color: "#cecff3",
        text: "9-10",
        values: [9,10]
      }
      ]

    let responseTemp = {
            "check_id": "CHK56797e4715e3d84adf359542023dbd25",
            "company_summary": {
                "company_status": "not_found",
                "result": "skipped"
            },
            "country": "MX",
            "creation_date": "2023-04-26T17:03:16.336529717Z",
            "date_of_birth": "1994-03-01T00:00:00Z",
            "first_name": "IRVIN MICHAEL",
            "name_score": 1,
            "id_score": 1,
            "last_name": "ALBORNOZ VAZQUEZ",
            "score": 1,
            "scores": [
                {
                    "data_set": "personal_identity",
                    "severity": "none",
                    "score": 1,
                    "result": "found",
                    "by_id": {
                        "result": "found",
                        "score": 1,
                        "severity": "none"
                    },
                    "by_name": {
                        "result": "ignored",
                        "score": 1,
                        "severity": "unknown"
                    }
                },
                {
                    "data_set": "criminal_record",
                    "severity": "none",
                    "score": 1,
                    "result": "not_found",
                    "by_id": {
                        "result": "ignored",
                        "score": 1,
                        "severity": "unknown"
                    },
                    "by_name": {
                        "result": "not_found",
                        "score": 1,
                        "severity": "none"
                    }
                },
                {
                    "data_set": "legal_background",
                    "severity": "none",
                    "score": 1,
                    "result": "not_found",
                    "by_id": {
                        "result": "ignored",
                        "score": 1,
                        "severity": "unknown"
                    },
                    "by_name": {
                        "result": "not_found",
                        "score": 1,
                        "severity": "none"
                    }
                },
                {
                    "data_set": "international_background",
                    "severity": "none",
                    "score":.199,
                    "result": "not_found",
                    "by_id": {
                        "result": "not_found",
                        "score": 1,
                        "severity": "none"
                    },
                    "by_name": {
                        "result": "not_found",
                        "score": 1,
                        "severity": "none"
                    }
                },
                {
                    "data_set": "alert_in_media",
                    "severity": "none",
                    "score": 1,
                    "result": "not_found",
                    "by_id": {
                        "result": "ignored",
                        "score": 1,
                        "severity": "unknown"
                    },
                    "by_name": {
                        "result": "not_found",
                        "score": 1,
                        "severity": "none"
                    }
                },
                {
                    "data_set": "taxes_and_finances",
                    "severity": "none",
                    "score": 1,
                    "result": "found",
                    "by_id": {
                        "result": "found",
                        "score": 1,
                        "severity": "none"
                    },
                    "by_name": {
                        "result": "not_found",
                        "score": 1,
                        "severity": "unknown"
                    }
                }
            ],
            "status": "completed",
            "statuses": [
                {
                    "database_id": "DBI01d5e2ad2e8dd6e8bd01291be281b906470e922f",
                    "database_name": "Poder Judicial Estado de México",
                    "data_set": "legal_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI01d5e2ad2e8dd6e8bd01291be281b906470e922f",
                    "database_name": "Poder Judicial Estado de México",
                    "data_set": "criminal_record",
                    "status": "completed"
                },
                {
                    "database_id": "DBI08a7c3402b96b03ff7fd6c7cf283cec1b4df14df",
                    "database_name": "SAT",
                    "data_set": "taxes_and_finances",
                    "status": "completed"
                },
                {
                    "database_id": "DBI08c1ca056fd6cc36d0fc6d563951859350e268d9",
                    "database_name": "Poder Judicial Morelos - Historial",
                    "data_set": "legal_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI08c1ca056fd6cc36d0fc6d563951859350e268d9",
                    "database_name": "Poder Judicial Morelos - Historial",
                    "data_set": "criminal_record",
                    "status": "completed"
                },
                {
                    "database_id": "DBI0f5764b4ee2c0b970147f19cc066d87ac13a5c8d",
                    "database_name": "Poder Judicial Guerrero",
                    "data_set": "legal_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI280eabe8d7f5e9c9a000f2944195e91bef7e4981",
                    "database_name": "Poder Judicial Guerrero",
                    "data_set": "criminal_record",
                    "status": "completed"
                },
                {
                    "database_id": "DBI3314a5f439dff54dff686fca2545c6826ee5ec11",
                    "database_name": "Poder Judicial Jalisco",
                    "data_set": "legal_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI3314a5f439dff54dff686fca2545c6826ee5ec11",
                    "database_name": "Poder Judicial Jalisco",
                    "data_set": "criminal_record",
                    "status": "completed"
                },
                {
                    "database_id": "DBI386340b3ef9b714192cb0d8816769044b14926cc",
                    "database_name": "Poder Judicial MX",
                    "data_set": "criminal_record",
                    "status": "completed"
                },
                {
                    "database_id": "DBI386340b3ef9b714192cb0d8816769044b14926cc",
                    "database_name": "Poder Judicial MX",
                    "data_set": "legal_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI398292741715dc90345b2f06869865be836eeff3",
                    "database_name": "Poder Judicial Tabasco",
                    "data_set": "criminal_record",
                    "status": "completed"
                },
                {
                    "database_id": "DBI398292741715dc90345b2f06869865be836eeff3",
                    "database_name": "Poder Judicial Tabasco",
                    "data_set": "legal_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI3e2e251f55dc62c78795a87a90ff6e88603d37ab",
                    "database_name": "Poder Judicial Morelos",
                    "data_set": "legal_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI62205bb1e7a9b1c8c9b41d7678ca9ef9f1018761",
                    "database_name": "Poder Judicial Tabasco - Segunda Instancia",
                    "data_set": "criminal_record",
                    "status": "completed"
                },
                {
                    "database_id": "DBI62205bb1e7a9b1c8c9b41d7678ca9ef9f1018761",
                    "database_name": "Poder Judicial Tabasco - Segunda Instancia",
                    "data_set": "legal_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI82e459b7cd5097475d7ae07545cbf05b4299c75b",
                    "database_name": "SAT Certificados",
                    "status": "skipped",
                    "invalid_inputs": [
                        "tax_id"
                    ]
                },
                {
                    "database_id": "DBI98feea6f905a1caa9c15bbbb7a51b59ddf865d2d",
                    "database_name": "Poder Judicial Baja California Sur",
                    "data_set": "criminal_record",
                    "status": "completed"
                },
                {
                    "database_id": "DBI98feea6f905a1caa9c15bbbb7a51b59ddf865d2d",
                    "database_name": "Poder Judicial Baja California Sur",
                    "data_set": "legal_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI998a562086dda9daecbc0753e5a6c88e522db38d",
                    "database_name": "Poder Judicial Zacatecas",
                    "data_set": "criminal_record",
                    "status": "completed"
                },
                {
                    "database_id": "DBI998a562086dda9daecbc0753e5a6c88e522db38d",
                    "database_name": "Poder Judicial Zacatecas",
                    "data_set": "legal_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBIbfe26c66d6fc6dcd35fedf2d152a84f66bc187b0",
                    "database_name": "Poder Judicial de la Federación",
                    "data_set": "criminal_record",
                    "status": "completed"
                },
                {
                    "database_id": "DBIbfe26c66d6fc6dcd35fedf2d152a84f66bc187b0",
                    "database_name": "Poder Judicial de la Federación",
                    "data_set": "legal_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBIc0bf47213a30715703c8f8438acb1efe8e66189a",
                    "database_name": "Poder Judicial Quintana Roo",
                    "data_set": "criminal_record",
                    "status": "completed"
                },
                {
                    "database_id": "DBIc0bf47213a30715703c8f8438acb1efe8e66189a",
                    "database_name": "Poder Judicial Quintana Roo",
                    "data_set": "legal_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBIc2684a6aefae92dbd813246653bb8c115bade565",
                    "database_name": "mx-sanciones",
                    "data_set": "taxes_and_finances",
                    "status": "skipped"
                },
                {
                    "database_id": "DBIc87d063459db975326b793e9ee7bdb857faf52b9",
                    "database_name": "SAT - Listas de operaciones inexistentes(Articulo 69 y 69B por operaciones fraudulentas)",
                    "data_set": "taxes_and_finances",
                    "status": "completed"
                },
                {
                    "database_id": "DBId4a02d6bff0054af9cada9f1d2ba3bc0eac92364",
                    "database_name": "Poder Judicial Aguascalientes",
                    "data_set": "criminal_record",
                    "status": "completed"
                },
                {
                    "database_id": "DBId4a02d6bff0054af9cada9f1d2ba3bc0eac92364",
                    "database_name": "Poder Judicial Aguascalientes",
                    "data_set": "legal_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBId5f2ea3c2ceb92705763d10833ccd018ba4c984b",
                    "database_name": "Poder Judicial Sonora",
                    "data_set": "criminal_record",
                    "status": "completed"
                },
                {
                    "database_id": "DBId5f2ea3c2ceb92705763d10833ccd018ba4c984b",
                    "database_name": "Poder Judicial Sonora",
                    "data_set": "legal_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBIec06869f10863b6c82ffea47024384e9af748187",
                    "database_name": "Consejo de la Judicatura Federal - Acuerdos",
                    "data_set": "criminal_record",
                    "status": "completed"
                },
                {
                    "database_id": "DBIec06869f10863b6c82ffea47024384e9af748187",
                    "database_name": "Consejo de la Judicatura Federal - Acuerdos",
                    "data_set": "legal_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBIee62ad89459f9386283875aa08377a0387b37ad2",
                    "database_name": "Registro Nacional de Población - RENAPO",
                    "data_set": "personal_identity",
                    "status": "completed"
                },
                {
                    "database_id": "DBIf054afaaa8afe6e8247c267f6042bb9e31b18f5c",
                    "database_name": "Poder Judicial Veracruz",
                    "data_set": "criminal_record",
                    "status": "completed"
                },
                {
                    "database_id": "DBIf054afaaa8afe6e8247c267f6042bb9e31b18f5c",
                    "database_name": "Poder Judicial Veracruz",
                    "data_set": "legal_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBIff0c5adcbd20ff6bbc099882d6b2ca6ff0cabc41",
                    "database_name": "Programa de Recompensas de la PGR - Recompensas Criminales",
                    "data_set": "criminal_record",
                    "status": "completed"
                },
                {
                    "database_id": "DBI021bf85b4b88628dfe6c9f155e2f53c27c6e491a",
                    "database_name": "Inter-American Development Bank",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI16189d09c9ea160e0b46f9b02b5aa13b3acdb77e",
                    "database_name": "Consolidated Screening Lists",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI20279be53a2cc5eb78c4eca234622c7764855804",
                    "database_name": "Google",
                    "data_set": "alert_in_media",
                    "status": "completed"
                },
                {
                    "database_id": "DBI2b69e4bd677e0c028939a2f3c1292c1cf2c31313",
                    "database_name": "Búsqueda en medios GOOGLE RSS",
                    "data_set": "alert_in_media",
                    "status": "completed"
                },
                {
                    "database_id": "DBI2ba70e37e29aacc38fc9a89cb6c39c29e8a5cfdd",
                    "database_name": "United Nations Security Council Consolidate List",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI2f2a11461aa6d18384f754e26c2ff6c54fa10923",
                    "database_name": "Most Wanted Secret Service",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI36a911fb239aa807ab845534ce42570a99b55a0a",
                    "database_name": "Offshore Leaks Database - Officers",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI4430985bb6620056a6064cf11bb31186d34d582d",
                    "database_name": "Most Wanted Fugitives by the DEA",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI59c070f10432398200898abda9e4657273c10748",
                    "database_name": "Offshore Leaks Database - Offshore entities",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI5a155dfdb55d96a9ea00797ab5cf3fd88eac5910",
                    "database_name": "Office of Foreign Assets Control - OFAC",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI779bcf960d4743fa23bc4c99a43f4f2a1e34ee92",
                    "database_name": "health-exclusions",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBI82f0ff06d2c7ae86e16160e637ba072f2fa70203",
                    "database_name": "U.S. Security and Exchange Commission (SEC)",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBIac4d74895385c27eccc0e589c2cf542a01ed6eea",
                    "database_name": "FBI",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBIb6f45cf65d3dfd2c37e6210ebbd9191d35dc48e2",
                    "database_name": "World Bank Debarred Firms",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBIb7da46375d124bbfecdddfb3774215fda2086aff",
                    "database_name": "Cia World Leaders",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBIb8f99bb1902b110b5a952e202b408190ab6a9e1a",
                    "database_name": "OFSI Consolidated List Search (HMT Treasury List)",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBIc75c46e22d5565371d2893fad550474abc891fc7",
                    "database_name": "Reported in the EU financial system",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBIca0e39584d803f7b935e481328a559efeb315532",
                    "database_name": "EU list of the most wanted",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBId73cdff5dd3cf75bb48fbfe773682f2983400180",
                    "database_name": "Common Position Terrorist EU",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBIda71937421a651f8564d16e18b21bb3955278271",
                    "database_name": "DSS Most Wanted - Bureau of Diplomatic Security",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBIdf35eee10ea75c3f52ad489090fe5d0133bb2689",
                    "database_name": "Offshore Leaks Database - Intermediares",
                    "data_set": "international_background",
                    "status": "completed"
                },
                {
                    "database_id": "DBIe72ce9fcb6bd79b6c9a2685cb66e72f387e78e40",
                    "database_name": "Interpol list of the most wanted",
                    "data_set": "international_background",
                    "status": "completed"
                }
            ],
            "summary": {
                "date_of_birth": "1994-03-01T00:00:00Z",
                "gender": "male",
                "identity_status": "found",
                "names_found": [
                    {
                        "first_name": "IRVIN MICHAEL",
                        "last_name": "ALBORNOZ VAZQUEZ",
                        "count": 1
                    }
                ],
                "result": "found"
            },
            "update_date": "2023-04-26T17:03:23Z",
            "vehicle_summary": {
                "result": "skipped",
                "vehicle_status": "not_found"
            },
            "national_id": "AOVI940301HYNLZR01",
            "type": "person"
      }
    useEffect(() => {
      console.log('person',person)
        if(person?.meta_data?.check_id){
            getBackgroundCheck_details();
        }
    }, [])


    const ScoreIndicator = ({scoreItem}) => {
      let color = "none";
      console.log('scoreItem',scoreItem)
      console.log('valuesColors',valuesColors)
      valuesColors.map((item) => {
        if(item.values.includes(Math.trunc(scoreItem?.score*10))){
          color = item.color
        }
      })
      console.log('color',color)
      return (
          <Avatar style={{ backgroundColor: color, margin:'auto' }} icon={Math.trunc(scoreItem?.score*10)} />
      )
    }
    
    

    const createBackgroundCheck = async () => { 
        setShowDetails(false)
        setErrorRequest(false)
        setLoading(true);
        await WebApiPeople.CreateTruoraRequest(person.id)
        .then((response) => {
            console.log('response===>', response)
            if (response.status == 201){
              getBackgroundCheck_details()
            }
            setLoading(false);
        })
        .catch((error) => {
            setErrorRequest(error?.response?.data?.message)
            /* message.error("Error al actualizar, intente de nuevo."); */
            setLoading(false);
        });
    }

    const getBackgroundCheckFile = async () =>{
      console.log('person',person)
      downLoadFileBlob(
        `${getDomain(
          API_URL_TENANT
        )}/person/person/${person.id}/get_background_check_file/`,
        `${person?.first_name}_${person.flast_name ? person.flast_name :''}_${person.mplast_name ? person.mplast_name :''}_Truora_report.pdf`,
        "get"
      );

      

      /* await WebApiPeople.GetTruoraFile(person.id)
        .then((response) => {
          if(response.status == 200){
                const blob = new Blob([response.data]);
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = "demo.pdf";
                link.click();
          }
        })
        .catch((error) => {
            console.log('first', error.message)
            setLoading(false);
        }); */
    }

    const getBackgroundCheck_details = async () =>{
        await WebApiPeople.GetTruoraRequest(person.id)
        .then((response) => {
          if(response.status == 201){
            console.log('details',response.data)
            setLoading(false);
            setShowDetails(true)
          }
            
        })
        .catch((error) => {
            console.log('first', error.message)
            setLoading(false);
            setShowDetails(false)
        });
    }

  return (
    <>
        <Global
            styles={css`
                .btnActionTruora{
                    border-radius: 50%;
                    width: 100px;
                    height: 100px;
                    margin-top:100px;
                }       
                
                  
                  .wrap {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                  
                  .button-truora {
                    min-width: 300px;
                    min-height: 60px;
                    font-family: 'Nunito', sans-serif;
                    font-size: 22px;
                    text-transform: uppercase;
                    letter-spacing: 1.3px;
                    font-weight: 700;
                    color: #fff !important;
                    background: var(--primaryColor) !important;
                    background: linear-gradient(90deg, rgba(129,230,217,1) 0%, rgba(79,209,197,1) 100%);
                    border: none;
                    border-radius: 1000px;
                    box-shadow: 12px 12px 24px rgba(79,209,197,.64);
                    transition: all 0.3s ease-in-out 0s;
                    cursor: pointer;
                    outline: none;
                    position: relative;
                    padding: 10px;
                    color: #313133;
                    margin-bottom: 10px;
                    text-align: center;
                    }

                  
                  .button-truora::before {
                    content: '';
                    border-radius: 1000px;
                    min-width: calc(300px + 12px);
                    min-height: calc(60px + 12px);
                    border: 6px solid #00FFCB;
                    box-shadow: 0 0 60px rgba(0,255,203,.64);
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                    transition: all .3s ease-in-out 0s;
                  }

                  .btn_loading{
                        transform: translateY(-6px);
                    }
                  
                  
                  
                  .button-truora::after {
                    content: '';
                    width: 30px; height: 30px;
                    border-radius: 100%;
                    border: 6px solid #00FFCB;
                    position: absolute;
                    z-index: -1;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: ring 1.5s infinite;
                  }
                  
                  .text-light{
                    font-weight: 300 !important;
                    margin: 0px;
                  }

                  .color-indicator .ant-badge-status-text{
                    display:none;
                  }

                  button.btnDownloadFileTruora{
                    background-color: #930909 !important;
                  }
                  button.btnDownloadFileTruora:hover{
                    background-color: #5a0909 !important;
                  }
                  
                  @keyframes ring {
                    0% {
                      width: 30px;
                      height: 30px;
                      opacity: 1;
                    }
                    100% {
                      width: 300px;
                      height: 300px;
                      opacity: 0;
                    }
                  }

            `}
        />
        <Row justify='space-between'>
          <Col>
            <Title style={{ fontSize: "20px", marginBottom:0 }}>BackGround Check By Truora</Title>
            {showDetails && 
              <Text>
                Fecha de ultima actualización { moment(responseTemp.creation_date).format("DD/MM/yyyy HH:mm:ss")}
              </Text>
            }
          </Col>
          { showDetails && 
            <Col>
            <Space>
              
              <Popconfirm
                title="¿Volver a consutar?"
                description="Esto se contabilizara con una consulta nueva en Truora"
                onConfirm={() =>createBackgroundCheck()}
                okText="Si"
                cancelText="No"
              >
                  <Button>
                    <SyncOutlined style={{ color:'white' }} />
                  </Button>
                </Popconfirm>
              <Button className='btnDownloadFileTruora' onClick={() => getBackgroundCheckFile()} icon={<FilePdfOutlined/>}>
                Descargar reporte 
              </Button> 
            </Space>
          </Col>
          }          
        </Row>
        <Row justify='center' gutter={20}>
            { !showDetails ? 
              <Col style={{  paddingTop:100, textAlign:'center' }}>
                <div class="wrap">
                    <button onClick={() => createBackgroundCheck()} class={`button-truora ${loading && 'btn_loading'}`}>
                        { loading ? 'Consultando...' : 'Consultar' }
                    </button>
                </div>
                {
                    errorRequest &&
                        <Text type="danger">
                            {errorRequest}
                        </Text>
                }
              </Col>
              :
              <>
                <Col span={24}>
                  <Title style={{ marginTop:10 }} level={4} className='text-light'>
                    Puntaje
                  </Title>   
                  <Divider style={{ marginTop:10, marginBottom:10 }}  />
                  <Text>Id de la consulta</Text>
                  <Title level={5} style={{ margin:0 }}>
                      {responseTemp?.check_id}
                    </Title>
                
                  <div style={{ width:'100%', textAlign:'center' }}>
                    <Progress style={{ marginTop:20 }} type="circle" percent={responseTemp?.score*100} format={() => (responseTemp?.score*10) }  />
                    <p style={{ marginBottom:0 }}>
                      <b>
                      Confianza media
                      </b>
                    </p>
                    <p>
                    <Text >
                      El <b>puntaje global</b> se obtiene de todas las fuentes consultadas.
                    </Text>
                    </p>
                  </div>
                  <Title level={5} style={{ marginTop:20 }}>
                    Nivel de confianza
                  </Title>
                  <List 
                     grid={{
                      column: 5,
                      gutter: 16
                    }}
                    dataSource={valuesColors}
                    renderItem={(item) => (
                      <List.Item>
                        <div style={{ textAlign:'center', width:'100%' }}>
                          <Badge color={item.color} className='color-indicator'/>
                          <p>{item.text}</p>
                        </div>
                      </List.Item>
                    )}
                  />
                </Col>

                <Col span={24} style={{ marginTop:20 }}>
                  <Title level={4} className='text-light'>
                    Categorías de información
                  </Title>   
                  <Divider style={{ marginTop:10, marginBottom:10 }}  />
                  <List
                    dataSource={responseTemp?.scores}
                    renderItem={(item,idx) => (
                      <List.Item style={{ display:'block' }}>
                        <Row justify='space-between'>
                          <Col>
                            <Title level={5} style={{ marginBottom:0 }}>
                              {
                                item.data_set == 'personal_identity' ? 'Identidad':
                                item.data_set == 'criminal_record' ? 'Criminal':
                                item.data_set == 'legal_background' ? 'Legal':
                                item.data_set == 'international_background' ? 'Internacional':
                                item.data_set == 'alert_in_media' ? 'Medios':
                                item.data_set == 'taxes_and_finances' && 'Impuestos y finanzas'
                              }
                            </Title>
                            <Text>
                              Registros encontrados: 2
                            </Text> <br/>
                            <Text>
                              <Tag color="#108ee9">
                                {
                                  item.data_set == 'personal_identity' ? '20%':
                                  item.data_set == 'criminal_record' ? '50%':
                                  item.data_set == 'alert_in_media' ? '0%': '10%'
                                }
                              </Tag>
                              Peso sobre el puntaje global
                            </Text>
                          </Col>
                          <Col style={{ textAlign:'end', display:'flex' }}>
                            <ScoreIndicator scoreItem={item}  />
                          </Col>
                        </Row>
                      </List.Item>
                    )}
                  />
                </Col>
              </>
            }
        </Row>
    </>
  )
}

export default TruoraCheck
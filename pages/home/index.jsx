import {
    Layout,
    Breadcrumb,
    Table,
    Tooltip,
    Row,
    Col,
    Input,
    Select,
    Switch,
    Button,
    Form,
    Avatar,
    message,
    Modal,
    Alert,
    Menu,
    Dropdown
} from "antd";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { useCallback, useEffect, useState, useRef, React } from "react";
import {
    SyncOutlined,
    SearchOutlined,
    PlusOutlined,
    DownloadOutlined,
    UploadOutlined,
    EllipsisOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import MainLayout from "../../layout/MainLayout";
import _ from "lodash";
import FormPerson from "../../components/person/FormPerson";
import { withAuthSync } from "../../libs/auth";

const { Content } = Layout;
import Link from "next/link";
import jsCookie from "js-cookie";

const homeScreen = () => {
    const [person, setPerson] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(true);
    const [modalAddPerson, setModalAddPerson] = useState(false);
    const [formFilter] = Form.useForm();
    const inputFileRef = useRef(null);
    let filters = {};
    const defaulPhoto =
        "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";

    const [modalDelete, setModalDelete] = useState(false);
    const [idsDelete, setIdsDelete] = useState("");
    const [personsToDelete, setPersonsToDelete] = useState([]);
    const [stringToDelete, setStringToDelete] = useState(null);
    const [nodes, setNodes] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [permissions, setPermissions] = useState({});
    let urlFilter = "/person/person/?";

    useEffect(() => {
        const jwt = JSON.parse(jsCookie.get("token"));
        searchPermissions(jwt.perms);
        getPerson();
        getNodes();
    }, []);

    const searchPermissions = (data) => {
        const perms = {};
        data.map((a) => {
            if (a.includes("people.person.can.view")) perms.view = true;
            if (a.includes("people.person.can.create")) perms.create = true;
            if (a.includes("people.person.can.edit")) perms.edit = true;
            if (a.includes("people.person.can.delete")) perms.delete = true;
            if (a.includes("people.person.function.change_is_active"))
                perms.change_status = true;
            if (a.includes("people.person.function.export_csv_person"))
                perms.export = true;
            if (a.includes("people.person.function.import_csv_person"))
                perms.import = true;
        });
        setPermissions(perms);
    };

    /////PEOPLE
    const getPerson = () => {
        setLoading(true);
        Axios.get(API_URL + `/person/person/`)
            .then((response) => {
                setPerson([]);
                response.data.results.map((item, i) => {
                    item.key = i;
                    if (!item.photo) item.photo = defaulPhoto;
                });
                setPerson(response.data.results);
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const filterPersonName = (data) => {
        console.log("FILTROS-->> ", data);
        Axios.get(API_URL + `${data}`)
            .then((response) => {
                console.log("RESPONSE FILTER-->>> ", response.data);
                setPerson([]);
                response.data.results.map((item, i) => {
                    item.key = i;
                    if (!item.photo) item.photo = defaulPhoto;
                });
                setPerson(response.data.results);
                setLoading(false);
            })
            .catch((e) => {
                setPerson([]);
                setLoading(false);
                console.log(e);
            });
    };

    const deletePerson = () => {
        Axios.post(API_URL + `/person/person/delete_by_ids/`, {
            persons_id: idsDelete,
        })
            .then((response) => {
                setIdsDelete("");
                setModalDelete(false);
                getPerson();
                setLoading(false);
                message.success("Eliminado correctamente.");
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };

    const getModalPerson = (value) => {
        setModalAddPerson(value);
        setLoading(true);
        Axios.get(API_URL + `/person/person/`)
            .then((response) => {
                response.data.results.map((item) => {
                    item["key"] = item.id;
                    item["fullname"] =
                        item.first_name + " " + item.flast_name + " " + item.mlast_name;
                    item.timestamp = item.timestamp.substring(0, 10);
                    if (!item.photo) item.photo = defaulPhoto;
                });
                setPerson(response.data.results);
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
            });
    };

    ////STYLE
    const menuDropDownStyle = {
        background: "#434343",
        color: "#ffff",
    };

    /////TABLE PERSON
    const columns = [
        {
            title: "Foto",
            render: (item) => {
                return (
                    <div>
                        <Avatar src={item.photo} />
                    </div>
                );
            },
        },
        {
            title: "Nombre",
            render: (item) => {
                let personName = item.first_name + " " + item.flast_name;
                if (item.mlast_name) personName = personName + " " + item.mlast_name;
                return <div>{personName}</div>;
            },
        },
        {
            title: "Estatus",
            render: (item) => {
                return (
                    <>
                        <Switch
                            disabled={permissions.change_status ? false : true}
                            defaultChecked={item.is_active}
                            checkedChildren="Activo"
                            unCheckedChildren="Inactivo"
                            onChange={() => onchangeStatus(item)}
                        />
                    </>
                );
            },
        },
        {
            title: "Fecha de ingreso",
            render: (item) => {
                return <div>{item.date_of_admission}</div>;
            },
        },
        {
            title: "Empresa",
            render: (item) => {
                return <div>{item.job[0] ? item.job[0].department.node.name : ""}</div>;
            },
        },
        {
            title: "Departamento",
            render: (item) => {
                return <div>{item.job[0] ? item.job[0].department.name : ""}</div>;
            },
        },
        {
            title: "Puesto",
            render: (item) => {
                return <div>{item.job[0] ? item.job[0].name : ""}</div>;
            },
        },
        {
            title: "RFC",
            dataIndex: "rfc",
            key: "rfc",
        },
        {
            title: "IMSS",
            dataIndex: "imss",
            key: "imss",
        },
        {
            title: () => {
                return (
                    <>
                        {permissions.delete && (
                            <Dropdown overlay={menuGeneric}>
                                <Button style={menuDropDownStyle} size="small">
                                    <EllipsisOutlined />
                                </Button>
                            </Dropdown>
                        )}
                    </>
                );
            },
            render: (item) => {
                return (
                    <>
                        {permissions.edit || permissions.delete ? (
                            <Dropdown overlay={() => menuPerson(item)}>
                                <Button
                                    style={{ background: "#8c8c8c", color: "withe" }}
                                    size="small"
                                >
                                    <EllipsisOutlined />
                                </Button>
                            </Dropdown>
                        ) : (
                            ""
                        )}
                    </>
                );
            },
        },
    ];
    const rowSelectionPerson = {
        onChange: (selectedRowKeys, selectedRows) => {
            setPersonsToDelete(selectedRows);
        },
    };
    const onchangeStatus = (value) => {
        value.is_active ? (value.is_active = false) : (value.is_active = true);
        let data = {
            id: value.id,
            status: value.is_active,
        };
        // Axios.put(API_URL + `/person/person/${value.id}/`, value)
        Axios.post(API_URL + `/person/person/change_is_active/`, data)
            .then((response) => {
                if (!response.data.photo) response.data.photo = defaulPhoto;
                response.data.key = value.key;
                person.map((a) => {
                    if (a.id == response.data.id) a = response.data;
                });
            })
            .catch((error) => {
                message.error("Ocurrio un error intente de nuevo.");
                getPerson();
                console.log(error);
            });
    };

    const menuGeneric = (
        <Menu>
            {permissions.delete && (
                <Menu.Item onClick={() => setDeleteModal(personsToDelete)}>
                    Eliminar
                </Menu.Item>
            )}
        </Menu>
    );
    const menuPerson = (item) => {
        return (
            <Menu>
                {permissions.edit && (
                    <Menu.Item>
                        <Link href={`/home/${item.id}`}>Editar</Link>
                    </Menu.Item>
                )}
                {permissions.delete && (
                    <Menu.Item onClick={() => setDeleteModal([item])}>Eliminar</Menu.Item>
                )}
            </Menu>
        );
    };

    ////DEFAULT SELECT
    const genders = [
        {
            label: "Todos",
            value: 0,
        },
        {
            label: "Masculino",
            value: 1,
        },
        {
            label: "Femenino",
            value: 2,
        },
        {
            label: "Otro",
            value: 3,
        },
    ];
    const statusSelect = [
        {
            label: "Todos",
            value: -1,
        },
        {
            label: "Activos",
            value: true,
        },
        {
            label: "Inactivos",
            value: false,
        },
    ];

    /////DELETE MODAL
    const setDeleteModal = async (value) => {
        setStringToDelete("Eliminar usuarios ");
        if (value.length > 0) {
            if (value.length == 1) {
                setStringToDelete(
                    "Eliminar usuario " + value[0].first_name + " " + value[0].flast_name
                );
            }
            setPersonsToDelete(value);
            let ids = null;
            value.map((a) => {
                if (ids) ids = ids + "," + a.id;
                else ids = a.id;
            });
            setIdsDelete(ids);
            /* setModalDelete(true); */
            showModalDelete();
        } else {
            message.error("Selecciona una persona.");
        }
    };

    const showModalDelete = () => {
        modalDelete ? setModalDelete(false) : setModalDelete(true);
    };
    const ListElementsToDelete = ({ personsDelete }) => {
        return (
            <div>
                {personsDelete.map((p) => {
                    return (
                        <>
                            <Row style={{ marginBottom: 15 }}>
                                <Avatar src={p.photo} />
                                <span>{" " + p.first_name + " " + p.flast_name}</span>
                            </Row>
                        </>
                    );
                })}
            </div>
        );
    };

    ////IMPORT/EXPORT PERSON
    const exportPersons = () => {
        setLoading(true);
        filter(formFilter.getFieldsValue());
        filters.format = "data";
        Axios.post(API_URL + `/person/person/export_csv/`, filters)
            .then((response) => {
                const type = response.headers["content-type"];
                const blob = new Blob([response.data], {
                    type: type,
                    encoding: "UTF-8",
                });
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = "Personas.csv";
                link.click();
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
                console.log(e);
            });
    };
    const downLoadPlantilla = () => {
        setLoading(true);
        Axios.post(API_URL + `/person/person/export_csv/`, {
            format: "plantilla",
            is_active: "true",
        })
            .then((response) => {
                const type = response.headers["content-type"];
                const blob = new Blob([response.data], {
                    type: type,
                    encoding: "UTF-8",
                });
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = "PlantillaPersonas.csv";
                link.click();
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
                console.log(e);
            });
    };
    const importPersonFile = async (e) => {
        let extension = getFileExtension(e.target.files[0].name);
        if (extension == "csv") {
            let formData = new FormData();
            formData.append("File", e.target.files[0]);
            setLoading(true);
            Axios.post(API_URL + `/person/person/import_csv/`, formData)
                .then((response) => {
                    setLoading(false);
                    message.success("Excel importado correctamente.");
                    getPerson();
                })
                .catch((e) => {
                    getPerson();
                    setLoading(false);
                    message.error("Error al importar.");
                    console.log(e);
                });
        } else {
            message.error("Formato incorrecto, suba un archivo .csv");
        }
    };
    const getFileExtension = (filename) => {
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
    };

    ////SEARCH FILTER
    const filter = (value) => {
        if (value && value.name !== undefined) {
            urlFilter = urlFilter + "first_name__icontains=" + value.name + "&";
            // urlFilter = urlFilter + "&flast_name__icontains=" + value.name + "&";
            // urlFilter = urlFilter + "&mlast_name__icontains=" + value.name + "&";
        }
        if (value && value.gender !== undefined && value.gender != 0) {
            urlFilter = urlFilter + "gender=" + value.gender + "&";
        }

        if (value && value.is_active !== undefined && value.is_active != -1) {
            urlFilter = urlFilter + "is_active=" + value.is_active + "&";
        }
        if (value && value.node !== undefined) {
            urlFilter = urlFilter + "job__department__node__id=" + value.node + "&";
        }
        if (value && value.department !== undefined) {
            urlFilter = urlFilter + "job__department__id=" + value.department + "&";
        }
        if (value && value.job !== undefined) {
            urlFilter = urlFilter + "job__id=" + value.job + "&";
        }
        filterPersonName(urlFilter);
    };

    const resetFilter = () => {
        formFilter.resetFields();
        setStatus(true);
        getPerson();
    };

    const getNodes = () => {
        Axios.get(API_URL + `/business/node/`)
            .then((response) => {
                let data = response.data.results;
                let options = [];
                data.map((item) => {
                    options.push({
                        value: item.id,
                        label: item.name,
                        key: item.name + item.id,
                    });
                });
                setNodes(options);
            })
            .catch((error) => {
                console.log(error);
                setNodes([]);
            });
    };

    const changeNode = (value) => {
        setDepartments([]);
        setJobs([]);
        Axios.get(API_URL + `/business/department/?node=${value}`)
            .then((response) => {
                if (response.status === 200) {
                    let dep = response.data.results;
                    dep = dep.map((a) => {
                        return { label: a.name, value: a.id };
                    });
                    setDepartments(dep);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const changeDepartment = (value) => {
        setJobs([]);
        Axios.get(API_URL + `/person/job/?department=${value}`)
            .then((response) => {
                if (response.status === 200) {
                    let job = response.data.results;
                    job = job.map((a) => {
                        return { label: a.name, value: a.id };
                    });
                    setJobs(job);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const AlertDeletes = () => (
        <div>
            Al eliminar este registro perderá todos los datos relacionados a el de
            manera permanente. ¿Está seguro de querer eliminarlo
            <br />
            <br />
            <ListElementsToDelete personsDelete={personsToDelete} />
        </div>
    );

    useEffect(() => {
        if (modalDelete) {
            Modal.confirm({
                title: stringToDelete,
                content: <AlertDeletes />,
                icon: <ExclamationCircleOutlined />,
                okText: "Si, eliminar",
                okButtonProps: {
                    danger: true,
                },
                onCancel() {
                    setModalDelete();
                },
                cancelText: "Cancelar",
                onOk() {
                    deletePerson();
                },
            });
        }
        /* title={stringToDelete}
                    visible={modalDelete}
                    onOk={deletePerson}
                    onCancel={showModalDelete}
                    okText="Si, Eliminar"
                    cancelText="Cancelar"
                >
                    Al eliminar este registro perderá todos los datos relacionados a el de
                    manera permanente. ¿Está seguro de querer eliminarlo */
    }, [modalDelete]);

    return (
        <MainLayout currentKey="1">
            <Breadcrumb>
                <Breadcrumb.Item>Inicio</Breadcrumb.Item>
                <Breadcrumb.Item>Personas</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container" style={{ width: "100%" }}>
                {permissions.view ? (
                    <>
                        <Row justify={"space-between"} className={"formFilter"}>
                            <Col>
                                <Form onFinish={filter} layout={"vertical"} form={formFilter}>
                                    <Row gutter={[24, 8]}>
                                        <Col>
                                            <Form.Item name="name" label={"Nombre, apellido"}>
                                                <Input
                                                    allowClear={true}
                                                    placeholder="Nombre, Apellido"
                                                    style={{ width: 150 }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <Form.Item name="gender" label="Género">
                                                <Select options={genders} placeholder="Todos" style={{ width: 110 }} />
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <Form.Item name="node" label="Empresa">
                                                <Select
                                                    onChange={changeNode}
                                                    options={nodes}
                                                    placeholder="Todos"
                                                    style={{ width: 150 }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <Form.Item name="department" label="Departamento">
                                                <Select
                                                    onChange={changeDepartment}
                                                    options={departments}
                                                    placeholder="Todos"
                                                    style={{ width: 100 }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <Form.Item name="job" label="Puesto">
                                                <Select
                                                    options={jobs}
                                                    placeholder="Todos"
                                                    style={{ minWidth: 100 }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <Form.Item name="is_active" label="Estatus">
                                                <Select
                                                    options={statusSelect}
                                                    placeholder="Estatus"
                                                    style={{ width: 90 }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col style={{ display: "flex" }}>
                                            <Tooltip
                                                title="Filtrar"
                                                color={"#3d78b9"}
                                                key={"#3d78b9"}
                                            >
                                                <Button
                                                    style={{
                                                        background: "#fa8c16",
                                                        fontWeight: "bold",
                                                        color: "white",
                                                        marginTop: "auto",
                                                    }}
                                                    htmlType="submit"
                                                >
                                                    <SearchOutlined />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip
                                                title="Limpiar filtros"
                                                color={"#3d78b9"}
                                                key={"#3d78b9"}
                                            >
                                                <Button
                                                    onClick={() => resetFilter()}
                                                    style={{ marginTop: "auto", marginLeft: 10 }}
                                                >
                                                    {/* Limpiar filtros */}
                                                    <SyncOutlined />
                                                </Button>
                                            </Tooltip>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                            <Col style={{ display: "flex" }}>
                                {permissions.create && (
                                    <Button
                                        style={{
                                            background: "#fa8c16",
                                            fontWeight: "bold",
                                            color: "white",
                                            marginTop: "auto",
                                        }}
                                        onClick={() => getModalPerson(true)}
                                    >
                                        <PlusOutlined />
                    Agregar persona
                                    </Button>
                                )}
                            </Col>
                        </Row>
                        <Row justify={"end"} style={{ padding: "1% 0" }}>
                            {permissions.export && (
                                <Button
                                    className={"ml-20"}
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    size={{ size: "large" }}
                                    onClick={() => exportPersons()}
                                >
                                    Descargar resultados
                                </Button>
                            )}
                            {permissions.import && (
                                <Button
                                    className={"ml-20"}
                                    icon={<UploadOutlined />}
                                    onClick={() => {
                                        inputFileRef.current.click();
                                    }}
                                >
                                    Importar personas
                                </Button>
                            )}
                            <input
                                ref={inputFileRef}
                                type="file"
                                style={{ display: "none" }}
                                onChange={(e) => importPersonFile(e)}
                            />
                            <Button
                                className={"ml-20"}
                                type="primary"
                                icon={<DownloadOutlined />}
                                size={{ size: "large" }}
                                onClick={() => downLoadPlantilla()}
                            >
                                Descargar plantilla
              </Button>
                        </Row>
                        <Table
                            className={"mainTable"}
                            size="small"
                            columns={columns}
                            dataSource={person}
                            loading={loading}
                            rowSelection={rowSelectionPerson}
                        />
                    </>
                ) : (
                    "No tienes los permisos suficientes, contacta con un admnistrador"
                )}
            </div>
            <FormPerson close={getModalPerson} visible={modalAddPerson} />
            {/* <Modal
                title={stringToDelete}
                visible={modalDelete}
                onOk={deletePerson}
                onCancel={showModalDelete}
                okText="Si, Eliminar"
                cancelText="Cancelar"
            >
                Al eliminar este registro perderá todos los datos relacionados a el de
                manera permanente. ¿Está seguro de querer eliminarlo
        <br />
                <ListElementsToDelete personsDelete={personsToDelete} />
            </Modal> */}
        </MainLayout>
    );
};
export default withAuthSync(homeScreen);

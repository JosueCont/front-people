import React from "react";
import { Table, Select } from "antd";
import styled from "styled-components";
import { Row, Col, Badge } from "antd";
import _ from "lodash";

const ReactionsImg = styled.img`
  max-width: 20px;
  margin: auto;
`;
const ReactionsCount = styled.p`
  margin: 0px 0px 0px 10px;
  font-size: 1em;
  font-weight: bold;
  display: inline;
  width: fit-content;
`;
const CustomTable = styled(Table)`
  & .ant-table-cell {
    padding-left: 5px;
    padding-right: 5px;
    text-align: center;
  }
  & .publication-column {
    width: 20%;
  }
  & .small-column {
    width: 9%;
    min-width: 110px;
  }
  & .date-column {
    width: 16%;
  }
`;
const PublicationsStatisticsTable = ({
  current = 1,
  total = 1,
  fetching,
  processedPublicationsList,
  changePage,
  parameters,
  changeStatus,
  ...props
}) => {
  const { Option } = Select;

  const optionsActions = [
    {
      label: "Pendiente",
      value: 2,
    },
    {
      label: "Publicada",
      value: 1,
    },
    {
      label: "Bloqueada",
      value: 0,
    },
  ];

  const ReactionByType = ({
    reactions = [
      { 1: "0" },
      { 2: "0" },
      { 3: "0" },
      { 4: "0" },
      { 5: "0" },
      { 6: "0" },
      { 7: "0" },
    ],
  }) => (
    <>
      {/* <Row>
                <Col span={8}>
                        <ReactionsImg src='/images/reactionsIcons/me_gusta.svg' alt='img' /> tipo 1
                </Col>
                <Col span={8}>
                    <ReactionsImg src='/images/reactionsIcons/me_enoja.svg' alt='mg' /> tipo 2
                </Col>
                <Col span={8}>
                    <ReactionsImg src='/images/reactionsIcons/me_asombra.svg' alt='mg' /> tipo 3
                </Col>
                <Col span={8}>
                    <ReactionsImg src='/images/reactionsIcons/me_encanta.svg' alt='mg' /> tipo 4
                </Col>
                <Col span={8}>
                    <ReactionsImg src='/images/reactionsIcons/me_divierte.svg' alt='mg' /> tipo 5
                </Col>
                <Col span={8}>
                    <ReactionsImg src='/images/reactionsIcons/me_entristece.svg' alt='mg' /> tipo 6
                </Col>
                <Col span={8}>
                    <ReactionsImg src='/images/reactionsIcons/me_interesa.svg' alt='mg' /> tipo 7
                </Col>
            </Row> */}
      <Row>
        {reactions ? (
          <>
            {reactions.map((reaction, index) => (
              <Col
                span={8}
                style={{ textAlign: "center", marginBottom: "10px" }}
                key={`col_${index}`}
              >
                <ReactionsImg
                  src={`/images/reactionsIcons/${index + 1}.svg`}
                  alt="icon"
                  key={`reaction_${index}`}
                />
                <ReactionsCount key={`count_${index}`}>
                  {reaction[index + 1]}
                </ReactionsCount>
              </Col>
            ))}
          </>
        ) : (
          ""
        )}
      </Row>
    </>
  );

  const columns = [
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      className: "date-column",
      width: 150,
    },
    {
      title: "Publicación",
      dataIndex: "publication",
      key: "publication",
      className: "publication-column",
      width: 350,
      render: (publication) => (
        <>
          {publication && publication != "" ? (
          <div dangerouslySetInnerHTML={{__html: publication}}></div>
          ) : (
            <i>*Esta publicación es de contenido multimedia</i>
          )}
        </>
      ),
    },
    {
      title: "Publicado por",
      dataIndex: "owner",
      key: "owner",
    },
    {
      title: "Grupo",
      key: "owner",
      render: (row) => (row.group && row.group.name ? row.group.name : "--"),
    },
    {
      title: "Comentarios",
      dataIndex: "comments",
      key: "comments",
      className: "small-column",
    },
    {
      title: "Impresiones",
      dataIndex: "prints",
      key: "prints",
      className: "small-column",
    },
    {
      title: "Clics",
      dataIndex: "clicks",
      key: "clicks",
    },
    {
      title: "Reacciones",
      dataIndex: "totalReactions",
      key: "totalReactions",
    },
    {
      title: "Estatus",
      key: "status",
      render: (row) => (
        <Select
          value={row.status}
          options={optionsActions}
          onChange={(e) => changeStatus(row, e)}
          placeholder="Estatus"
        ></Select>
      ),
    },
    {
      title: "Reacciones por tipo",
      dataIndex: "reactions",
      key: "reactions",
      render: (reactions) => (
        <>
          <ReactionByType reactions={reactions} />
        </>
      ),
    },
  ];

  const handleChange = (pagination) => {
    // if(props.parameters && props.parameters != '')
    changePage(
        props.currentNode,
        pagination.current,
        parameters ? parameters : ''
    );
  };

  return (
    <>
      <CustomTable
        columns={columns}
        scroll={{ x: 800 }}
        pagination={{
          current: current,
          pageSize: 10,
          total: total,
        }}
        dataSource={processedPublicationsList}
        onChange={handleChange}
        loading={fetching}
      />
    </>
  );
};

export default PublicationsStatisticsTable;

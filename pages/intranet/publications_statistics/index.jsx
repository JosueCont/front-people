import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withAuthSync } from "../../../libs/auth";
import moment from "moment";
import { ConfigProvider } from "antd";
import esES from "antd/lib/locale/es_ES";

import MainLayout from "../../../layout/MainLayout";

import { publicationsListAction } from "../../../redux/IntranetDuck";
import { useGetCompanyId } from "../../../utils/useGetCompanyId";
import PublicationsStatisticsTable from "../../../components/statistics/PublicationsStatisticsTable";
import PublicationsStatisticsFilters from "../../../components/statistics/PublicationsStatisticsFilters";

const index = (props) => {
  const [publicationsList, setPublicationsList] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [processedPublications, setProcessedPubications] = useState([]);
  const [parameters, setParameters] = useState("");
  // Hook para traer la compania
  const { companyId, getCompanyId } = useGetCompanyId();

  useEffect(() => {
    moment.locale("es-mx");
    if (props.currentNode) {
      props.publicationsListAction(props.currentNode.id, 1);
      getCompanyId();
    }
  }, [props.current]);

  useEffect(() => {
    console.log('publicationsList',publicationsList);
  }, [publicationsList])
  

  useEffect(() => {
    setLoadingData(true);
    if (props.publicationsList && props.publicationsList.results) {
      let publicationsFiltered = [];
      try {
        props.publicationsList.results.map((publication) => {
          // Se filtran las propiedades a utilizar en la tabla
          publicationsFiltered.push({
            date: moment(new Date(publication.timestamp)).format(
              "DD MMMM hh:mm a"
            ),
            publication: publication.content,
            owner: `${publication.owner.first_name} ${publication.owner.flast_name}`,
            comments: publication.comments ? publication.comments.length : 0,
            clicks: publication.clicks ? publication.clicks : 0,
            prints: publication.prints ? publication.prints : 0,
            reactions: publication.count_by_reaction_type
              ? publication.count_by_reaction_type
              : [],
          });
        });
        // Contiene el data ya ordenado para la tabla
        setProcessedPubications(publicationsFiltered);
        setPublicationsList(props.publicationsList);
        setLoadingData(false);
      } catch (error) {
        console.log(error);
      }
    }
    setProcessedPubications([
          {
            date: '',
            publication: 'publication.content',
            owner: `sada`,
            comments: 0,
            clicks:  0,
            prints: 0,
            reactions: [],
            isActive: true
          }
        ]);
  }, [props.publicationsList]);

  return (
    <>
      {props.currentNode && (
        <MainLayout currentKey="1">
          <ConfigProvider locale={esES}>
            <PublicationsStatisticsFilters
              style={{ margin: "30px 0px" }}
              companyId={props.currentNode.id}
              getPostsByFilter={props.publicationsListAction}
              setParameters={setParameters}
            />
            <PublicationsStatisticsTable
              current={publicationsList.data ? publicationsList.data.page : 1}
              total={publicationsList.data ? publicationsList.data.count : 1}
              fetching={loadingData}
              processedPublicationsList={processedPublications}
              changePage={props.publicationsListAction}
              parameters={parameters}
            />
          </ConfigProvider>
        </MainLayout>
      )}
    </>
  );
};

const mapState = (state) => {
  return {
    publicationsList: state.intranetStore.publicationsList,
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState, { publicationsListAction })(
  withAuthSync(index)
);

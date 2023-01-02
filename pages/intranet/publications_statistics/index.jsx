import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withAuthSync } from "../../../libs/auth";
import moment from "moment";
import {Breadcrumb, ConfigProvider, notification} from "antd";
import esES from "antd/lib/locale/es_ES";
import _ from "lodash";
import MainLayout from "../../../layout/MainInter";
import WebApiIntranet from "../../../api/WebApiIntranet";
import { publicationsListAction } from "../../../redux/IntranetDuck";
import PublicationsStatisticsTable from "../../../components/statistics/PublicationsStatisticsTable";
import PublicationsStatisticsFilters from "../../../components/statistics/PublicationsStatisticsFilters";
import {FormattedMessage} from "react-intl";
import { verifyMenuNewForTenant } from "../../../utils/functions";

const index = ({user, ...props}) => {
  const [publicationsList, setPublicationsList] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [processedPublications, setProcessedPubications] = useState([]);
  const [parameters, setParameters] = useState(null);
  const [validatePermition, setValidatePermition] = useState(true);
  
  useEffect(() => {
    let isUserKhor = user?.sync_from_khor
    if(isUserKhor){
      let permsUser = user?.khor_perms;
      if( permsUser != null){
        let permYnl = user?.khor_perms.filter(item => item === "Khor Plus Red Social")
        if( permYnl.length > 0 ){
          setValidatePermition(true);
        }else{
          setValidatePermition(false);
        }
      }else{
        setValidatePermition(false);
      }
    }else{
      setValidatePermition(true);
    }
  }, [user]);

  // Hook para traer la compania

  useEffect(() => {
    moment.locale("es-mx");
    if (props.currentNode) {
      props.publicationsListAction(props.currentNode.id, 1, '&limit=10');
    }
  }, [props.currentNode]);

  useEffect(() => {}, [publicationsList]);

  useEffect(() => {
    setLoadingData(true);
    if (props.publicationsList && props.publicationsList.results) {
      let publicationsFiltered = [];
      try {
        props.publicationsList.results.map((publication) => {
          // Se filtran las propiedades a utilizar en la tabla
          publicationsFiltered.push({
            id: publication.id,
            date: moment(new Date(publication.timestamp)).format(
              "DD MMMM hh:mm a"
            ),
            publication: publication.content,
            group: _.get(publication, "group.name", ""),
            owner: `${publication.owner.first_name} ${publication.owner.flast_name}`,
            comments: publication.comments ? publication.comments.length : 0,
            clicks: publication.clicks ? publication.clicks : 0,
            totalReactions: publication.reactions ? publication.reactions.length : 0,
            group: publication.group ? publication.group : "",
            prints: publication.prints ? publication.prints : 0,
            reactions: publication.count_by_reaction_type
              ? publication.count_by_reaction_type
              : [],
            status: publication.status,
          });
        });
        // Contiene el data ya ordenado para la tabla
        setProcessedPubications(publicationsFiltered);
        setPublicationsList(props.publicationsList);
        setLoadingData(false);
      } catch (error) {
        setLoadingData(false);
        console.log(error);
      }
    }
  }, [props.publicationsList]);

  const changeStatus = async (post, status) => {
    WebApiIntranet.updateStatusPost(post.id, { status: status }).then(
      (response) => {
        let idx = processedPublications.findIndex(
          (item) => item.id === post.id
        );
        let newPost = {
          key: response.data.timestamp,
          id: response.data.id,
          date: moment(new Date(response.data.timestamp)).format(
            "DD MMMM hh:mm a"
          ),
          publication: response.data.content,
          owner: `${response.data.owner.first_name} ${response.data.owner.flast_name}`,
          comments: response.data.comments ? response.data.comments.length : 0,
          clicks: response.data.clicks ? response.data.clicks : 0,
          totalReactions: response.reactions ? response.reactions.length : 0,
          prints: response.data.prints ? response.data.prints : 0,
          reactions: response.data.count_by_reaction_type
            ? response.data.count_by_reaction_type
            : [],
          status: response.data.status,
        };

        let PostTemp = [...processedPublications];
        PostTemp[idx] = newPost;
        setProcessedPubications(PostTemp);

        notification["success"]({
          message: "Estatus actualizado",
        });
      }
    );
  };

  return (
    <>
      <MainLayout currentKey={["publications_statistics"]} defaultOpenKeys={["commitment","intranet"]}>
        <Breadcrumb className={"mainBreadcrumb"} key="mainBreadcrumb">
          <Breadcrumb.Item
              className={"pointer"}
              onClick={() => router.push({ pathname: "/home/persons/" })}
          >
            <FormattedMessage defaultMessage="Inicio" id="web.init" />
          </Breadcrumb.Item>
          {verifyMenuNewForTenant() && 
            <Breadcrumb.Item>Compromiso</Breadcrumb.Item>
          }
          <Breadcrumb.Item>KHOR Connect</Breadcrumb.Item>
          <Breadcrumb.Item>Moderación</Breadcrumb.Item>
        </Breadcrumb>
        { validatePermition ? (
          <ConfigProvider locale={esES}>
            <PublicationsStatisticsFilters
              style={{ margin: "30px 0px" }}
              companyId={props.currentNode ? props.currentNode.id : null}
              getPostsByFilter={props.publicationsListAction}
              setParameters={setParameters}
            />
            <br />
            <PublicationsStatisticsTable
              style={{ marginTop: 20 }}
              currentNode={props.currentNode ? props.currentNode.id : null}
              current={publicationsList.data ? publicationsList.data.page : 1}
              total={publicationsList.data ? publicationsList.data.count : 1}
              fetching={loadingData}
              processedPublicationsList={processedPublications}
              changePage={props.publicationsListAction}
              parameters={parameters}
              changeStatus={changeStatus}
            />
          </ConfigProvider>
        ) : (
          <div className="notAllowed" />
        )
        }
      </MainLayout>
    </>
  );
};

const mapState = (state) => {
  return {
    publicationsList: state.intranetStore.publicationsList,
    currentNode: state.userStore.current_node,
    user: state.userStore.user,
  };
};

export default connect(mapState, { publicationsListAction })(
  withAuthSync(index)
);

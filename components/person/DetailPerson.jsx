import { Card, Typography } from "antd";
import { useEffect } from "react";
import GeneralDataPErson from "../../components/forms/GeneralDataPerson";

const DetailPerson = ({ person, setLoading, ...props }) => {
  const { Title } = Typography;

  return (
    <>
      <Title level={3}>Información Personal</Title>
      <Title level={4} style={{ marginTop: 0 }}>
        {/* {personFullName} */}
        Jasson Manuel
      </Title>
      <Card bordered={true}>
        <GeneralDataPErson person={person} setLoading={setLoading} />
      </Card>
    </>
  );
};

export default DetailPerson;

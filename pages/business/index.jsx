import React from "react";
import BusinessForm from "../../components/business/BusinessForm";
import { withAuthSync } from "../../libs/auth";

const Business = () => {
  return <BusinessForm />;
};

export default withAuthSync(Business);

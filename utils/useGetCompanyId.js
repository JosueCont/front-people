import { useState } from "react";

export const useGetCompanyId = () => {
  const [companyId, setCompanyId] = useState(null);

  const getCompanyId = () => {
    if (localStorage.getItem("data")) {
      setCompanyId(localStorage.getItem("data"));
    }
  };

  return {
    companyId,
    getCompanyId,
  };
};

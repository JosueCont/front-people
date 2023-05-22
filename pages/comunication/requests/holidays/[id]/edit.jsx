import React from "react";
import { withAuthSync } from "../../../../../libs/auth";
import AddOrEditRequets from "../../../../../components/comunication/requets/AddOrEditRequets";

const HolidaysDetails = () => {
    return (
        <AddOrEditRequets action="edit" />
    )
}

export default withAuthSync(HolidaysDetails)

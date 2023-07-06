import React from "react";
import { withAuthSync } from "../../../../../libs/auth";
import AddOrEditRequets from "../../../../../components/comunication/requets/AddOrEditRequets";

const HolidaysDetails = () => {
    return (
        <AddOrEditRequets
            action="edit"
            isAdmin={false}
        />
    )
}

export default withAuthSync(HolidaysDetails)

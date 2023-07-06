import React from "react";
import { withAuthSync } from "../../../../libs/auth";
import AddOrEditRequets from "../../../../components/comunication/requets/AddOrEditRequets";

const index = () => {
    return (
        <AddOrEditRequets
            action="add"
            isAdmin={false}
        />
    )
}

export default withAuthSync(index)

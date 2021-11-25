export const getFlavor = () => {
  let tenant = "demo";
  try {
    if (typeof window !== "undefined") {
      let splitDomain = window.location.hostname.split(".");
      if (splitDomain.length > 0) {
        tenant = splitDomain[0];
      }
    }

    const setup = require(`../public/flavors/${tenant}/${tenant}.json`);

    return setup;
  } catch (error) {
    let tenant = "demo";
    const setup = require(`../public/flavors/${tenant}/${tenant}.json`);

    return setup;
    // return false;
  }
};

export const getRouteFlavor = () => {
  let tenant = "demo";
  try {
    if (typeof window !== "undefined") {
      let splitDomain = window.location.hostname.split(".");
      if (splitDomain.length > 0) {
        tenant = splitDomain[0];
      }
    }

    const setup = require(`../public/flavors/${tenant}/${tenant}.json`);
    const tenant_flavor = "flavors/" + tenant;
    return tenant_flavor;
  } catch (error) {
    let tenant = "demo";
    const tenant_flavor = "flavors/" + tenant;
    return tenant_flavor;
    // return false;
  }
};

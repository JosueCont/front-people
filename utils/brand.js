export const getFlavor = () => {
    try {
          let tenant = 'demo';
      
          if (typeof window !== 'undefined') {
              let splitDomain = window.location.hostname.split(".")
              if(splitDomain.length > 0 && !splitDomain[0].includes('localhost') ){
                  tenant = splitDomain[0]
              }
          }
          
          const setup = require(`../public/flavors/${tenant}/${tenant}.json`)
          
          return setup
        } catch (error) {
          return false
        }
  };
  
  export const getRouteFlavor = () => {
    try {
          let tenant = 'demo';
      
          if (typeof window !== 'undefined') {
              let splitDomain = window.location.hostname.split(".")
              if(splitDomain.length > 0 && !splitDomain[0].includes('localhost') ){
                  tenant = splitDomain[0]
              }
          }
          
          const setup = require(`../public/flavors/${tenant}/${tenant}.json`)
          const tenant_flavor = 'flavors/' + tenant
          return tenant_flavor
        } catch (error) {        
          return false
        }
        
  };



export const getCollection = (managerRole) => {
    let collection;
    switch (managerRole) {
      case "SALESMANAGER":
        collection = "salesmanager";
        break;
      case "LICENSEMANAGER":
        collection = "licensingmanager";
        break;
      case "PROJECTHANDLER":
        collection = "projecthandlermanager";
        break;
      case "STOREMANAGER":
        collection = "storemanager";
        break;
      case "MAINTAINANECEMANAGER":
        collection = "maintainanecemanager";
        break;
      case "ADMIN":
          collection = "Admin";
        break;
        case "DEALER":
          collection = "Dealer";
        break;
        case "STATEMANAGER":
          collection = "StateManager";
        break;
        case "DESIGNER":
          collection = "Designer";
        break;
      default:
        return (collection = null);
    }
  
    return collection;
  };
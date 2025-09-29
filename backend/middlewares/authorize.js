import isAuthenticated from "./isAuthenticated.js"
import roleCheck from "./roleCheck.js"


const authorize = ( roles = []) => {
    return [isAuthenticated,roleCheck(roles)];
};

export default authorize;
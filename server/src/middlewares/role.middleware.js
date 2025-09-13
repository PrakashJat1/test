
const authorizeRoles = (...allowedRoles) => {
    return (request,response,next) => {

        if(!allowedRoles.includes(request.user.role)){
            console.log(request.user.role);
           return response.status(403).json({message : "Access Denied"});
        }
        next();
    }
}

export default authorizeRoles;
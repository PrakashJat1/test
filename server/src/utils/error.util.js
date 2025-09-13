export const InternalServerError = (response,errorIn,error) => {
    console.log(`Error in ${errorIn}`, error);
    return response.status(500).json(`Error in ${errorIn}  ${error}`);   
}
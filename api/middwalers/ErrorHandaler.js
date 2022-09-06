//express error handaler

const ErrorHandaler = (error, req, res, next) =>{

    const errorStatus = error.status || 500;
    const errorMessage = error.message || 'Unknown errors';

    return res.status(errorStatus).json({
        message : errorMessage,
        status : errorMessage,
        stack : error.stack
    });

}


//export deafult
export default ErrorHandaler;
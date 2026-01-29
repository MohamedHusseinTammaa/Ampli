const signup = async (req, res,next) => {
    if(!req.body.name || !req.body.email || !req.body.password){
        return next(new ErrorHandler('Please fill all fields',400));
    }
}
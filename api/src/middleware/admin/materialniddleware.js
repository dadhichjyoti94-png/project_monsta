const validate = (request,response,next) =>{
    if(request.body){
        if(request.body.name == undefined || request.body.name == ''){
            const data ={
                _status : false,
                _message : 'Name is required',
                _data : null,
            }
            return response.send(data);
        }
        if(request.body.order == undefined || request.body.order == ''){
            const data ={
                _status : false,
                _message : 'Order is required',
                _data : null,
            }
            return response.send(data);
        }
    }else{
        const data ={
            _status : false,
            _message : 'Required field missing',
            _data : null,

        }
        return response.send(data);
    }
    
    next();

}
module.exports = validate
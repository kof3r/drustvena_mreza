/**
 * Created by Domagoj on 5.12.2015..
 */
function sendMessage(res, message, code){
    res.status(code);
    res.json({
        message: message
    })
}

function sendJsonResponse(res, data, code, err){
    res.status(code);
    res.json({
        status: code,
        data: data,
        err: err,
    })
}

module.exports = {
    sendJsonResponse: sendJsonResponse,
    sendMessage: sendMessage
}
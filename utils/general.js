/**
 * Created by Domagoj on 5.12.2015..
 */
function sendMessage(res, message, code){
    res.json({
        message: message
    })
    res.status(code)
}

module.exports = {
    sendMessage: sendMessage
}

const createMessage = (msg, username) =>{
    return {
        message:msg,
        createdAt: new Date().getTime(),
        username
    }
}
const createLocationMessage = (url, username)=>{
    return {
        url: url,
        createdAt: new Date().getTime(),
        username
    }
}
module.exports = {
    createMessage,
    createLocationMessage

}
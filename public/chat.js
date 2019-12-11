

const socket = io();

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $location = document.querySelector('#location');
const $locationButton = document.querySelector('button')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar');

//Message Template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
//options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix:true})

socket.on('locationMessage', (locMsg)=>{
    const html = Mustache.render(locationTemplate, {
        location: locMsg.url,
        createdAt: moment(locMsg.createdAt).format('h:mm a'),
        username: locMsg.username
    });
    $messages.insertAdjacentHTML("beforeend",html);
})

socket.on('message',(msg)=>{
    //console.log( msg)
    
    const html = Mustache.render(messageTemplate, {
        message: msg.message,    
        createdAt: moment(msg.createdAt).format('h:mm a'),
        username: msg.username
        //createdAt: moment(msg.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML("beforeend",html);
})


socket.on('roomData',(data)=>{
    const roomName = data.room;
    const users= data.users;
    console.log(users)
    const html = Mustache.render(sidebarTemplate,{
        room: roomName,
        users: users
    })
    document.querySelector('#sidebar').innerHTML =html;
    
})


$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    //disable messages
    $messageFormButton.setAttribute('disabled','disabled');

    const msg = e.target.elements.message.value;

    socket.emit('sendMessage',msg, (error)=>{
        //enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if(error){
            return console.log(error)
        }
        console.log('message Delivered! ');
    });
    
})


$location.addEventListener('click',()=>{
    //disable button
    
    if(!navigator.geolocation){
        return console.log('your browser doesnt support sharing location')
    }
    $locationButton.setAttribute('disabled','disabled');
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
                latitude: position.coords.latitude,
                longtitude:position.coords.longitude
            },(ack)=>{
                console.log('location shared')        
                $locationButton.removeAttribute('disabled')        
            })
        //console.log('my latitude is'+position.coords.latitude+" my longtitude is "+position.coords.longitude);
    })
})

socket.emit('join',{username,room}, (error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})
































// socket.on('valueUpdated', (count)=>{
//     console.log('value is now '+count);


// })
// document.querySelector('#increment').addEventListener('click',()=>{
//     //console.log('clicked')
//     socket.emit('increment');
// })
const users=[];

//addUser
const addUser = (id,username,room)=>{
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if(!username || !room){
        return {
            error: 'username and room are required'
        }
        
    }
    

    const existingUser = users.find((user)=>user.username === username )
    if(existingUser){
        return {
            error: 'this username is already taken'
        }
    }
    const user = {id,username,room}
    users.push(user);
    
    return {user}

}

const removeUser = (id)=>{
    const idx = users.findIndex((user)=> user.id ===id)
    if(idx!=-1){
        return users.splice(idx)[0];
    }
}

const getUser = (id)=>{
    const user = users.find((user)=>user.id === id)
    return user;
}

const getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase();
    userInRoom = users.filter((user)=>user.room === room)
    return userInRoom;
}



// addUser(30,'alon','north');
// addUser(31,'dcie','north');
// addUser(32,'dviros','south');
// addUser(33,'dodo','north');

// console.log(getUsersInRoom('north'));
// res= addUser(31,'dcie','north');

// console.log(res)

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}



//removeUser
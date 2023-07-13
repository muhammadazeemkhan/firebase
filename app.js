import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { 
getAuth, 
onAuthStateChanged,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut
 } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

 import { 
getDatabase,
ref,
set,
onValue,
push,
child,
get,
update,
remove
 } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";


 const firebaseConfig = {
  apiKey: "AIzaSyBEKu1UNujPKUUcQFFjmXa9DrKiYlkiqok",
  authDomain: "weather-app-874c4.firebaseapp.com",
  projectId: "weather-app-874c4",
  storageBucket: "weather-app-874c4.appspot.com",
  messagingSenderId: "740443576081",
  appId: "1:740443576081:web:ec343e459316f9abb49eb0",
  measurementId: "G-Y59C68DJ0T"
};


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);
const loader = document.getElementById('loadercontainer')
const content = document.getElementById('content-container')
const signupContainer = document.getElementById('signup-container')
const loginContainer = document.getElementById('login-container')
const logoutBtn = document.getElementById('logout')


onAuthStateChanged(auth, user => {
        if (user) {


          const uid = user.uid;
          console.log('uid=>', uid)
          loader.style.display = 'none'
          content.style.display = 'block'
          loginContainer.style.display= 'none'
          signupContainer.style.display = 'none'
          getTodos()
        } else {
          console.log('user mojood nahn he')
          loader.style.display = 'none'
          loginContainer.style.display= 'block'
          signupContainer.style.display = 'block'
          content.style.display = 'none'


        }
      });
      


const signUpBtn = document.getElementById('signup-btn')
signUpBtn.addEventListener('click', registeration)

function registeration(){

const userName = document.getElementById('signup-user-name').value 
const email = document.getElementById('signup-user-Email').value 
const password = document.getElementById('signup-user-password').value
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {

    const user = userCredential.user;
    console.log('user id=>' , user.uid)
    const userInfo = {
      userName:userName,
      email:email
    }
    console.log(userInfo)
    const userInfoRef = ref(database,`user/${user.uid}`)
    set(userInfoRef,userInfo)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage)

  });

}



const loginBtn = document.getElementById('login-btn')
loginBtn.addEventListener('click', signIn)


function signIn(){

const userName = document.getElementById('login-user-name').value 
const email = document.getElementById('login-user-Email').value 
const password = document.getElementById('login-user-password').value
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
console.log('Hello')
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage)
  });
}

logoutBtn.addEventListener('click',SignOut)

function SignOut(auth){
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {

        console.log(error)
      });
      
}


const addTodoBtn = document.getElementById('add-todo-btn')
const todoConatiner = document.getElementById('todo-container')
addTodoBtn.addEventListener('click',submitTodoFunction)
function submitTodoFunction(){
  const todoInput = document.getElementById('todo-input').value
  if(!todoInput) return alert('Please Add some todos')
  const todoObj = {
    task : todoInput ,
    status:'pending'
  }

  const todoObjRef = ref(database , `todos/${auth.currentUser.uid}`)
  const newtodoObjRef = push(todoObjRef)
  set(newtodoObjRef , todoObj)
  console.log(todoObj)
  document.getElementById('todo-input').value = ''
}


function getTodos(){
  const todoListRef =ref(database , `todos/${auth.currentUser.uid}`)
  onValue(todoListRef, snapshot => {
    const isDataExist = snapshot.exists()
    console.log(isDataExist)
    if(isDataExist){
      todoConatiner.innerHTML=null
      snapshot.forEach(data=>{
        const dataKey = data.key
        const dataValue = data.val()
        console.log('dataKey=>', dataKey)
        console.log('dataValue=>' , dataValue)
        const listItem = `
        <li>${dataValue.task}
        <button id=${dataKey} + '-edit'>Edit</button>
        <button id = ${dataKey} + '-delete'>Delete</button>
        </li>`
        todoConatiner.innerHTML +=listItem
        setTimeout(()=>{
          const editBtn = document.getElementById(dataKey + '-edit')
          const deleteBtn = document.getElementById(dataKey + '-delete')
          editBtn.addEventListener('click' , editFunction)
          deleteBtn.addEventListener('click' , deleteFunction)
        },1000)
      })
    }
  })

}

function editFunction(){
  const elementId = this.id.slice(0, this.id.length - 5)
  const todoRef = ref(database, `todos/${auth.currentUser.uid}/${elementId}`)
  let newTodo = prompt('Edit your todo', this.parentNode.firstChild)
  update(todoRef, { task: newTodo })
}

function deleteFunction(){
  const elementId = this.id.slice(0, this.id.length - 7)
  console.log(this.id.slice(0, this.id.length - 7))
  const todoRef = ref(database, `todos/${auth.currentUser.uid}/${elementId}`)
  remove(todoRef)
}
import {createTheme,Button,makeStyles,Modal,Input} from '@material-ui/core'
import React,{useEffect, useState} from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import {db,auth} from '../firebase'
import AddPost from './AddPost';
import Posts from './Posts'

const theme = createTheme();


function getmodalStyle(){
  return{
    top : '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
  };
}

const useStyles = makeStyles((theme) => ({
   paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2,4,3),

   },
}));



const Home = () => {
  const classes = useStyles()
  const [modalStyle] = useState(getmodalStyle)
  const[openSignup,setOpenSignup] = useState(false)
  const[openSignin,setOpenSignin] = useState(false)

  const[username,setusername] = useState('')
  const[email,setEmail] = useState('')
  const[password,setPassword] = useState('')
  const[user,setuser] = useState(null)
  const[posts,setPosts] = useState([])
  const signin = (e) => {

    e.preventDefault()
    auth.signInWithEmailAndPassword(email,password)
    .catch((e)=>alert(e.message))
    setOpenSignin(false)
  }

  const signup = (e) => {
    e.preventDefault()
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
      displayName: username,
    })

    })
    .catch((e)=>alert(e.message))
    setOpenSignup(false)
    


  };
  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
        .catch((error) => alert(error.message));

        setOpenSignin(false);
    // window.location.reload(false);
};

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if (authUser){
        setuser(authUser)

      }
        else{
          setuser(null)
        }
      
    })

        return () => {
            unsubscribe();
        };
    }, [user, username]);

    useEffect(() => {
        db.collection("posts")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
              console.log(snapshot.docs)  
              setPosts(
                    snapshot.docs.map((doc) => (
                    {
                        id: doc.id,
                        post: doc.data(),
                    }))
                );
                console.log(posts)
            });
            
    }, []);

  // useEffect(()=>{

    
  //   db.collection("posts")
  //   .orderBy("timestamp","desc")
  //   .onSnapshot((snapshot)=>{
  //     setPosts(
  //     snapshot.docs.map((doc)=>({
  //       id:doc.id,
  //       post:doc.data(),
  //     }))
  //     );


  //     });
  //   },[]);
  
  console.log(posts)
  return (
    <div className='app'>

      <Modal open={openSignup} onClose={()=>{setOpenSignup(false)}}>
        <div style ={modalStyle} className={classes.paper}>
          <form className='app__signup'>
          <center>
          <img
             
             
             className='app_headerImage'
             src = 'http://eternylstudios.com/wp-content/uploads/2019/02/instagram-logo-2.png'
             alt = 'logo'
             width = {160}
             height = {100}
             />
             </center>
             <br/>
             <br/>
             <Input
             placeholder='Name'
             type='text'
             value = {username}
             onChange = {(e) => {setusername(e.target.value)}}

             />
             <br/>
             <br/>
             <Input
             placeholder='Email'
             type='text'
             value = {email}
             onChange = {(e) => {setEmail(e.target.value)}}

             />
             <br/>
             <br/>
             <Input
             placeholder='Password'
             type='pass'
             value = {password}
             onChange = {(e) => {setPassword(e.target.value)}}

             />
             <br/>
             <br/>
             <button type = 'submit' onClick={signup}>Sign Up</button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignin} onClose={()=>{setOpenSignin(false)}}>
        <div style ={modalStyle} className={classes.paper}>
          <form className='app__signup'>
          <center>
          <img
             
             
             className='app_headerImage'
             src = 'http://eternylstudios.com/wp-content/uploads/2019/02/instagram-logo-2.png'
             alt = 'logo'
             width = {160}
             height = {100}
             />
             </center>
             <br/>
             <br/>
            
             
             <Input
             placeholder='Email'
             type='text'
             value = {email}
             onChange = {(e) => {setEmail(e.target.value)}}

             />
             <br/>
             <br/>
             <Input
             placeholder='Password'
             type='pass'
             value = {password}
             onChange = {(e) => {setPassword(e.target.value)}}

             />
             <br/>
             <br/>
             <button type = 'submit' onClick={signin}>Sign In</button>
          </form>
        </div>
      </Modal>
      <div className='app__header'>
        <img
             className='app_headerImage'
             src = 'http://eternylstudios.com/wp-content/uploads/2019/02/instagram-logo-2.png'
             alt = 'logo'
             width = {160}
             height = {100}
             />
        <div>
          {user ? <>
               <div style={{display : 'flex'}}>
                <h3 style={{margin: '15px'}} > {user.displayName}</h3>

              <Button variant ='contained' color='primary' onClick={() => {auth.signOut()}}>
                Logout
            </Button>
            </div>
          </>
             :<>
             <Button variant ='contained' color='primary' onClick={() => {setOpenSignin(true)}}>
                Sign In
            </Button>
            <span>
                &nbsp;
                &nbsp;
            </span>
            <Button variant = 'contained' color='primary' onClick={() => {setOpenSignup(true)}}>
                Sign Up
            </Button>
             </>
        }
            
        </div>
      </div>
      {user && user.displayName ? <>
      <AddPost username = {user.displayName} />
      </>:
      <>
      <div className='unauth'>
      Please <b onClick={() => setOpenSignin(true)} style={{ cursor: 'pointer', color: 'Blue' }}>Login</b>/<b onClick={() => setOpenSignup(true)} style={{ cursor: 'pointer', color: 'Blue' }}>Sign Up</b> to Add New Post
      </div>
      </>}
    {  
      <div className="app__posts">
        <div className="app__postright">
          <br/>
          {posts.map(({id,post})=>(
            <Posts
               key = {id}
               postId = {id}
               user = {user}
               userName = {post.userName}
               caption = {post.caption}
               imageURL = {post.imageUrl}
               />

              
          ))}
        </div>
      </div>
}
    </div>
  )
}

export default Home

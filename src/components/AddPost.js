import { TextField } from '@material-ui/core'
import React,{useState} from 'react'
import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";
import 'firebase/compat/storage';
import { storage, db } from "../firebase"

const AddPost = ({username}) => {
const [caption,setcaption] = useState('')
const[progress,setprogress] = useState(0)
const[image,setImage] = useState(null)
    const handleChange = (e) =>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }

    };

  const handleUpload = ()=>{
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
        (snapshot) =>{
            const progress = Math.round(
                (snapshot.bytesTransferred/snapshot.totalBytes) * 100
            );
            setprogress(progress); //for the progress bar animation
        },
        (error) =>{
            console.log(error);
            alert(error.message);
        },
        () => {
            storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url => {
                db.collection("posts").add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imageUrl : url,
                    userName : username

                })
            })
        }

    )
    setcaption('')
    setImage(null)


  }
  return (
    <div>
      <h2 style={{textAlign:'center', margin:'15px'}}>Add New Post</h2>
      <br/>
      <input className='file-input' type ="file" onChange={handleChange}/>
      <br/>
      <TextField id = "filled-basic" label="Set Caption" variant="filled"
      onChange={event => setcaption(event.target.value)}
      value = {caption}
      />
      <br/>
      <progress className='progress' value={progress} max = '100'/>
      <br/>
      <button variant='contained' color = 'primary' onClick = {handleUpload}>
        ADD POST
      </button>
    </div>
  )
}

export default AddPost

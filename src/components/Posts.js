import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import firebase from 'firebase/compat/app'
import EditIcon from '@mui/icons-material/Edit';
import {db} from '../firebase'
import {DeleteForever, DeleteForeverOutlined, EditOutlined} from '@material-ui/icons'

const Posts = ({postId,user,userName,caption,imageURL}) => {
console.log(imageURL)
  const [newComment,setNewComment] = useState('');
  const[editComment, setEditComment] = useState('');
  const [comments,setComments] = useState([]);
  const [commentID, setCommentID] = useState('');
  const [show, setShow] = useState(false)

  const postComment = (e) => {
    e.preventDefault()
    db.collection("posts").doc(postId).collection("comments").add({
      text : newComment,
      username : user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })

    setNewComment('')
  }
  useEffect(() => {
    let unsubscribe;
    if(postId){
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        //.orderBy('timestamp','desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map
            ((doc) => ({
              id: doc.id,
              comment: doc.data(),
            }))
            );
        });
    }
  
    return () => {
      unsubscribe();

    };

  }, [])

  const handleEdit = (id, txt) =>{
    setShow(true)
    setEditComment(txt)
    setCommentID(id)
  }

  const updateComment = () => {
    db.collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentID).update({
        text: editComment
      })
      setShow(false)
  }

  return (
    <div>
      <div className="post">
        <div className="post__header">
        <Avatar
                    className="post__avatar"
                    alt={userName}
                    src=" "
                />
          <h3>{userName}</h3>
        </div>
        <img
        className="post_image"
        src = {imageURL}
        />
        <p className="post__text">
          <b>{userName}&nbsp;</b>{caption}
        </p>
        <div className="post_comments">
          {comments.map(({id,comment}) =>(
            <>
            <p key = {id} style = {{display : 'flex'}}>
              <b>{comment.username}</b>: &nbsp; {comment.text}

              {(user.displayName === userName || comment.userName === user.displayName) &&
              <p>
                <EditOutlined style = {{ color: 'blue'}} onClick = {() => {handleEdit(id,comment.text) }} />
                <DeleteForeverOutlined style = {{color:'red'}} onClick={() =>{
                  db.collection("posts")
                    .doc(postId)
                    .collection("comments")
                    .doc(id).delete()

                }} />


              </p>
              }
            </p>
            </>
          )
          )}

        </div>

            
         
      </div>

      {user && show && <>
        <form className="post__commentbox">
        <input
        className='post__input'
        type = 'text'
        placeholder = 'Edit Comment...'
        value = {editComment}
        onChange={e => setEditComment(e.target.value)}
        />

        <button
        className='post__button'
        disabled = {!editComment}
        type = 'submit'
        onClick={updateComment}
        >Update Comment</button>
       


      </form>
      </>}
      {user && <>
      <form className="post__commentbox">
        <input
        className='post__input'
        type = 'text'
        placeholder = 'Post Comment...'
        value = {newComment}
        onChange={e => setNewComment(e.target.value)}
        />

        <button
        className='post__button'
        disabled = {!newComment}
        type = 'submit'
        onClick={postComment}
        >POST</button>
        {
          user.displayName === userName && 
          <DeleteForever style = {{color: 'red'}} onClick={()=>{
          db.collection("posts").doc(postId).delete()  
        }}/>
        }


      </form>
      </>

      }
      
    </div>
  )
}

export default Posts

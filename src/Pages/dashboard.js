import { signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../ConfigFirebase'
import logo from "../Images/logo.png"
import styles from "./dashboard.module.css"
import {database} from '../ConfigFirebase'
import { addDoc,deleteDoc,collection,doc, getDocs, updateDoc } from 'firebase/firestore'

function Dashboard() {

    const [title,setTitle] = useState('')
    const [description,setDescription] = useState('')
    const [filterOption,setFilterOption] = useState('all')
    const [searchQuery,setSearchQuery] = useState('')
    const [val,setVal] = useState([])

    const value = collection(database,"demo")

    useEffect(() => {
        const getData = async () =>{
            const dbval = await getDocs(value)
            const data = dbval.docs.map(doc=>({...doc.data(),id:doc.id}))
            setVal(data)
        }
        getData()
    })

    const handleAdd = async () =>{
        await addDoc(value,{title:title,description:description,complete:false,favourite:false,trash:false})
        setTitle('')
        setDescription('')
    }

    const handleDelete = async (id) => {
        const deleteVal = doc(database,'demo',id);
        await deleteDoc(deleteVal);
    }

    const handleComplete = async (id) => {
        const completeTodo = doc(database,'demo',id)
        await updateDoc(completeTodo,{complete:true})
    }

    const handleFavourite = async (id) => {
        const favouriteTodo = doc(database,'demo',id)
        await updateDoc(favouriteTodo,{favourite:true})
    }

    const handleTrash = async(id) => {
        const trashTodo = doc(database,"demo",id)
        await updateDoc(trashTodo,{trash:true})
        setVal(val.filter(item => item.id !== id))
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    }

    const handleFilterChange = (event) =>{
        setFilterOption(event.target.value);
    }

    const filteredVal = val.filter((item) => {
        if(filterOption === "all"){
            return item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.trash
        } else if(filterOption === "complete"){
            return item.complete === true && item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.trash;
        } else if(filterOption === 'favourite'){
            return item.favourite === true && item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.trash;
        } else if(filterOption === 'trash') {
            return item.trash && item.title.toLowerCase().includes(searchQuery.toLowerCase())
        } else {
            return false
        }
    })
    

    const navigate = useNavigate()

    const handleLogout = () => {
        signOut(auth).then(()=>{
            navigate('/')
        }).catch((err)=>{
            console.log(err,"error");
        })
    }

  return (
    <>
    <div className='row'>

        {/* Left */}
        <div className='col-lg-5 col-12'>
            <div className='row'>
                <div className='d-flex align-items-center justify-content-between'>
                    <a href='/'>
                        <img src={logo} alt="logo" className={`${styles.logo} mt-5 ms-5`}></img>
                    </a>
                    <button type="button" className={`btn mt-lg-5 ${styles.logout}`} style={{width:"100px",backgroundColor:"#FF6240",color:"white"}} onClick={handleLogout}>Log Out</button>
                </div>
            </div>
            <div className={`row d-flex justify-content-center align-items-center ${styles.left}`}>
                <div className='col-lg-9 col-9'>
                    <h3 className='text-center'>TODO</h3>
                    <p className='text-center mt-lg-3' style={{opacity:"70%"}}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Aliquet at eleifend feugiat vitae faucibus nibh dolor dui. 
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Aliquet at eleifend feugiat vitae faucibus nibh dolor dui. 
                    </p>
                    <div className='d-flex flex-column align-items-center'>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className={`mt-lg-3 mt-3 ${styles.title}`} id="title" placeholder="Title"></input>
                        <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" className={`mt-lg-3 mt-3 ${styles.description}`} id="description" placeholder="Description"></input>
                        <button onClick={handleAdd} className={`btn btn-primary mt-3 ${styles.add}`}>Add</button>
                    </div>
                </div>
            </div>
        </div>

        <div className={`col-lg-1 d-flex justify-content-center ${styles.centerLine}`}>
            <div className={`${styles.vline}`}></div>
        </div>

        {/* right */}
        <div className='col-lg-6 col-12'>
            <div className='row mt-lg-5'>
                <div className='col-lg-1 col-1'></div>
                <div className='col-lg-10 col-10'>
                    <div className=''>
                        <h4>TODO LIST</h4>
                    </div>
                    <div className='row mt-lg-5'>
                        <div className='d-flex justify-content-between'>
                            <input type="text" class={`${styles.search} form-control`} id="Search" placeholder="Search" value={searchQuery} onChange={handleSearchChange}/>
                            <select class={`${styles.filter} form-select`} id="floatingSelectGrid" value={filterOption} onChange={handleFilterChange}>
                                <option value="all">All</option>
                                <option value="complete">Completed</option>
                                <option value="favourite">Favourite</option>
                                <option value="trash">Trash</option>
                            </select>
                        </div>
                    </div>
                    {
                        filteredVal && filteredVal.map((value)=>(
                            <div key={value.id} className={`${styles.todolist} d-flex justify-content-between align-items-center`}>
                                <div className=''>
                                    <h5>{value.title}</h5>
                                    <p>{value.description}</p>
                                    <div className='d-flex justify-content-evenly'>
                                        { value.complete && ( 
                                        <p><i class="fa-solid fa-circle" style={{color: "#19d225"}}></i></p>
                                        )} 
                                        { value.favourite && (
                                        <p><i class="fa-solid fa-heart" style={{color: "#ff0000"}}></i></p>
                                        )}
                                        { value.trash && (
                                        <p type="button" onClick={() => handleDelete(value.id)}><i class="fa-solid fa-trash" style={{color: "#000000"}}></i></p>
                                         )}
                                    </div>
                                    
                                </div>
            
                                <div class="dropdown">
                                    <div class="" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa-solid fa-ellipsis-vertical fa-lg" style={{color:"#000000"}}></i>
                                    </div>
                                    <ul class="dropdown-menu">
                                        <li><button class="dropdown-item" onClick={() => handleComplete(value.id)} type="button">Completed</button></li>
                                        <li><button class="dropdown-item" onClick={() => handleFavourite(value.id)} type="button">Favourite</button></li>
                                        <li><button class="dropdown-item" onClick={() => handleTrash(value.id)} type="button">Move to Trash</button></li>
                                    </ul>
                                </div> 
                            </div>
                         ))
                    } 
                </div>
                <div className='col-lg-1 col-1'></div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Dashboard
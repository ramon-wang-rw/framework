import React, { useState, useRef, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import ToDoList from './ToDoList.js'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './TopBar.css';
import Form from 'react-bootstrap/Form';
import { v4 as uuidv4 } from 'uuid';
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import {PlusCircleFill, XCircleFill} from 'react-bootstrap-icons';


const LOCAL_STORAGE_KEY = 'todoApp.todos'

function App() {
  const [todos, setTodos] = useState([])
  const todoNameRef = useRef()

  const [show, setShow] = useState(false);
  const [nameInvalid, setNameInvalid] = useState(false);
  const [descInvalid, setDescInvalid] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if (storedTodos) {
      
      setTodos(storedTodos)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const handleShow = () => {
    setShow(true);
    setNameInvalid(false);
    setDescInvalid(false);
    setDuplicate(false);
    setEmpty(false);
  }
  

  const handleClose = () => setShow(false);

  
  const todoDescRef = useRef()
  const todoDeadlineRef = useRef()
  const lowRef = useRef()
  const medRef = useRef()
  const highRef = useRef()

  function toggleComplete(id) {
    const newTodos = [...todos]
    const todo = newTodos.find(todo => todo.id === id)
    todo.complete = !todo.complete
    setTodos(newTodos)
  }

  function deleteTodo(id) {
    const newTodos = [...todos].filter(todo => todo.id !== id)
    setTodos(newTodos)
    toastr.success('Deleted Succesfully');
  }

  function updateTodo(id, name, desc, deadline, priority) {

    const newTodos = [...todos]
    const todo = newTodos.find(todo => todo.id === id)
    todo.name = name
    todo.deadline = deadline
    todo.priority = priority
    setTodos(newTodos)
    toastr.success('Updated Succesfully');
    
  }

  function handleAddTodo(e) {
    const name = todoNameRef.current.value
    const desc = todoDescRef.current.value
    const deadline = todoDeadlineRef.current.value
    let priority = null;

    if(lowRef.current.checked) {
      priority = lowRef.current.value;
    }

    if(medRef.current.checked) {
      priority = medRef.current.value;
    }

    if(highRef.current.checked) {
      priority = highRef.current.value;
    }

    if (todos.filter(todo => todo.name === name).length > 0) {
      setNameInvalid(true);
      setDuplicate(true);
      setEmpty(false);
      if(desc === '') {
        setDescInvalid(true);
      }
      else{
        setDescInvalid(false);
      }
      
      return
    }

    if (name === '') {
      setNameInvalid(true);
      setEmpty(true);
      setDuplicate(false);
      if(desc === '') {
        setDescInvalid(true);
      }
      else{
        setDescInvalid(false);
      }
      
      return
    }

    if(desc === '') {
      setDescInvalid(true);
      if (name === '') {
        setNameInvalid(true);
        setEmpty(true);
        setDuplicate(false);
      }
      if (todos.filter(todo => todo.name === name).length > 0) {
        setNameInvalid(true);
        setEmpty(false);
        setDuplicate(true);
      }
      else {
        setNameInvalid(false);
      }
      
      
      return
    }

    setNameInvalid(false)
    setDescInvalid(false)
    setEmpty(false)
    setDuplicate(false)
    
    setTodos(prevTodos => {
      return [...prevTodos, { id: uuidv4(), name: name, desc: desc, deadline: deadline, priority: priority, complete: false}]
    })
    todoNameRef.current.value = null
    setShow(false);
    toastr.success('Added Succesfully');
  }

  return (
    <>
      <Navbar bg="primary" expand="lg">
        <Container className="justify-content-center">
          <Navbar.Brand className='text-white'>FRAMEWORKS</Navbar.Brand>
        </Container>

        <Button variant="dark" onClick={handleShow}>
        <PlusCircleFill /> ADD
        </Button>

        <Modal size="sm" show={show} onHide={handleClose}>
          <Modal.Header className='modal-header' closeButton>
            <Modal.Title><PlusCircleFill />Add Task</Modal.Title>
          </Modal.Header>

          <Modal.Body>
              <Form>
                  <Form.Group className="mb-3">
                      <Form.Control ref={todoNameRef} type="text" placeholder="Title" isInvalid= {nameInvalid} />
                      {empty && (<Form.Control.Feedback type="invalid"> Empty Field </Form.Control.Feedback>)}
                      {duplicate && (<Form.Control.Feedback type="invalid"> Duplicate Title </Form.Control.Feedback>)}
                  </Form.Group>
                  <br />
                  <Form.Group className="mb-3">
                      <Form.Control ref={todoDescRef} type="text" placeholder="Description" isInvalid= {descInvalid} />
                      <Form.Control.Feedback type="invalid"> Empty Field </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                      <Form.Label className="text-secondary" column='sm'> deadline </Form.Label>
                      <Form.Control ref={todoDeadlineRef} type="date" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                      <Form.Label className="text-secondary" column='sm'> Priority </Form.Label>
                      <br />
                      <Form.Check name="priority" value="low" type="radio" label="low" inline ref={lowRef}/>
                      <Form.Check name="priority" value="medium" type="radio" label="med" inline ref={medRef}/>
                      <Form.Check name="priority" value="high" type="radio" label="high" inline ref={highRef}/>
                  </Form.Group>

                  

              </Form>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleAddTodo}>
            <PlusCircleFill /> ADD
            </Button>
            <Button variant="danger" onClick={handleClose}>
            <XCircleFill /> CANCEL
            </Button>
          </Modal.Footer>
        </Modal>
      </Navbar>
      <Table bordered>
       
        <thead >
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Deadline</th>
            <th>Priority</th>
            <th>Is Complete</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <ToDoList todos={todos} toggleComplete = {toggleComplete} updateTodo = {updateTodo} deleteTodo = {deleteTodo}/>
        </tbody>
      </Table>
    </>

  );
}

export default App;

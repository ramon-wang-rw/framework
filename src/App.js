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

const LOCAL_STORAGE_KEY = 'todoApp.todos'

function App() {
  const [todos, setTodos] = useState([])
  const todoNameRef = useRef()

  const [show, setShow] = useState(false);
  const [nameInvalid, setNameInvalid] = useState(false);
  const [descInvalid, setDescInvalid] = useState(false);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if (storedTodos) {
      
      setTodos(storedTodos)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const handleShow = () => setShow(true);
  

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
  }

  function updateTodo(id, name, desc, deadline, priority) {
    const newTodos = [...todos]
    const todo = newTodos.find(todo => todo.id === id)
    todo.name = name
    todo.deadline = deadline
    todo.priority = priority
    setTodos(newTodos)
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

    if (name === '') {
      setNameInvalid(true);
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
      }
      else {
        setNameInvalid(false);
      }
        
      
      return
    }

    setNameInvalid(false)
    setDescInvalid(false)
    
    setTodos(prevTodos => {
      return [...prevTodos, { id: uuidv4(), name: name, desc: desc, deadline: deadline, priority: priority, complete: false}]
    })
    todoNameRef.current.value = null
    setShow(false);
  }

  return (
    <>
      <Navbar bg="primary" expand="lg">
        <Container className="justify-content-center">
          <Navbar.Brand className='text-white'>FRAMEWORKS</Navbar.Brand>
        </Container>

        <Button variant="light" onClick={handleShow}>
          ADD
        </Button>

        <Modal size="sm" show={show} onHide={handleClose}>
          <Modal.Header className='modal-header' closeButton>
            <Modal.Title>Add Task</Modal.Title>
          </Modal.Header>

          <Modal.Body>
              <Form>
                  <Form.Group className="mb-3">
                      <Form.Control ref={todoNameRef} type="text" placeholder="Title" isInvalid= {nameInvalid} />
                      <Form.Control.Feedback type="invalid"> Empty Field or Duplicate Title </Form.Control.Feedback>
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
              ADD
            </Button>
            <Button variant="danger" onClick={handleClose}>
              CANCEL
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

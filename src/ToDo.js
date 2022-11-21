import React, {useState, useRef, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './TopBar.css';
import Form from 'react-bootstrap/Form';

const LOCAL_STORAGE_KEY = 'todoApp.todos'

export default function Todo({ todo, toggleComplete, updateTodo, deleteTodo }) {
    const [show, setShow] = useState(false);
    const [nameInvalid, setNameInvalid] = useState(false);
    const [descInvalid, setDescInvalid] = useState(false);

    const low = todo.priority === "low"
    const med = todo.priority === "medium"
    const high = todo.priority === "high"

    const todoNameRef = useRef()
    const todoDescRef = useRef()
    const todoDeadlineRef = useRef()
    const lowRef = useRef()
    const medRef = useRef()
    const highRef = useRef()

    const handleShow = () => 
        setShow(true);
    
  

  const handleClose = () => setShow(false);


    


    function handleClick() {
        toggleComplete(todo.id)
        if(todo.complete){
            setVisible(false)
        }
        else{
            setVisible(true)
        }
    }

    function handleDelete() {
        deleteTodo(todo.id)
    }

    function handleUpdate() {
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

        todo.name = name
        todo.desc = desc
        todo.deadline = deadline
        todo.priority = priority
        updateTodo(todo.id, name, desc, deadline, priority)

        setShow(false)
        return



    }

    const [visible, setVisible] = useState(!todo.complete)

    

    return (
        <tr>
            <td>{todo.name}</td>
            <td>{todo.desc}</td>
            <td>{todo.deadline}</td>
            <td>{todo.priority}</td>
            <td> <input type="checkbox" onChange={handleClick} checked={todo.complete}/> </td>
            <td>
                {visible && (
                <>
                <button onClick={handleShow}> update </button> 
                <Modal size="sm" show={show} onHide={handleClose}>
                    <Modal.Header className='modal-header' closeButton>
                        <Modal.Title>Add Task</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control ref={todoNameRef} type="text" placeholder="Title" isInvalid= {nameInvalid} value = {todo.name} disabled/>
                            <Form.Control.Feedback type="invalid"> Empty Field or Duplicate Title </Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <Form.Group className="mb-3">
                            <Form.Control ref={todoDescRef} type="text" placeholder="Description" isInvalid= {descInvalid} defaultValue = {todo.desc} />
                            <Form.Control.Feedback type="invalid"> Empty Field </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-secondary" column='sm'> deadline </Form.Label>
                            <Form.Control ref={todoDeadlineRef} type="date" defaultValue = {todo.deadline}/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-secondary" column='sm'> Priority </Form.Label>
                            <br />
                            <Form.Check name="priority" value="low" type="radio" label="low" inline ref={lowRef} defaultChecked={low}/>
                            <Form.Check name="priority" value="medium" type="radio" label="med" inline ref={medRef} defaultChecked={med}/>
                            <Form.Check name="priority" value="high" type="radio" label="high" inline ref={highRef} defaultChecked={high}/>
                        </Form.Group>

                        

                    </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleUpdate}>
                        ADD
                        </Button>
                        <Button variant="danger" onClick={handleClose}>
                        CANCEL
                        </Button>
                    </Modal.Footer>
                </Modal>        


                <br/></>)}
                    
                <button onClick={handleDelete}> delete </button>
            </td>
        </tr>
    )
    }

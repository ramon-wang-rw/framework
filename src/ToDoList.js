import React from 'react'
import ToDo from './ToDo'

export default function ToDoList({ todos, toggleComplete, updateTodo, deleteTodo }) {
  return (
    todos.map(todo => {
        return <ToDo key={todo.id} todo={todo} toggleComplete={toggleComplete} updateTodo={updateTodo} deleteTodo={deleteTodo}/>
    })
  )
}

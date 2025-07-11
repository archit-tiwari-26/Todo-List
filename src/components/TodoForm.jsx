import { useState } from 'react';
import React from 'react'
import { useTodo } from '../contexts/Todocontext';


function TodoForm() {

     const [message, setmessage] = useState("")
    const {addTodo} = useTodo()

    const add = (e) => {
      e.preventDefault()

      if (!message) return

      addTodo({ message:message, completed: false})
      setmessage("")
    }
return (
        <form onSubmit={add} className="flex">
            <input
                type="text"
                placeholder="Write Todo..."
                className="w-full border border-black/10 rounded-l-lg px-3 outline-none duration-150 bg-white/20 py-1.5"
                value={message}
                onChange={(e)=>setmessage(e.target.value)}
            />
            <button type="submit" className="rounded-r-lg px-3 py-1 bg-green-600 text-white shrink-0">
                Add
            </button>
        </form>
    );
}




export default TodoForm;


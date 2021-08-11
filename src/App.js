import Header from "./components/Header";
import Tasks from "./components/Tasks";
import { useState, useEffect } from "react";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import About from "./components/About";


function App() {
  const [showAddTask, setShowAddtask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async() => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer)
    }
    
    getTasks();
  }, [])

  // Fetch Tasks
  const fetchTasks = async() => {
    const res = await fetch('http://localhost:5000/tasks')

   const data = await res.json();
    console.log(data);
    return data;
  }

  const fetchTask = async(id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)

   const data = await res.json();
    console.log(data);
    return data;
  }


  //Add tsk
  const addTaskOld = (task) => {
    console.log(task);
    const id = Math.floor((Math.random() * 1000) + 1);
    const newTask  = {
      id,
      ...task
    }
    setTasks([...tasks, newTask])
  }

  const addTask = async (task) => {
    console.log("---", task)
    const res = await fetch('http://localhost:5000/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json();
    console.log(data)

    setTasks([...tasks, data])

  }

  // Delete task 
  const deleteTaskOld = (id) => {
    console.log('deleted', id);
    setTasks(tasks.filter((task) => {
      return task.id !== id
    }))
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })

    setTasks(tasks.filter((task) => {
      return task.id !== id;
    }))
  }

  // toggle reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updTask = {...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updTask)
    })

    const data = await res.json();

    setTasks(tasks.map((task) => {
      return task.id === id ? {...task, reminder: data.reminder } : task
    }))
  }


  return (
    <Router>
      <div className="container">
      <Header onAdd={() => setShowAddtask(!showAddTask)} showAdd={showAddTask}/>

      <Route path='/' exact render={(props) => (
        <>
        { showAddTask && <AddTask onAdd={addTask}/>}

        {tasks.length > 0 
          ? (<Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />)
          : ('No task to show' )
        }
        </>
      )} />
      <Route path="/about" component={About}/>
      <Footer/>
    </div>

    </Router>
    
  );
}

export default App;

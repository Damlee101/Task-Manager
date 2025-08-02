
// ///function declaration
// // function greeting() {
// //     console.log('Good morning class')
// // }

// ///function expression

// const greet = function() {
//     console.log('Good afternoon, Allen')
// }


// function greeting(name) {
//     console.log(`Good morning everyone, my name is ${name}`)
// }

// // const calcAge = (name, yearOfBirth) => {
// //     console.log(`Good morning everyone, my name is ${name} and i am ${2025 - yearOfBirth} years old`)
// // }


// // calcAge('Allen', 1998)
// // calcAge('comfort', 2002)
// // calcAge('Akin', 2000)
// // calcAge('Godfrey', 2001)

// // const calcAge = function (birthYear) {
// //     return 2025 - birthYear
// // }


// // const yearsUntilRetirement = function(birthYear, firstName)   {
// //     const age = calcAge(birthYear)
// //     const retirement = 65 - age


// //     if(retirement > 0) {
// //         console.log(`${firstName} retires in ${retirement}`)
// //     } else {
// //         console.log(`${firstName} has already retired`)
// //     }
// // }


// // console.log(yearsUntilRetirement(1998, 'Allen'))

// /////Array
// const friend1 = 'James'
// const friend2 = 'Margret'
// const friend3 = 'comfort'

// console.log(friend1, friend2, friend3)


// // console.log(friends[2])


// ////Basic Array methods
// const friends = ['James', 'Margret', 'Comfort', 'Hammed']
//  friends.push('Daniel') ///Add to the end
// // const newFriends = friends.unshift('Daniel') /// Add to the beginning

//DOM ELEMENTS SELECTION
const taskInput = document.getElementById('task-input')
const addBtn = document.getElementById('add-btn')
const taskList = document.getElementById('task-list')
const emptyState = document.getElementById('empty-state')
const totalTaskElement = document.getElementById('total-tasks')
const completedTask = document.getElementById('completed-tasks')
const pendingTask = document.getElementById('pending-tasks')
const filterButtons = document.querySelectorAll('.filter-btn')

//TASK DATA  STORAGE
let tasks = []
let taskIdCounter = 1
let currentFilter = 'all'

//CLICK EVENT ON BUTTON

taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask()
    }

})

//INPUT VALIDATION
taskInput.addEventListener('input', function () {
    const isEmpty = this.value.trim() === ''
    addBtn.disabled = isEmpty,
        addBtn.addEventListener('click', addTask)
})

//FILTERING BUTTON AND REMOVING/ADDING ACTIVE STATE
filterButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
        filterButtons.forEach((b) => b.classList.remove('active'))
        this.classList.add('active')
        currentFilter = this.dataset.filter
        renderTask()
    })
})

// Adding Task
const addTask = () => {
    const taskText = taskInput.value.trim()

    if (taskText === '') {
        alert('Please enter a task')
        return
    }

    //create task object
    const task = {
        id: taskIdCounter++,
        text: taskText,
        completed: false,
        createdAt: new Date(),
    }

    //Updating the Array with new task
    tasks.push(task)

    //Clear input
    taskInput.value = ''
    addBtn.disabled = true

    // update ui
    renderTask()
    updateTask()
}

// Toggle completion
const toggleTask = (taskId) => {
    const task = tasks.find((task) => task.id === taskId)

    if (task) {
        task.completed = !task.completed
        renderTask()
        updateTask()
    }
}

// Edit task
const editTask = (taskId) => {
    const task = tasks.find((task) => task.id === taskId)

    if (task) {
        const newText = prompt('Edit task:', task.text)
        if (newText !== null) {
            task.text = newText
            renderTask()
            updateTask()
        }
    }
}

// Delete task
const deleteTask = (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter((task) => task.id !== taskId)
        renderTask()
        updateTask()
    }
}

// Create DOM element for task
const createTask = (task) => {
    const li = document.createElement('li')
    li.className = `task-item ${task.completed ? 'completed' : ''}`
    li.setAttribute('data-id', task.id)

    li.innerHTML = `
        <div class="task-content">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <button class="btn edit-btn">Edit</button>
            <button class="btn delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `

    // Edit button 
    const editBtn = li.querySelector('.edit-btn')
    const textSpan = li.querySelector('.task-text')
    const deleteBtn = li.querySelector('.delete-btn')

    editBtn.addEventListener('click', () => {
        // If already editing, do nothing
        if (li.querySelector('.edit-input')) return

        const input = document.createElement('input')
        input.type = 'text'
        input.value = task.text
        input.className = 'edit-input'
        textSpan.style.display = 'none'
        editBtn.textContent = 'Save'
        editBtn.classList.add('save-btn')
        editBtn.classList.remove('edit-btn')
        textSpan.parentNode.insertBefore(input, textSpan)

        // Replace delete button with cancel-edit button
        const cancelBtn = document.createElement('button')
        cancelBtn.className = 'btn cancel-edit-btn'
        cancelBtn.textContent = 'Cancel'
        deleteBtn.parentNode.replaceChild(cancelBtn, deleteBtn)

        input.focus()

        // Save button
        const saveEdit = () => {
            const newText = input.value.trim()
            if (newText) {
                task.text = newText
                renderTask()
                updateTask()
            }
        }

        editBtn.onclick = saveEdit
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveEdit()
        })

        // Cancel edit
        cancelBtn.addEventListener('click', () => {
            renderTask()
        })
    })

    return li
}

// Render all tasks
const renderTask = () => {
    taskList.innerHTML = ''

    let filteredTask = tasks
    if (currentFilter === 'completed') {
        filteredTask = tasks.filter((task) => task.completed)
    } else if (currentFilter === 'pending') {
        filteredTask = tasks.filter((task) => !task.completed)
    }

    if (filteredTask.length === 0) {
        emptyState.style.display = 'block'
        return
    } else {
        emptyState.style.display = 'none'
    }

    filteredTask.forEach((task) => {
        const li = createTask(task)
        taskList.appendChild(li)
    })
}

// Update stats
const updateTask = () => {
    totalTaskElement.innerText = tasks.length
    completedTask.innerText = tasks.filter((task) => task.completed).length
    pendingTask.innerText = tasks.filter((task) => !task.completed).length
}

const init = () => {
    addBtn.disabled = true
    renderTask()
}

init()

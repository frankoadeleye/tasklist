// Define our UI vars
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');


// Load all event listeners function called here even before created, by the hoisting ability of JavaScript...
loadEventListeners();

// Load all event Listeners: Here we are going to add event listeners to variables already created above and then write THEIR FUNCTIONS below.

function loadEventListeners(){
    // DOM load event
    document.addEventListener('DOMContentLoaded', getTasks)
    // AddTask function will be used on the form var created above
    form.addEventListener('submit', addTask);
    // removeTask function will be used on the taskList var created above
    taskList.addEventListener('click', removeTask);
    // clearTask function will be used on the clearBtn var created above
    clearBtn.addEventListener('click', clearTasks);
    // filterTasks function will be used on the filter var created above
    filter.addEventListener('keyup', filterTasks);
}

// """"""""""""""""""""""""""""""""""""""""""""""""""Get Tasks from the local storage""""""""""""""""""""""""""""""
function getTasks(){
    let tasks;
    if(localStorage.getItem('tasks') === null){ //'localStorage.getItem() is a javascript inbuilt method for getting items from the inbuilt local storage.
        tasks = []; //set to an empty array
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.forEach(function(task){
        // Create li element (remember we created a ul in the index.html file which is empty)
        const li = document.createElement('li');
        // Add class
        li.className = 'collection-item'; // [Using "classList", you can add or remove a class without affecting any others the element may have. But if you assign "className", it will wipe out any existing classes while adding the new one (or if you assign an empty string it will wipe out all of them).
        //Assigning "className" can be a convenience for cases where you are certain no other classes will be used on the element, but I would normally use the "classList" methods exclusively.]


        // Create text node and append to the li
        li.appendChild(document.createTextNode(task));//the appended text node is whatever you type in the input
        // Create new a-href link element in the created li
        const link = document.createElement('a');
        // Add class to the created link, which will be used to delete individual tasks from the tasklist

        link.className = 'delete-item secondary-content'; //'secondary-content' is a class in materialize to move things to the right of your page.

        // Add Icon html
        link.innerHTML = '<i class="fa fa-remove"></i>';
        // Append the link to the li
        li.appendChild(link);
        // Append the li to the ul
        taskList.appendChild(li);
    })
}







// """""""""""""""""""""""""""""""""""""""""""""""""""Add Task"""""""""""""""""""""""""""""""""""""""""""""""""""""
function addTask(e){
    if(taskInput.value === ''){
        alert('Add a task');
    }
    // Create li element (remember we created a ul in the index.html file which is empty)
    const li = document.createElement('li');
    // Add class
    li.className = 'collection-item'; // [Using "classList", you can add or remove a class without affecting any others the element may have. But if you assign "className", it will wipe out any existing classes while adding the new one (or if you assign an empty string it will wipe out all of them).
    //Assigning "className" can be a convenience for cases where you are certain no other classes will be used on the element, but I would normally use the "classList" methods exclusively.]


    // Create text node and append to the li
    li.appendChild(document.createTextNode(taskInput.value));//the appended text node is whatever you type in the input
    // Create new a-href link element in the created li
    const link = document.createElement('a');
    // Add class to the created link, which will be used to delete individual tasks from the tasklist
    
    link.className = 'delete-item secondary-content'; //'secondary-content' is a class in materialize to move things to the right of your page.

    // Add Icon html
    link.innerHTML = '<i class="fa fa-remove"></i>';
    // Append the link to the li
    li.appendChild(link);
    // Append the li to the ul
    taskList.appendChild(li);
    // Store in local storage
    storeTaskInLocalStorage(taskInput.value);
    // Clear input
    taskInput.value = '';
    e.preventDefault(); //The Event interface's preventDefault() method tells the user agent that if the event does not get explicitly handled, its default action should not be taken as it normally would be. 

}





// """"""""""""""""""""""""""""""""""""""Store Task (in local storage)""""""""""""""""""""""""""""""""""""""""""""""""""
function storeTaskInLocalStorage(task){
    let tasks;
    if(localStorage.getItem('tasks') === null){ //'localStorage.getItem() is a javascript inbuilt method for getting items from the inbuilt local storage.
        tasks = [];
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks)); //'localStorage.setItem() is also an inbuilt method for window object local storage; the JSON.stringify help save our data as a string.
}







//"""""""""""""""""""""""""""""""""""""""""""" Remove task function """"""""""""""""""""""""""""""""""""""""""""""""
function removeTask(e){
    if(e.target.parentElement.classList.contains('delete-item')){
        if(confirm('Are you sure to delete')){
            e.target.parentElement.parentElement.remove(); //because e.target refers to the i class, and the parent of the i-class is the a-href and the parent of the a-href is the li itself and that's what we want to remove.
            // """"""""""""""""""""""""""""Remove from Local Storage"""""""""""""""""""""""""""""""""""""""""""""""""
            removeTaskFromLocalStorage(e.target.parentElement.parentElement);
        }   
    }
}
//                            """" Remove from Local Storage function""""
function removeTaskFromLocalStorage(taskItem){
    let tasks;
    if(localStorage.getItem('tasks') === null){ //'localStorage.getItem() is a javascript inbuilt method for getting items from the inbuilt local storage.
        tasks = [];
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.forEach(function(task, index){
        if(taskItem.textContent === task){ //meaning if the text content in the local storage match the task we want to delete
            tasks.splice(index, 1);
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}






// """""""""""""""""""""""""""""""""""""""""clear task function"""""""""""""""""""""""""""""""""""""""""""""""""
function clearTasks(){
    // taskList.innerHTML = ''; this is one way to do it, but we commented it so we can see another way

    // faster but more lines of code
    while(taskList.firstChild){ //meaning if the taskList has atleast one child
        taskList.removeChild(taskList.firstChild); //remove if it contains even if it contains one child...as you loop
    }
    clearTasksFromLocalStorage();
}
function clearTasksFromLocalStorage(){
    localStorage.clear();
}







// """""""""""""""""filter tasks function [REUSEABLE CODE  FOR ANY OTHER PROJECT]""""""""""""""""""""""""""""""""
function filterTasks(e){
    const text = e.target.value.toLowerCase();
    document.querySelectorAll('.collection-item').forEach(function(task){//we can use forEach() because query selector returns a nodelist. If we had used getElementByClassName(), we would have to convert it to an array for us to be able to use a forEach method. Meanwhile remember it is the Li element that has a class of 'collection-item'.
        const item = task.firstChild.textContent;
        if(item.toLocaleLowerCase().indexOf(text) != -1){ //meaning that there's a match because '= -1' means no match and so '!= -1' would mean no there's a match.
            task.style.display = 'block'; //Then display the match only.
        }else{
            task.style.display = 'none'; //don't display anything.
        }
    });
}
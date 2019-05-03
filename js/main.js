let taskIndex = 0;
const memory = [{
   name: 'Kategoria',
   copyIndex: 0,
}];

let rgbToHex = (rgb) => {
   let colors = rgb.slice(4).slice(0, -1).split(',');
   let hex = "";
   for (const c of colors) {
      color = parseInt(c).toString(16);
      if (color.length === 1) hex += '0' + color;
      else hex += color;
   }
   return hex;
};

window.addEventListener('DOMContentLoaded', () => {
   const addBtn = document.querySelector('.h-add-btn');
   const searchBtn = document.querySelector('.h-search-btn');
   const addForm = document.querySelector('.c-add');
   const searchForm = document.querySelector('.c-search-task');

   window.addEventListener('keydown', (e) => {
      if (e.key === "Escape") {
         searchForm.classList.add('h-hide');
         addForm.classList.add('h-hide');
      };
   });

   addBtn.addEventListener('click', () => {
      searchForm.classList.add('h-hide');
      if (addForm.classList.contains('h-hide')) addForm.classList.remove('h-hide');
      else addForm.classList.add('h-hide');
   });

   searchBtn.addEventListener('click', () => {
      addForm.classList.add('h-hide');
      if (searchForm.classList.contains('h-hide')) searchForm.classList.remove('h-hide');
      else searchForm.classList.add('h-hide');
   });

   const siteContainer = document.querySelector('.l-site-container');
   const searchTaskInput = searchForm.querySelector('.c-search-task__input');
   const addTaskSelect = addForm.querySelector('.c-add__select');
   const addCatForm = addForm.querySelector('.c-add__cat');
   const addCatFormInput = addCatForm.querySelector('.c-add__input');
   const addCatFormColor = addCatForm.querySelector('.c-add__input-color');
   const addTaskForm = addForm.querySelector('.c-add__task');
   const addTaskFormInput = addTaskForm.querySelector('.c-add__input');
   const addTaskFormColor = addTaskForm.querySelector('.c-add__input-color');

   const searchTask = (e) => {
      const groups = siteContainer.querySelectorAll('.c-group-tasks');
      const tasks = siteContainer.querySelectorAll('.c-tasks__item');
      tasks.forEach(element => {
         const taskText = element.children[1].lastElementChild.innerText;
         if (taskText.indexOf(e.target.value) !== -1) element.style.setProperty('display', '');
         else element.style.setProperty('display', 'none');
      });
      groups.forEach(element => {
         const tasksCount = element.lastElementChild.childElementCount;
         let repeating = 0;
         for (i = 0; i < tasksCount; i++) {
            const task = element.lastElementChild.children[i].style.display;
            if (task === "none") repeating++;
         }
         if (repeating === tasksCount) element.style.setProperty('display', 'none');
         else element.style.setProperty('display', '');
      });
   }
   searchTaskInput.addEventListener('input', searchTask);

   const addCat = (e) => {
      e.preventDefault();
      const group = document.createElement('section');
      group.classList.add('c-group-tasks');
      group.innerHTML =
         `<div class="c-category" style="background:${addCatFormColor.value};">
            <p class="c-category__text" data-value="${addCatFormInput.value}0">${addCatFormInput.value}</p>
            <span class="c-category__manage t-task-menage fas fa-pen"></span>
            <span class="c-category__manage t-task-menage fas fa-copy"></span>
            <span class="c-category__manage t-task-menage fas fa-trash-alt"></span>
         </div>
         <ul class="c-tasks">
         </ul>
      </section>`;
      siteContainer.insertBefore(group, siteContainer.firstChild);

      memory.push({
         name: addCatFormInput.value,
         copyIndex: 0,
      });

      const option = document.createElement('option');
      option.value = addCatFormInput.value + 0;
      option.innerText = addCatFormInput.value;
      addTaskSelect.value = addCatFormInput.value;
      addTaskSelect.insertBefore(option, addTaskSelect.firstChild);

      addCatFormInput.value = "";
      addCatFormColor.value = "#2D2D2D";
   }
   addCatForm.addEventListener('submit', addCat);

   const addTask = (e) => {
      e.preventDefault();
      const tasks = siteContainer.querySelectorAll('.c-tasks');

      const task = document.createElement('li');
      task.classList.add('c-tasks__item');
      task.style.background = addTaskFormColor.value;
      task.innerHTML =
         `<input class="c-tasks__checkbox-input" id="task${taskIndex}" type="checkbox" style="display: none;" />
               <label class="c-tasks__checkbox-label" for="task${taskIndex}">
                  <span>
                     <svg width="12px" height="10px" viewbox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                     </svg>
                  </span>
                  <span class="c-tasks__text">${addTaskFormInput.value}</span>
               </label>
               <span class="c-tasks__manage fas fa-pen"></s></span>
               <span class="c-tasks__manage fas fa-copy"></s></span>
               <span class="c-tasks__manage fas fa-trash-alt"></span>`;

      tasks[addTaskSelect.selectedIndex].insertBefore(task, tasks[addTaskSelect.selectedIndex].firstChild);
      addTaskFormInput.value = "";
      addTaskFormColor.value = "#535353";
      taskIndex++;
   }
   addTaskForm.addEventListener('submit', addTask);

   // Cats and Tasks actions
   siteContainer.addEventListener('click', (e) => {
      // Remove Task
      if (e.target.closest('.c-tasks__manage.fa-trash-alt') !== null) {
         e.target.closest('.c-tasks__item').remove();
      }
      // Remove Category
      else if (e.target.closest('.c-category__manage.fa-trash-alt') !== null) {
         if (confirm('Usunąć kategorię, wraz z jej zadaniami?')) {
            e.target.closest('.c-group-tasks').remove();
            for (const option of addTaskSelect.children) {
               if (e.target.closest('.c-category').children[0].dataset.value === option.value) {
                  option.remove();
               }
            }
         } else return;
      }
      // Copy Task
      else if (e.target.closest('.c-tasks__manage.fa-copy') !== null) {
         // New task copy
         const copyElement = document.createElement('li');
         copyElement.innerHTML = e.target.closest('.c-tasks__item').innerHTML;
         copyElement.classList.add('c-tasks__item');
         copyElement.style.background = e.target.closest('.c-tasks__item').style.background;
         // Task added to DOM. A value has been added to the index of the copied element.
         const tasks = e.target.closest('.c-tasks');
         tasks.insertBefore(copyElement, tasks.firstChild);
         tasks.firstChild.children[0].id = 'task' + taskIndex;
         tasks.firstChild.children[1].setAttribute('for', 'task' + taskIndex);

         taskIndex++;
      }
      // Copy Category
      else if (e.target.closest('.c-category__manage.fa-copy') !== null) {
         // New tasks group
         const copyGroup = document.createElement('section');
         copyGroup.innerHTML = e.target.closest('.c-group-tasks').innerHTML;
         copyGroup.classList.add('c-group-tasks');
         siteContainer.insertBefore(copyGroup, siteContainer.firstChild);
         // New index for copied tasks
         for (const li of siteContainer.firstElementChild.lastElementChild.children) {
            li.children[0].id = 'task' + taskIndex;
            li.children[1].setAttribute('for', 'task' + taskIndex);
            taskIndex++;
         }
         // A value has been added to the index of the copied elements. Selection options updated.
         const categoryName = e.target.closest('.c-category').children[0].innerText;
         for (const element of memory) {
            if (element.name === categoryName) {
               element.copyIndex++;
               const option = document.createElement('option');
               const text = categoryName + ' (' + element.copyIndex + ')';
               addTaskSelect.value = option.innerText = text;

               siteContainer.firstElementChild.firstElementChild.firstElementChild.dataset.value =
                  option.value = categoryName + element.copyIndex;

               addTaskSelect.insertBefore(option, addTaskSelect.firstChild);
            }
         }
      }
      // Edit task
      else if (e.target.closest('.c-tasks__manage.fa-pen') !== null) {
         const task = e.target.closest('.c-tasks__item');
         const taskChildren = task.children[1];
         const htmlEditForm = `
            <form class="c-add__task t-task-edit">
               <label class="c-add__label" for="task-input" style="display:none;">Zadanie:</label>
               <input class="c-add__input t-edit" type="text" id="task-input"
                  value = "${taskChildren.lastElementChild.innerText}"
                  required aria - required = "true" >
               <input class="c-add__input-color t-edit" value="#${rgbToHex(task.style.background)}" type="color" id="task-color" aria-required="false">
               <button class="c-add__btn" type="submit" name="submit">Zmień</button>
            </form>`;
         //Change the content of the task to the edit form
         for (let i = 1; i <= 4; i++) {
            if (i == 1) task.children[i].firstElementChild.style.display = "none";
            else task.children[i].style.display = "none";
         }
         taskChildren.lastElementChild.innerHTML = htmlEditForm;

         //If the form will be sent
         const editForm = siteContainer.querySelector('.c-add__task');
         editForm.addEventListener('submit', (el) => {
            el.preventDefault();
            const inputValue = editForm.querySelector('.c-add__input').value;
            const inputColorValue = editForm.querySelector('.c-add__input-color').value;

            task.style.background = inputColorValue;
            taskChildren.lastElementChild.innerHTML = inputValue;
            for (let i = 1; i <= 4; i++) {
               if (i == 1) task.children[i].firstElementChild.style.display = "";
               else task.children[i].style.display = "";
            }
         });
      }
      // Edit Category 
      else if (e.target.closest('.c-category__manage.fa-pen') !== null) {
         console.log('edit category');
      }
      // e.target.closest('.c-tasks').appendChild(e.target.closest('.c-tasks__item')); // Przenoszenie do góry
   });

});
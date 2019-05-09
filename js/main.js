let rgbToHex = (rgb) => {
   let colors = rgb.slice(4).slice(0, -1).split(',');
   let hex = "";
   for (const c of colors) {
      color = parseInt(c).toString(16);
      if (color.length === 1) hex += '0' + color;
      else hex += color;
   }
   return hex;
}

let taskIndex = 0;
const categoryMemory = [{
   categoryName: 'Kategoria',
   categoryCopies: 0,
}];


class Copy {
   constructor() {
      this.newElementTag = null;
      this.newElementClass = null;
      this.newElementTarget = null;
      this.isTask = null;
   }
   newElement() {
      const copy = document.createElement(this.newElementTag);
      copy.innerHTML = this.newElementTarget.innerHTML;
      copy.classList.add(this.newElementClass);
      copy.style.background = this.newElementTarget.style.background;
      if (this.isTask) {
         const tasks = this.newElementTarget.parentElement;
         tasks.insertBefore(copy, tasks.firstChild);
         tasks.firstChild.children[0].id = 'task' + taskIndex + '-input';
         tasks.firstChild.children[1].setAttribute('for', 'task' + taskIndex + '-input');
         taskIndex++;
      } else {
         const container = document.querySelector('.l-site-container');
         container.insertBefore(copy, container.firstElementChild);
         for (const li of container.firstElementChild.children[1].children) {
            li.children[0].id = 'task' + taskIndex + '-input';
            li.children[1].setAttribute('for', 'task' + taskIndex + '-input');
            taskIndex++;
         }
         const categoryTitle = container.querySelector('.c-category__text').dataset.cattitle;
         for (const m of categoryMemory) {
            if (m.categoryName === categoryTitle) {
               m.categoryCopies++;
               container.firstElementChild.firstElementChild.firstElementChild.innerText = categoryTitle + ' (' + m.categoryCopies + ')';
               container.firstElementChild.firstElementChild.firstElementChild.dataset.cattitle = categoryTitle;
               container.firstElementChild.firstElementChild.firstElementChild.dataset.catcopy = m.categoryCopies;
            }
         }
      }
   }
   newOption() {
      const catTitle = this.newElementTarget.parentElement.firstElementChild.firstElementChild.firstElementChild.dataset.cattitle;
      for (const m of categoryMemory) {
         if (m.categoryName === catTitle) {
            const option = document.createElement('option');
            const text = catTitle + ' (' + m.categoryCopies + ')';
            const addTaskSelect = document.querySelector('.c-add__select');
            addTaskSelect.value = option.innerText = text;
            option.value = catTitle + m.categoryCopies;
            addTaskSelect.insertBefore(option, addTaskSelect.firstChild);
         }
      }
   }

}

class Edit {
   constructor() {
      this.element = undefined;
      this.prevElement = null;
      this.prevText = null;
      this.prevTitle = null;
      this.prevColor = null;
      this.isTask = null;
   }

   htmlEditForm(text, color) {
      return `<form class="c-add__task t-task-edit">
               <label class="c-add__label" for="task-input" style="display:none;">Zadanie:</label>
               <input class="c-add__input t-edit" type="text" id="task-input"
                  value = "${text.innerText}"
                  required aria - required = "true" 
                  autocomplete="off">
               <input class="c-add__input-color t-edit" value="#${rgbToHex(color.style.background)}" type="color" id="task-color" aria-required="false">
               <button class="c-add__btn" type="submit" name="submit">Zmień</button>
            </form>`;
   }

   enterData(target, inputText, inputColor) {
      target.style.background = inputColor;
      if (this.isTask) target.children[1].lastElementChild.innerHTML = inputText;
      else target.firstElementChild.innerHTML = inputText;
      for (let i = 1; i < this.element.children.length; i++) {
         if (i == 1 && this.isTask) target.children[i].firstElementChild.style.display = "";
         else target.children[i].style.display = "";
      }
   }
   textToForm() {
      for (let i = 1; i < this.element.children.length; i++) {
         if (i == 1 && this.isTask) this.element.children[i].firstElementChild.style.display = "none";
         else this.element.children[i].style.display = "none";
      }
      if (this.isTask) this.element.children[1].lastElementChild.innerHTML = this.htmlEditForm(this.element.children[1], this.element);
      else this.element.firstElementChild.innerHTML = this.htmlEditForm(this.element.firstElementChild, this.element);
   }

   onlyOneForm() {
      if (this.prevElement !== null && this.prevElement !== this.element) {
         this.enterData(this.prevElement, this.prevText, this.prevColor);
      }
   }
   submitForm(myClass) {
      const edit = document.querySelector(`.${myClass} .c-add__task`);
      edit.addEventListener('submit', (el) => {
         el.preventDefault();
         const inputValue = edit.querySelector('.c-add__input').value;
         const inputColorValue = edit.querySelector('.c-add__input-color').value;
         this.enterData(this.element, inputValue, inputColorValue);
         this.prevElement = this.prevText = this.prevColor = null;
         if (!this.isTask) {
            this.element.firstElementChild.dataset.cattitle = inputValue;
            let hasItemMemory = false;
            let itemCopies = 0;
            categoryMemory.forEach((m, i) => {
               if (m.categoryName === inputValue) {
                  hasItemMemory = true;
                  itemCopies = m.categoryCopies;
               }
            });
            if (!hasItemMemory) {
               categoryMemory.push({
                  categoryName: inputValue,
                  categoryCopies: 0,
               });
               itemCopies = 0;
            }
            this.editOption(inputValue, itemCopies);
         }
      });
      const inputValue = edit.querySelector('.c-add__input').value;
      const inputColorValue = edit.querySelector('.c-add__input-color').value;
      this.prevElement = this.element;
      this.prevText = this.prevTitle = inputValue;
      this.prevColor = inputColorValue;
   }
   editOption(inputValue, itemCopies) {
      const options = document.querySelectorAll('.c-add__select option');
      options.forEach(option => {
         if (option.innerText === this.prevTitle) {
            option.innerText = inputValue;
            option.value = inputValue + itemCopies;
            // .replace(' (' + /[0-9]/g + ')', '')
         }
      });
   }
}

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
         if (taskText.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1) element.style.setProperty('display', '');
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
      let copyName = "";
      let copyNumber = 0;
      for (const m of categoryMemory) {
         if (m.categoryName === addCatFormInput.value) {
            m.categoryCopies++;
            copyNumber = m.categoryCopies;
            copyName = addCatFormInput.value + ' (' + copyNumber + ')';
         }
      }
      group.innerHTML =
         `<div class="c-category" style="background:${addCatFormColor.value};">
            <p class="c-category__text" data-cattitle="${addCatFormInput.value}" data-catcopy="${copyNumber}">${copyName}</p>
            <span class="c-category__manage t-task-menage fas fa-pen"></span>
            <span class="c-category__manage t-task-menage fas fa-copy"></span>
            <span class="c-category__manage t-task-menage fas fa-trash-alt"></span>
         </div>
         <ul class="c-tasks">
         </ul>
      </section>`;
      siteContainer.insertBefore(group, siteContainer.firstChild);

      const option = document.createElement('option');
      option.value = addCatFormInput.value + copyNumber;
      if (copyNumber !== 0) option.innerText = addCatFormInput.value + ' (' + copyNumber + ')';
      else {
         categoryMemory.push({
            categoryName: addCatFormInput.value,
            categoryCopies: 0,
         });
         option.innerText = addCatFormInput.value;
      }
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
      task.id = `task${taskIndex}`;
      task.style.background = addTaskFormColor.value;
      task.innerHTML =
         `<input class="c-tasks__checkbox-input" id="task${taskIndex}-input" type="checkbox" style="display: none;" />
         <label class="c-tasks__checkbox-label" for="task${taskIndex}-input">
            <span>
               <svg width="12px" height="10px" viewbox="0 0 12 10">
                  <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
               </svg>
            </span>
            <span class="c-tasks__text">${addTaskFormInput.value}</span>
         </label>
         <span class="c-tasks__manage fas fa-pen"></span>
         <span class="c-tasks__manage fas fa-copy"></span>
         <span class="c-tasks__manage fas fa-trash-alt"></span>`;

      tasks[addTaskSelect.selectedIndex].insertBefore(task, tasks[addTaskSelect.selectedIndex].firstChild);
      addTaskFormInput.value = "";
      addTaskFormColor.value = "#535353";
      taskIndex++;
   }
   addTaskForm.addEventListener('submit', addTask);

   // Categories and Tasks actions
   const copyT = new Copy();
   const copyC = new Copy();
   const editT = new Edit();
   const editC = new Edit();
   siteContainer.addEventListener('click', (e) => {
      // Remove Task
      if (e.target.closest('.c-tasks__manage.fa-trash-alt') !== null) {
         e.target.closest('.c-tasks__item').remove();
      }
      // Remove Category
      else if (e.target.closest('.c-category__manage.fa-trash-alt') !== null) {
         if (confirm('Usunąć kategorię, wraz z jej zadaniami?')) {
            e.target.closest('.c-group-tasks').remove();
            const category = e.target.closest('.c-category').children[0];
            for (const option of addTaskSelect.children) {
               if (category.dataset.cattitle + category.dataset.catcopy === option.value) {
                  option.remove();
               }
            }
         } else return;
      }
      // Copy Task
      else if (e.target.closest('.c-tasks__manage.fa-copy') !== null) {
         copyT.newElementTag = 'li';
         copyT.newElementClass = 'c-tasks__item';
         copyT.newElementTarget = e.target.closest('.c-tasks__item');
         copyT.isTask = true;
         copyT.newElement();
      }
      // Copy Category
      else if (e.target.closest('.c-category__manage.fa-copy') !== null) {
         copyC.newElementTag = 'section';
         copyC.newElementClass = 'c-group-tasks';
         copyC.newElementTarget = e.target.closest('.c-group-tasks');
         copyC.isTask = false;
         copyC.newElement();
         copyC.newOption();
      }
      // Edit task
      else if (e.target.closest('.c-tasks__manage.fa-pen') !== null) {
         const task = e.target.closest('.c-tasks__item');
         editT.element = task;
         editT.isTask = true;
         editT.textToForm();
         editT.onlyOneForm();
         editT.submitForm('c-tasks');
      }
      // Edit Category 
      else if (e.target.closest('.c-category__manage.fa-pen') !== null) {
         const cat = e.target.closest('.c-category');
         const name = cat.innerText;
         editC.element = cat;
         editC.textToForm();
         editC.onlyOneForm();
         editC.submitForm('c-category');
      }
      // e.target.closest('.c-tasks').appendChild(e.target.closest('.c-tasks__item')); // Przenoszenie do góry
   });

});
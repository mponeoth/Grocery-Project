// ******* SELECT ITEMS   ******* //

const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.querySelector("#grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

//* edit option
let editElement;
let editFlag = false;
let editID = "";


//*** EVENT LISTENERS  */
//*  Submit form
form.addEventListener("submit", addItem);

// clear items
clearBtn.addEventListener("click",clearItems);

//load items
window.addEventListener("DOMContentLoaded", () => {
  setUpItemsInlocalStorage()
});

// ** FUNCTIONS ***** /
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {                               // editFlag === false  !editFlag ayni anlamdadir 
      createListItems(id,value)
      // display alert 
      displayAlert('tebrikler ekleme yaptiniz ' , 'success')  
      //show container 
      container.classList.add("show-container");
      //add to local storage
      adToLocalStorage(id,value);
      //set back to default
      setBackToDefault(); 

  } else if (value && editFlag) {  //edit butonuna bastigimizda calisicak editflag === true olani
      editElement.innerHTML = value;
      displayAlert('edit yyaptiniz','success');
      //edit local storage
      editLocalStorage(editID, value);
      setBackToDefault()
  } else {
    displayAlert('bos alan girdiniz','danger')
     
  }
}

    //display alert 
    function displayAlert(text,action) {
        alert.textContent = text;
        alert.classList.add(`alert-${action}`)

    //remove alert
        setTimeout(function() {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`)
      }, 1000 );
    }
    //*  clear Items 
    function clearItems(){
      const items = document.querySelectorAll('.grocery-item')
      if(items.length >0 ){
        items.forEach(function(item){
            list.removeChild(item)
        })
      }
      container.classList.remove('show-container')
      displayAlert('tum itemslari sildiniz ','danger')
      setBackToDefault()
      localStorage.removeItem('list')
    }

    //delete function
    function deleteItem(e){         
      const element = e.currentTarget.parentElement.parentElement;
      console.log(element); // element bizim article mizdir 
      const id = element.dataset.id;    //dataset.id diyerek articleimizdaki id mizi aldik 
      list.removeChild(element)
      if(list.children.length === 0){
        container.classList.remove('show-container')
      }
      removeLocalStorage(id)
      displayAlert('itemimiz silinmistir' , 'danger')
      setBackToDefault()
      //remove from local storage
      //remove from localStorage(id)
    }

    //edit function
    function editItem(e){
      const element = e.currentTarget.parentElement.parentElement;
      console.log(element);
      //set edit item
      editElement = e.currentTarget.parentElement.previousElementSibling 
      console.log(editElement);
      //set form value
      grocery.value = editElement.innerHTML; 
      editFlag = true;
      editID = element.dataset.id;
      submitBtn.textContent = 'change'
    }


    //* set back to default
    function setBackToDefault() {
      grocery.value = "";
      editFlag = false;
      editID = "";
      submitBtn.textContent = "submit";

    }

       // *** LOCAL STORAGE   **///
    function adToLocalStorage(id, value){
      const grocery = {id,value};  //  id:id , value:value  eger bu sekilde eslesiyorsa yazmamiza gerek kalmaz
      let items = getLocalStorage()
      console.log(items);
      items.push(grocery);
      localStorage.setItem('list', JSON.stringify(items));  
      // console.log("added to local storage");
    }

    function removeLocalStorage(id){
      let items = getLocalStorage() 
      items = items.filter(function(item){
          if(item.id !== id){
            return item
          }
      })
      localStorage.setItem('list', JSON.stringify(items));  
    }

    function editLocalStorage(id, value){
      let items = getLocalStorage()
      items = items.map(function(item){
          if(item.id === id){
            item.value = value      
          }
          return item
      })
      localStorage.setItem('list', JSON.stringify(items));  

    }

    function getLocalStorage(){
    return  localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : []; 
    } 

    
    // LocalStorage API
    // setItem 
    // getItem 
    // removeItem 
    // save as Strings 
    
      /* localStorage.setItem("orange",JSON.stringify(["item","item2"]))
        const oranges = JSON.parse(localStorage.getItem("orange"));
        console.log(oranges);
       localStorage.removeItem("orange");
       */
    // *** SETUP ITEMS  ******

    function setUpItemsInlocalStorage(){
        let items = getLocalStorage()
        if(items.length > 0){
          items.forEach(function(item){
            createListItems(item.id , item.value)
          })
      }
      container.classList.add('show-container')
    }


    function createListItems(id,value){
      const element = document.createElement('article')
      //add class
      element.classList.add('grocery-item');
      //add id
      const attr = document.createAttribute('data-id');
      attr.value = id;
      element.setAttributeNode(attr)
      element.innerHTML = `<p class="title">${value}</p>
      <div class="btn-container">
        <button type="button" class="edit-btn">
          <i class="fa fa-edit" style="font-size: 24px"></i>
        </button>
        <button type="button" class="delete-btn">
          <i class="fa fa-trash" style="font-size: 24px"></i>
        </button>`;    
        const editBtn = element.querySelector('.edit-btn');
        const deleteBtn = element.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', deleteItem)
        editBtn.addEventListener('click', editItem)
        //append child
        list.appendChild(element)
    }
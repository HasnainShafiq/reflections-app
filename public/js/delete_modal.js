const deleteBtn = document.getElementById('delete__button');
const deleteModal = document.querySelector('.delete__modal');
const closeDelete = document.getElementById('close__delete');
const showContainer = document.querySelector('.show__reflection__container');


deleteBtn.addEventListener('click', ()=> {
    deleteModal.classList.toggle('hidden');
    showContainer.classList.toggle('blur');
});

closeDelete.addEventListener('click', ()=> {
    deleteModal.classList.toggle('hidden');
    showContainer.classList.toggle('blur');
});


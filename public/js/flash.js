const flash = document.querySelector('.flash');
const closeFlash = document.querySelector('.close__flash');

closeFlash.addEventListener('click', () => {
    flash.classList.toggle('hidden');
})

window.setTimeout(() => {
    flash.style.display = 'none';
}, 4000)
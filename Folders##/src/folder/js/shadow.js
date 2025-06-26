document.addEventListener('DOMContentLoaded', ()=>{
    const color = localStorage.getItem('shadow-color')
    const opacity = +localStorage.getItem('shadow-opacity')
    document.querySelector('.shadow').style.backgroundColor = color
    document.querySelector('.shadow').style.opacity = opacity
    
})
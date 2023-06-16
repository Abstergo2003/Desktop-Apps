var backgrounds = [
    {
        name: "Wavy",
        color: '#e5e5f7',
        opacity: '0.8',
        image: 'repeating-radial-gradient( circle at 0 0, transparent 0, #e5e5f7 10px ), repeating-linear-gradient( #444cf755, #444cf7 )',
        position: '0 0',
        size: 'cover',
        repeat: 'no-repeat',
        blend: "auto"
    },
    {
        name: "Circles",
        color: '#e5e5f7',
        opacity: '0.8',
        image: 'radial-gradient(circle at center center, #444cf7, #e5e5f7), repeating-radial-gradient(circle at center center, #444cf7, #444cf7, 10px, transparent 20px, transparent 10px)',
        size: 'auto',
        repeat: 'auto',
        blend: "multiply"
    },
    {
        name: "Paper",
        color: '#e5e5f7',
        opacity: '0.8',
        image: 'linear-gradient(#444cf7 2px, transparent 2px), linear-gradient(90deg, #444cf7 2px, transparent 2px), linear-gradient(#444cf7 1px, transparent 1px), linear-gradient(90deg, #444cf7 1px, #e5e5f7 1px)',
        size: '50px 50px, 50px 50px, 10px 10px, 10px 10px',
        repeat: '-2px -2px, -2px -2px, -1px -1px, -1px -1px',
        blend: "auto"
    },
    {
        name: "Diagonal",
        color: '#e5e5f7',
        opacity: '0.8',
        image: 'repeating-linear-gradient(45deg, #444cf7 0, #444cf7 1px, #e5e5f7 0, #e5e5f7 50%)',
        size: '10px 10px',
        repeat: 'auto',
        blend: "auto"
    },
    {
        name: "Boxes",
        color: '#e5e5f7',
        opacity: '0.8',
        image: ' linear-gradient(#444cf7 1px, transparent 1px), linear-gradient(to right, #444cf7 1px, #e5e5f7 1px)',
        size: '20px 20px',
        repeat: 'auto',
        blend: "auto"
    },
    {
        name: "Lines",
        color: '#e5e5f7',
        opacity: '0.8',
        image: 'repeating-linear-gradient(0deg, #444cf7, #444cf7 1px, #e5e5f7 1px, #e5e5f7)',
        size: '20px 20px',
        repeat: 'auto',
        blend: "auto"
    },
    {
        name: "LinesV2",
        color: '#e5e5f7',
        opacity: '0.8',
        image: 'repeating-linear-gradient(to right, #444cf7, #444cf7 1px, #e5e5f7 1px, #e5e5f7)',
        size: '20px 20px',
        repeat: 'auto',
        blend: "auto"
    },
]

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function setBackground() {
    var id = getRandomInt(backgrounds.length)
    var style = document.body.style
    style.backgroundColor =  backgrounds[id].color
    style.opacity = backgrounds[id].opacity
    style.backgroundImage = backgrounds[id].image
    style.backgroundPosition = backgrounds[id].position
    style.backgroundSize = backgrounds[id].size
    style.backgroundRepeat = backgrounds[id].repeat
    style.backgroundBlendMode = backgrounds[id].blend
}

setBackground()
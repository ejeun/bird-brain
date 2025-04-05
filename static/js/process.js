import { DataVisualizer } from './utils/dataviz.js';

document.addEventListener("DOMContentLoaded", () => { 
    const text = "First we will analyze the life processes that match your signature together.";
    window.captions.show(text);
    
    const canvas = document.getElementById('visualization');
    if (canvas) {
        // Set canvas style to center it
        canvas.style.position = 'absolute';
        canvas.style.top = '50%';
        canvas.style.left = '50%';
        canvas.style.transform = 'translate(-50%, -50%)';
        
        const dataviz = new DataVisualizer(canvas, {
            width: 800,
            height: 800,
            backgroundColor: 'transparent'
        });
        dataviz.setupNodes();
        dataviz.animate();
    } else {
        console.error("Canvas element with id 'visualization' not found");
    }
    
    // Fade out the canvas
    setTimeout(() => {
        canvas.style.opacity = '0';
        canvas.style.transition = 'opacity 1s ease';
        setTimeout(() => {
            canvas.style.display = 'none';
        }, 1000);
    }, 4000);   
}); 

//<div class="collage-container" id="collage"></div>

//<form class="name-form" id="nameForm">
//    <h2>Enter your name</h2>
//    <input type="text" id="nameInput" placeholder="Your legal name" required>
//    <button type="submit">Continue</button>
//</form>

const lines = [
        "Touch the images that spark the most curiosity in you.",
        "Please enter your legal name. You may re-use your existing name.",
        "Standard process is letting the mycelium work with your remains.",
        "The interactions model the sparks between the neurons.",
        "You've opted into the alpha release and we will be using the flight trajectories of these birds.",
        "Decide which one your intuition says is yours.",
        "Please call back to them.",
        "Breathe in, breathe out (malayalam buddhism meditation exercise)",
        "Eat the honey from the bees to moderate your state.",
        "This current state has been saved.",
        "We have targeted this flock and blown them 0.3 degrees southeast",
        "Other adjustments to the ecosystem include an increase of soil acidity by 0.03% and diversifying the bacteria in their resting grounds.",
        "Their state is now equivalent to yours.",
        "[name] will live on at [latlong (link to the google maps view)].",
        "The sun is rising. Exit the machine",
        "Subscribe to see how [] solves new problems.",
    ]

    const images = [
        { src: '/static/images/collage/1.jpg', width: '200px', top: '10%', left: '15%' },
        { src: '/static/images/collage/2.jpg', width: '150px', top: '30%', left: '40%' },
        { src: '/static/images/collage/3.jpg', width: '180px', top: '60%', left: '20%' },
        { src: '/static/images/collage/4.jpg', width: '220px', top: '25%', left: '70%' },
        { src: '/static/images/collage/5.jpg', width: '160px', top: '50%', left: '60%' },
        { src: '/static/images/collage/6.jpg', width: '190px', top: '75%', left: '45%' },
        // Add more images with different positions
    ];

    const collage = document.getElementById('collage');
    const nameForm = document.getElementById('nameForm');
    let selectedCount = 0;
    
    // Create and position images
    images.forEach((img, index) => {
        const div = document.createElement('div');
        div.className = 'collage-item';
        div.style.width = img.width;
        div.style.top = img.top;
        div.style.left = img.left;
        
        const image = document.createElement('img');
        image.src = img.src;
        image.style.width = '100%';
        image.style.height = 'auto';
        
        div.appendChild(image);
        collage.appendChild(div);

        div.addEventListener('click', () => {
            if (!div.classList.contains('selected') && selectedCount < 3) {
                div.classList.add('selected');
                selectedCount++;
                
                if (selectedCount === 3) {
                    window.captions.show(lines[1]);
                    nameForm.classList.add('visible');
                }
            }
        });
    });

    // Handle name submission
    nameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('nameInput').value;
        nameForm.classList.remove('visible');
        
        // Continue with the rest of the captions
        for (let i = 2; i < lines.length; i++) {
            let text = lines[i].replace('[name]', name);
            window.captions.show(text);
        }
    });
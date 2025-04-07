/**
 * Application Constants
 * 
 * This file contains all the constant values used throughout the application.
 */

// Caption lines for different stages of the application
export const LINES = [
    "Touch the images that spark the most curiosity in you.",
    "Next, please enter your legal name. You may re-use your existing name.",
    "Thanks [name].",
    "Standard process is letting the mycelium work with your remains.",
    "The interactions model the sparks between the neurons.",
    "You've opted into the alpha release and we will be using the flight trajectories of these birds.",
    "[name], decide which one your intuition says is yours.",
    "Please call back to them.",
    "Breathe in, breathe out (malayalam buddhism meditation exercise)",
    "Eat the honey from the bees to moderate your state.",
    "This current state has been saved.",
    "We have targeted this flock and blown them 0.3 degrees southeast",
    "Other adjustments to the ecosystem include an increase of soil acidity by 0.03% and diversifying the bacteria in their resting grounds.",
    "Their state is now equivalent to yours.",
    "[name] will live on at [latlong (link to the google maps view)].",
    "The sun is rising. Exit the machine",
];

// Poetry lines for the collage
export const POETRY = [
    `"my arms, when visible now, are foreceps of incisive metal"`,
    `"as alive as coral beneath the surface of oceanwater"`,
    `"[it] quivers, its meaning quivers as if a mirage"`,
    `"the spores that dance like my hair does"`,
    `"the moonrise coincides with my claim to this spacetime"`,
    `"the light of your eyes waver when i ask"`,
    `"i feel the waves and tendrils of love"`,
    `"waves eagerly lapping"`,
    `"knowledge hadn't permeated through the rest of the body yet"`,
];

// Image data for the collage
export const COLLAGE_IMAGES = [
    { src: '/static/images/collage/1.jpg', width: '400px', top: '5%', left: '5%' },
    { src: '/static/images/collage/2.jpg', width: '400px', top: '70%', left: '70%' },
    { src: '/static/images/collage/3.jpg', width: '400px', top: '50%', left: '10%' },
    { src: '/static/images/collage/4.jpg', width: '400px', top: '20%', left: '60%' },
    { src: '/static/images/collage/6.jpg', width: '400px', top: '45%', left: '45%' },
];

// Animation timing constants
export const ANIMATION_TIMING = {
    CANVAS_FADE_OUT_DELAY: 4000,
    CANVAS_FADE_OUT_DURATION: 1000,
    COLLAGE_FADE_IN_DELAY: 1000,
    COLLAGE_FADE_OUT_DELAY: 3000,
    FORM_DELAY: 3000,
};

// Canvas configuration
export const CANVAS_CONFIG = {
    width: 800,
    height: 800,
    backgroundColor: 'transparent'
}; 
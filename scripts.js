
const viewWidth = screen.width;
const image = document.getElementById("home-image").children[0];



window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;

    image.style.transform = `translateY(${scrollPosition / 2}px)`;

});


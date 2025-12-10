
const images = [
    'uiObject/slider/img/1.jpg',
    'uiObject/slider/img/2.jpg',
    'uiObject/slider/img/3.jpg', 
    'uiObject/slider/img/4.jpg'
];

let currentIndex = 0; // Более понятное имя переменной
const slide = document.getElementById("slide");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

// Устанавливаем начальное изображение
slide.src = images[currentIndex];

nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    slide.src = images[currentIndex];
});

prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    slide.src = images[currentIndex];
});
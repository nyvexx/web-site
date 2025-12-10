const btn = document.getElementById("btn2");

btn.addEventListener("click", function(){
    btn.style.transform = "scale(0,9)";
    setTimeout(function(){
        btn.style.transform = "scale(1)";
    }, 250)
});
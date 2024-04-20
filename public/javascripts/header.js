
// This will ensure that the handleSearch function is not called until the entire page (including the searchinput element) is fully loaded.
window.onload = function () {
    handleSearch();
}

var body = document.querySelector('body');

drop = () => {
    var dropdown = document.getElementById("dropdown");
    if (dropdown.style.display === "none") {
        dropdown.style.display = "flex";
    } else {
        dropdown.style.display = "none";
    }
};

dropprofile = () => {
    var dropdown = document.getElementById("drop-profile");
    if (dropdown.style.display === "none") {
        dropdown.style.display = "flex";
    } else {
        dropdown.style.display = "none";
    }
}

drophide = () => {
    var dropdown = document.getElementById("dropdown");
    var droppro = document.getElementById("drop-profile")
    dropdown.style.display = "none";
    droppro.style.display = "none";
}

handleSearch = () => {
    var input = document.querySelector("#searchInput");

    input
        .addEventListener("focus", function () {
            document.querySelector(".overlay").style.display = "block";
        })

    input
        .addEventListener("blur", function () {
            document.querySelector(".overlay").style.display = "none";
        })

    input.addEventListener("input", async function () {
        const response = await fetch("/api/posts");
        const data = await response.json();
        // console.log(input.value)
        var arr = data.map(post => post.title);
        // var arr = data.map(post => post.title);
        const filteredArray = arr.filter(title => title && title.toLowerCase().startsWith(input.value));
        // console.log(filteredArray)
        var clutter = "";
        filteredArray.forEach(function (title) {
            clutter += `<div class="res flex px-8 py-3">
        <i class="ri-search-line font-semibold text-black mr-5"></i>
        <h3 class="font-semibold text-black">${title}</h3>
    </div>`
        });
        var searchData = document.querySelector(".searchdata");
        if (input.value === '') {
            searchData.style.display = "none";
        } else {
            searchData.style.display = "block";

            searchData.innerHTML = clutter;
        }
    });

}


function showGuestOptions() {
    var dropdown = document.getElementById("guest-dropdown");
    dropdown.classList.toggle("hidden");
}




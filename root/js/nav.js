fetch("/root/html/nav.html")
.then((response) => response.text())
.then((data) => { 
    document.getElementById("replace_with_navbar").parentElement.innerHTML = data;
})
.catch((err) => console.log(err));
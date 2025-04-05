fetch("/root/html/nav.html")
.then((response) => response.text())
.then((data) => { 
    document.body.appendChild(data);
    document.getElementById("replace_with_navbar").remove();
})
.catch((err) => console.log(err));
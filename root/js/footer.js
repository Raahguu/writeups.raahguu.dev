fetch("/root/html/footer.html")
.then((response) => response.text())
.then((data) => { 
    document.getElementById("replace_with_footer").parentElement.innerHTML = data;
})
.catch((err) => console.log(err));
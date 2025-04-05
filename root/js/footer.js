fetch("/root/html/footer.html")
.then((response) => response.text())
.then((data) => { 
    document.body.appendChild(data);
    document.getElementById("replace_with_footer").remove();
})
.catch((err) => console.log(err));
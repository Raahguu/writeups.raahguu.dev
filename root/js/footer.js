fetch("/root/html/footer.html")
.then((response) => response.text())
.then((data) => { 
    let old_element = document.getElementById("replace_with_footer"); 
    old_element.parentNode.replaceChild(data, old_element); 
})
.catch((err) => console.log(err));
let divs = document.getElementsByClassName("fullIframe");
for (let i = 0; i < divs.length; i++) {
    let div = divs[i];
    div.style.height = div.contentWindow.document.body.scrollHeight + 'px';
}
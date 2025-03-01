var xhr;

function inici() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/public/imatges/comic.png', true);
    xhr.responseType = 'blob';

    xhr.onload = function (e) {
        if (this.status == 200) {
            var blob = this.response;
            // console.log(blob);
            var output = document.createElement('img');
            var URL = window.URL || window.webkitURL;
            output.src = URL.createObjectURL(blob);

            output.width = 50;
            output.height = 50;
            output.style.marginTop = "-15px";
            output.style.marginLeft = "90%";
            output.style.transform = "rotate(350deg)";

            document.getElementById('header').appendChild(output);
        };

    };
    xhr.send();
    
    // const container = document.querySelector('#comics');

    document.getElementById("cercar").onkeyup = function () {
        ajaxFunction(this.value);
    };

    const vBody = document.querySelector('body');

    vBody.addEventListener('click', function (e) {
        if (e.target.classList.contains('divComic')) {
            // document.querySelector('.hidden').style.display = 'block';
            // console.log('Haz hecho clic en el div comics');

            // obtener el título y la imagen del cómic seleccionado
            const comicTitulo = e.target.querySelector('.comicTitulo').innerHTML;
            const comicImagen = e.target.querySelector('.imgComic').src;
            const comicDescripcion = e.target.querySelector('.comicDescripcion').innerHTML;
            const comicPersonatges = e.target.querySelector('.comicPersonatges').innerHTML;

            // obtener el div oculto y establecer su estilo de visualización en "block"
            const hiddenDiv = document.querySelector('.hidden');
            hiddenDiv.style.display = 'block';

            // establecer el contenido del título y la imagen en el HTML del div oculto
            hiddenDiv.innerHTML = `
                <h2 class="comicTituloSELECT">${comicTitulo}</h2>
                <img class="comicImgSELECT" src="${comicImagen}" alt="${comicTitulo}">
                <p class="comicDescripcionSELECT"><b>Descripció: </b>${comicDescripcion}</p>
                <p class="comicPersonatgesSELECT"><b>Personatges: </b>${comicPersonatges}</p>
                
            `;
        } else {
            document.querySelector('.hidden').style.display = 'none';
        }
    });
}

function ajaxFunction(cadena) {

    xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    const urlAPI = `https://gateway.marvel.com:443/v1/public/comics?titleStartsWith=${cadena}&apikey=476dc1b2d49f463c22c34cb1578bfdd0&hash=653580380735072c47d7edc8e4d8254a&ts=1`;
    
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const json = this.response;
            let contentHTML = '';

            for (const comic of json.data.results) {
                if (comic.thumbnail.path == "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available") {
                    comic.thumbnail.path = "../public/imatges/marvelComics";
                    comic.thumbnail.extension = "jpg";
                }

                // Llista dels personatges del comic
                var comicPersonatges = comic.characters.items;
                var llistaPersonatges = [];
                for (var i = 0; i < comicPersonatges.length; i++) {
                    llistaPersonatges.push(comicPersonatges[i].name);
                }
                comic.characters = llistaPersonatges.join(", ");
                comic.characters = comic.characters ? comic.characters : "No s'ha trobat cap personatge.";

                // Descripció del comic
                var comicDescription = comic.description ? comic.description : "No s'ha trobat cap descripció.";

                // Portada del comic imatge + titol
                contentHTML += `
                <div class="divComic">
                    <img class="imgComic" src="${comic.thumbnail.path}.${comic.thumbnail.extension}"  alt="${comic.title}">
                    <div class="comicData">
                    <p class="comicTitulo">${comic.title}</p>
                    <p class="comicDescripcion">${comicDescription}</p>
                    <p class="comicPersonatges">${comic.characters}</p>
                    </div>
                </div>
                `;
            }
            const container = document.querySelector('#comics');
            container.innerHTML = contentHTML;
        }
    };

    xhr.open('GET', urlAPI);
    xhr.send();
}

// NECESAARIO AL FINAL
window.addEventListener("load", inici, true);
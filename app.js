const form = document.querySelector('#searchForm');
const showContainer = document.querySelector('#showContainer');
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const userSearch = form.elements.query.value;
    const config = { params: { q: userSearch } }
    try {
        deleteImages();
        const res = await axios.get(`https://api.tvmaze.com/search/shows`, config)
        makeImages(res.data);
    }
    catch (e) {
        const errorMSG = document.createElement('p');
        errorMSG.innerText = 'Sorry, no connection :(';
        console.log(e)
        document.body.append(errorMSG);
    }
    form.elements.query.value = '';
})

const makeImages = (shows) => {
    let newRow = document.createElement('div');
    newRow.classList.add('row', 'justify-content-evenly');
    showContainer.append(newRow);
    let colCounter = 0;
    for (let result of shows) {
        if (colCounter === 3) {
            newRow = document.createElement('div');
            newRow.classList.add('row', 'justify-content-evenly');
            showContainer.append(newRow);
            colCounter = 0;
        }

        if (result.show.image) {
            let newCol = document.createElement('div');
            newCol.classList.add('col-md-3', 'text-center', 'mb-3', 'show-column', 'px-0');

            // adding the show's image
            let imgContainer = document.createElement('div');
            imgContainer.classList.add('row-fluid', 'img-container');
            let showIMG = document.createElement('img');
            showIMG.src = result.show.image.original;
            showIMG.classList.add('img-fluid', 'show-img');
            let showDescriptionContainer = document.createElement('div');
            imgContainer.append(showIMG);
            if (result.show.summary) {
                showDescriptionContainer.classList.add('description');
                let showDescription = document.createElement('p');
                showDescription.innerHTML = result.show.summary.slice(0, 350) + '...';
                showDescriptionContainer.style.display = 'none';
                showDescriptionContainer.append(showDescription);
                imgContainer.append(showDescriptionContainer);
                imgContainer.addEventListener('mouseover', () => {
                    showDescriptionContainer.style.display = 'block';
                })
                imgContainer.addEventListener('mouseout', () => {
                    showDescriptionContainer.style.display = 'none';
                })
            }
            newCol.append(imgContainer);

            // show's name
            let showName = document.createElement('p');
            showName.classList.add('show-title');
            showName.innerText = result.show.name;
            newCol.append(showName);

            // not every show has a rating, so to avoid errors only add the rating if it exists (duh)
            if (result.show.rating.average) {
                let showRating = document.createElement('p');
                rating = result.show.rating.average;
                showRating.innerText = `${rating}/10`;
                showRating.classList.add('show-rating');
                if (rating >= 8.0) {
                    showRating.classList.add('good-show');
                }
                else if (rating >= 6.0) {
                    showRating.classList.add('mid-show');
                }
                else {
                    showRating.classList.add('bad-show');
                }
                newCol.append(showRating);
            }
            newRow.append(newCol);
            colCounter++;
        }
    }
}

const deleteImages = () => {
    showContainer.innerHTML = '';
}
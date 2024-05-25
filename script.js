let searchBox = document.getElementById("search-box");
let submitBtn = document.getElementById("submit-btn");
let loadMoreBtn = document.getElementById("load-more");
let offset = 0; // Offset for pagination

let generateGif = () => {
    // Display loader until gif load
    let loader = document.querySelector(".loader");
    loader.style.display = "block";
    document.querySelector(".wrapper").style.display = "none";
    loadMoreBtn.style.display = "none";

    // Get the search value
    let q = document.getElementById("search-box").value;

    // Allow for 20 gifs to be displayed as a result
    let gifCount = 20;

    // API URL
    let finalURL = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${q}&limit=${gifCount}&offset=0&rating=g&lang=en`;
    document.querySelector(".wrapper").innerHTML = "";

    // Make a call to the API
    fetch(finalURL)
        .then((response) => response.json())
        .then((info) => {
            console.log(info.data);

            // All GIFs
            let gifsData = info.data;
            gifsData.forEach((gif) => {
                // Generate cards for every gif
                let container = document.createElement("div");
                container.classList.add("container");
                let iframe = document.createElement("img");
                console.log(gif);
                iframe.setAttribute("src", gif.images.downsized_medium.url);
                iframe.onload = () => {
                    // If iframes have loaded correctly, reduce the count when each GIF loads
                    gifCount--;
                    if (gifCount == 0) {
                        // If all GIFs have loaded, then hide loader and display GIFs UI
                        loader.style.display = "none";
                        loadMoreBtn.style.display = "block";
                        document.querySelector(".wrapper").style.display = "grid";
                    }
                };
                container.append(iframe);
                // Copy link button
                let copyBtn = document.createElement("button");
                copyBtn.innerText = "Copy Link";
                copyBtn.onclick = () => {
                    copyGifLink(gif);
                };
                container.append(copyBtn);
                document.querySelector(".wrapper").append(container);
            });
        });
};


searchBox.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        if ("value" in e.target && e.target.value.trim() !== "") {
            generateGif();
        }
    }
});


loadMoreBtn.addEventListener("click", function () {
    // Get the search value
    let q = document.getElementById("search-box").value;

    // Allow for 20 gifs to be displayed as a result
    let gifCount = 20;

    // API URL template
    let urlTemplate = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${q}&limit=${gifCount}`;

    // Update offset for pagination
    offset += gifCount;

    // Construct final URL with offset
    let finalURL = `${urlTemplate}&offset=${offset}&rating=g&lang=en`;

    // Make a call to the API
    fetch(finalURL)
        .then((response) => response.json())
        .then((info) => {
            console.log(info.data);

            // All GIFs
            let gifsData = info.data;

            // Check if there are any gifs returned
            if (gifsData.length === 0) {
                // No more gifs to load, disable button
                loadMoreBtn.disabled = true;
                return;
            }

            gifsData.forEach((gif) => {
                // Generate cards for every gif and append directly
                let container = document.createElement("div");
                container.classList.add("container");

                let iframe = document.createElement("img");
                iframe.setAttribute("src", gif.images.downsized_medium.url);
                container.append(iframe);

                // Copy link button
                let copyBtn = document.createElement("button");
                copyBtn.innerText = "Copy Link";
                copyBtn.onclick = () => {
                    copyGifLink(gif);
                };
                container.append(copyBtn);
                document.querySelector(".wrapper").append(container);
            });
        });
});

let copyGifLink = (gif) => {
    // Append the obtained ID to default URL
    let copyLink = `https://media4.giphy.com/media/${gif.id}/giphy.mp4`;
    // Copy text inside the text field
    navigator.clipboard
        .writeText(copyLink)
        .then(() => {
            alert("GIF copied to clipboard");
        })
        .catch(() => {
            // If navigator is not supported
            alert("GIF copied to clipboard");
            // Create temporary input
            let hiddenInput = document.createElement("input");
            hiddenInput.setAttribute("type", "text");
            document.body.appendChild(hiddenInput);
            hiddenInput.value = copyLink;
            // Select input
            hiddenInput.select();
            // Copy the value
            document.execCommand("copy");
            // Remove the input
            document.body.removeChild(hiddenInput);
        });
};

// Generate GIFs on screen load or when user clicks on submit
submitBtn.addEventListener("click", generateGif);
window.addEventListener("load", generateGif);
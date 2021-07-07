/* Step 1: using axios, send a GET request to the following URL 
           (replacing the palceholder with your Github name):
           https://api.github.com/users/<your name>
*/

// Make a request for a user with a given ID

/* Step 2: Inspect and study the data coming back, this is YOUR 
   github info! You will need to understand the structure of this 
   data in order to use it to build your component function 

   Skip to Step 3.
*/

/* Step 4: Pass the data received from Github into your function, 
           create a new component and add it to the DOM as a child of .cards
*/

/* Step 5: Now that you have your own card getting added to the DOM, either 
          follow this link in your browser https://api.github.com/users/<Your github name>/followers 
          , manually find some other users' github handles, or use the list found 
          at the bottom of the page. Get at least 5 different Github usernames and add them as
          Individual strings to the friendsArray below.
          
          Using that array, iterate over it, requesting data for each user, creating a new card for each
          user, and adding that card to the DOM.
*/

var followersArray = [];

/* Step 3: Create a function that accepts a single object as its only argument,
          Using DOM methods and properties, create a component that will return the following DOM element:

<div class="card">
  <img src={image url of user} />
  <div class="card-info">
    <h3 class="name">{users name}</h3>
    <p class="username">{users user name}</p>
    <p>Location: {users location}</p>
    <p>Profile:  
      <a href={address to users github page}>{address to users github page}</a>
    </p>
    <p>Followers: {users followers count}</p>
    <p>Following: {users following count}</p>
    <p>Bio: {users bio}</p>
  </div>
</div>
*/

let cardEntry = document.querySelector('.cards');

var proxy = 'https://urlreq.appspot.com/req?method=GET&url=',
	url = proxy + 'https://github.com/abarne',
	colors = {
		eeeeee: 'github-graph-none',
		d6e685: 'github-graph-litte',
		'8cc665': 'github-graph-some',
		'44a340': 'github-graph-more',
		'1e6823': 'github-graph-most'
	};

document.addEventListener('DOMContentLoaded', function() {
	fetch(url)
		.then(function responseThen(response) {
			return response.text();
		})
		.then(function fetchThen(body) {
			var wrapper = document.createElement('div'),
				container = document.querySelector('.graph'),
				graph,
				gs,
				fill,
				index;

			wrapper.innerHTML = body;

			graph = wrapper.querySelector('svg.js-calendar-graph-svg');
			gs = [].slice.call(graph.querySelectorAll('g g'));

			for (var g of gs) {
				index = gs.indexOf(g);

				if (index < 26) {
					g.parentElement.removeChild(g);
				} else {
					g.attributes.transform.value = 'translate(' + 13 * (index - 26) + ', 0)';
				}
			}

			for (var rect of graph.querySelectorAll('rect')) {
				fill = rect.getAttribute('fill').substring(1);

				if (colors[fill]) {
					rect.classList.add(colors[fill]);
				}
			}

			graph.setAttribute('version', '1.1');
			graph.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
			graph.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
			graph.setAttribute('xml:space', 'preserve');

			container.innerHTML = graph.outerHTML;
		});
});

function gitCard(obj) {
	//create componenets
	let card = document.createElement('div'),
		newImg = document.createElement('img'),
		newCardInfo = document.createElement('div'),
		newHeader = document.createElement('h3'),
		pUserName = document.createElement('p'),
		pLocation = document.createElement('p'),
		pProfile = document.createElement('p'),
		aAddress = document.createElement('a'),
		pFollowers = document.createElement('p'),
		pFollowing = document.createElement('p'),
		pBio = document.createElement('p');

	//add classes
	card.classList.add('card');
	newCardInfo.classList.add('card-info');
	newHeader.classList.add('name');
	pUserName.classList.add('username');
	//	append children
	card.appendChild(newImg);
	card.appendChild(newCardInfo);
	newCardInfo.appendChild(newHeader);
	newCardInfo.appendChild(pUserName);
	newCardInfo.appendChild(pLocation);
	newCardInfo.appendChild(pProfile);
	newCardInfo.appendChild(pFollowers);
	newCardInfo.appendChild(pFollowing);
	newCardInfo.appendChild(pBio);
	pProfile.appendChild(aAddress);

	//add content
	newImg.src = obj.data.avatar_url;
	newHeader.textContent = `Name: ${obj.data.name}`;
	pUserName.textContent = `Username: ${obj.data.login}`;
	pLocation.textContent = `Location: ${obj.data.location}`;
	pProfile.innerHTML = `<a href=${obj.data.html_url}> Profile </a>`;
	aAddress.href = obj.data.html_url;
	aAddress.textContent = 'Github Link';
	pFollowers.textContent = `Followers: ${obj.data.followers}`;
	pFollowing.textContent = `Following: ${obj.data.following}`;
	pBio.textContent = `Bio: ${obj.data.bio}`;

	return card;
}

//create card for my own github info
axios
	.get('https://api.github.com/users/abarne')
	.then((response) => {
		console.log(response);
		cardEntry.appendChild(gitCard(response));
	})
	.catch((error) => {
		console.log('The data was not returned ', error);
	});

//followers list

axios
	.get('https://api.github.com/users/abarne/followers')
	.then((response) => {
		console.log(response);

		//go through each follower and create their cards
		response.data.slice(0, 9).map((item) => {
			axios
				.get(`https://api.github.com/users/${item.login}`)
				.then((response) => {
					cardEntry.appendChild(gitCard(response));
				})
				.catch((error) => {
					console.log('the data was not returned, ', error);
				});
		});
	})
	.catch((error) => {
		console.log('The data was not returned ', error);
	});

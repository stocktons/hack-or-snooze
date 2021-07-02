// stories.js
"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  // storyList = {
  //  stories: [Story, Story, Story Story, Story]
  // }
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

// function that loops over the favorites array from the API and grabs the show IDs and update our class instances of story in storyList
function checkIfFavorite(story) {
  if(!currentUser){ return };
  let favoriteIds = currentUser.favorites.map(story => story.storyId);
  return favoriteIds.includes(story.storyId);
}

  // listen for click to see if the target is a click
  // find story of the star that was clicked
  // add that story to currentUser.favorites
  // change property isFavorite to true
  // 
  // UI: toggleStar = manually update class attr of i element to fas

  

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  let isFavorite = checkIfFavorite(story) ? "fas" : "far" ;
  return $(`
      <li id="${story.storyId}">
        
        <span class="star">
          <i class="${isFavorite} fa-star"></i>
        </span>

        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


/** When a user clicks the favorite star, it should change the star's appearance and 
 * also call the functions to add or remove the story from the favorites list
 */
function toggleStar (evt) {
    if($(evt.target).attr("class") === "far fa-star") {
      $(evt.target).attr("class", "fas fa-star");
    } else if ($(evt.target).attr("class") === "fas fa-star"){
      $(evt.target).attr("class", "far fa-star");
    }
}

$allStoriesList.on("click", $(".star"), toggleStar); // change to include this in toggleFav later


/** Create Story instance from user input of author, title, url
 *    on submit, add entry to API and update story list
 */

async function submitStory(evt) {
  evt.preventDefault();

  const author = $("#author-name").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();

  // updates API
  let newStory = await storyList.addStory(currentUser, { author, title, url });

  // updates local memory
  storyList.stories.unshift(newStory);

  // updates DOM
  putStoriesOnPage();
}

$submitForm.on("submit", submitStory);
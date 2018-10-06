let windowId;
const content = document.querySelector("#content");

function onError(error) {
  console.log(`Error: ${error}`);
}

// developed using https://github.com/mdn/webextensions-examples

/*
 * Update the sidebar for this active tab
 */
function updateContent() {
  browser.tabs.query({windowId: windowId, active: true})
    .then((tabs) => {
      return tabs[0];
    })
    .then((tab) => {
      console.log(tab.url);
      content.textContent = tab.url;
      browser.tabs.executeScript(tab.id, {
        file: "/tota11y.js"
      }).catch(onError);
    }).catch(onError);
}

/*
Update content when a new tab becomes active.
*/
browser.tabs.onActivated.addListener(updateContent);

/*
Update content when a new page is loaded into a tab.
*/
browser.tabs.onUpdated.addListener(updateContent);

/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
browser.windows.getCurrent({populate: true}).then((windowInfo) => {
  windowId = windowInfo.id;
  updateContent();
});

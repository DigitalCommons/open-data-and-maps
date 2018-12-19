# Make the map-app be a web component

## How would this be used ?
Let's get straight to what we are aiming for, from a web page that uses the map-app web component:

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">

    <title>My lovely map</title>

    <!-- preparing for mobile use: -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <!-- load the web component(s): -->
    <script type="text/javascript" src="somewhere/map-app.js"></script>
  </head>
  <body>
    <map-app path="somewhere">
      <data-set name="dotcoop"></data-set>
      <data-set name="coops-uk-2019"></data-set>
      <div slot="about">
        <h3>My super map</h3>
        <p>is described here ...</p>
      </div>
    </map-app>
  </body>
</html>
```
Comparing this with the existing `index.html` that does not use the `map-app` web component:
- The stylesheets required by the map-app are now contained within the web component (via `<link>` elements in the shadow DOM).
- The app loading (using requirejs and `<script data-main="app" src="lib/require.js">`, for example) is now contained in the web component.

  *We need to check that this can be done - maybe javascript that defines the web component and loads the `app.js` needs to be separate from the `app.js`!*
- We still need to ensure that we're setting the viewport here.
- We need to load the code: `<script type="text/javascript" src="somewhere/map-app.js"></script>`
- The `<map-app>` component is shown here with a `path` tag. This is so that the map-app can find things like the `services` directory.

  *There may be a better solution to this - see also 'Do we need server interaction', below*
- The title is now set in `<title>`! That takes the place of `htmlTitle` in `config.json` (contained under the `variants` directory)
- We introduce another web component, `<data-set>` to define each dataset to be loaded. This takes the place of `namedDatasets` in `config.json`.

  *Is it bad practice to re-use the attribute name `name`?*
- The above two points make `config.json` redundant.
- We use a `<slot name="about">` in the map-app `<template>` to define the about info for the map. This makes the `about.html` under the `variants` directory redundant.

## Can we eliminate the variants mechanism?

The above means that both `config.json` and `about.html` are obsolete. 
What about `version.json`? *Needs thought*

We also need to think about the deployment configuration in a variant's makefile. e.g.:
```
# This variant is for testing.
# It's a variant of the newcastle-mapjam variant
PARENT_VARIANT := newcastle-mapjam

# Server to deploy to:
SERVER := ise-0-matt

# Base deployment directory on server (must pre-exist):
SERVER_BASE_DIR := /var/www/html/internal/maps/

# Directory under SERVER_BASE_DIR to deploy to (will be created during deployment):
SERVER_APP_SUBDIR := $(PARENT_VARIANT)/

# URL where map will be found after deployment:
DEPLOYED_MAP_URL := https://internal.solidarityeconomy.coop/maps/$(SERVER_APP_SUBDIR)

# Directory for config files to be used for this variant of the map:
SRC_CONFIG_DIR := variants/$(PARENT_VARIANT)/

HTACCESS_FILE := variants/$(PARENT_VARIANT)/internal-newcastle-mapjam.htaccess
``` 
Some of this may evaporate if we can get rid of the variant config (in `SRC_CONFIG_DIR`, above).

## Do we need any server interaction?

Current interactions:
- The map-app gets `config.json`, `version.json` and `about.html` from the `configuration` dir.
  Given the discussion above, this may turn out to be redundant.
- The map-app loads dat via named datasets in the `services` dir.
  If the map-app loads LOD directly (if we can overcome the CORS issues!), then this is redundant.

Future interactions:
- Allow a user to log in, so that they can authenticate themselves, e.g.  for changing data from the app. 

  *Maybe there's a better way - with authentication and authorisation be handled by something else, e.g. within the Solid stack?*

## Implementation

### Loading via requirejs

It's imporant to know where we are with this, as failure to get this working represents a risk.

Perhaps we can perform an experiment whereby:
- the existing `index.html` loads a script
- the loaded script dynamically creates a script element:  `<script data-main="app" src="lib/require.js">` in the standard DOM

Then we can see if this works.

UPDATE: It works! See [this commit](https://github.com/SolidarityEconomyAssociation/open-data-and-maps/commit/2ddaa658b3fb2b2c377d0e3ba8b37b2ac6e953c9)

### Creating and using a web component

We need to create a web component fo the map-app, and to add that web component into `index.html` in place of the code currently in the `<body>`.

UPDATE: This now works, although we're not yet able to add the customer element to the shadow DOM. See [this commit](https://github.com/SolidarityEconomyAssociation/open-data-and-maps/commit/e66b8a4e4f4ec4fc665f67023f6dcf0c98ae5315).
This requires that we load `index-using-web-component.html` instead of `index.html`.

### Moving the require.js loader into the shadow DOM

The next step is to get require.js to load the app into the shadow DOM, but there may be extra hurdles that appear at that point! For that, we need `<script data-main="app" src="lib/require.js">` itself to be added to the shadow DOM.

A benefit of doing this is that the client that uses the web component need not make require.js visible.

It may also be that this step is essential in order to get anything working at all! For example, if the top lovel element (e.g. the `map` and the `sidebar`) have been attached to the shadow DOM, then how can the javascript in the `app.js` access these?


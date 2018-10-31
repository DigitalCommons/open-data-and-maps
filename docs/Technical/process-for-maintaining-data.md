# Process for maintaining data

This document considers how we maintain a dataset.
Its purpose is to help us make a decision about a good approach.

## Background

Before September 2018, our datasets were created from CSV files. 
For example, the Co-ops-UK dataset is 'simply' a conversion of Coops UK's open data CSV files into Linked Open Data (LOD).
But now, we have pilot projects where the data needs to be gathered in the field: there is no longer a 'master' CSV file which contains the original data.

## Problem statement

The goal is to have a reliable way to update our LOD. 
The LOD exists online in two places:
- a triplestore with a SPARQL endpoint, and 
- a set of RDF files on a webserver.

It's important to note that the goal is to update the LOD, not the map.
The updating of the map is a consequence of updating the LOD.

## Current solution

Our current datasets are derived from CSV files. 
We have a process that 
- converts the CSV to RDF, and 
- updates the triplestore, and
- updates the RDF files on the webserver.

Here, the 'master' data is the CSV.

## Scenarios

### Data created directly from published open data

This is the situation we are in with Co-ops UK.
We take their open data (CSV) and use our current solution to convert it to LOD.

### Data maintained by us

If we are responsible for maintaining a dataset, then we can choose a set of tools that are usable by us (depending on our level of familiarity with particular tools).

For example, it may be fine for us to maintain a CSV file as 'master', and then use current processes to convert the data to LOD.
However, if we have alternatives that we are providing to other users, then we should use these, in order to 'eat our own dogfood'!

### Data gathered or updated in a mapjam

With a bunch of ther people in a room, contributing to a map, we need the focus to be on a digital map.
That map should provide the CRUD (Create, Read, Update, Delete) tools for maintaining the data.

### A third party hosts and maintains data

In this situation, we provide the tools (triplestore, web server for RDF files, map software, software for maintaining the data).
It must be possible for a the third party to update their data reasonably easily.

### Bulk data import

Some datasets will start with importing some data. At this stage, the data may be incomplete, but is good enough to get the ball rolling.
The data may be subsequently improved by manual updates.

Some existing datasets may be extended by importing data (e.g. in a CSV), where each row of the CSV corresponds to a new SSE initiative.

Some existing datasets may be modified by importing data, where a row of data may correspond to an SSE initiative already in the dataset.

## URIs

In the world of LOD, each object is identified by a URI.
The URI has the same format as a URL, familiar to everyone who's looked at the URL bar of their web browser.
For example, here's the URI of the Co-op called Argyll Small Woods Cooperative:
```
https://w3id.solidarityeconomy.coop/dotcoop/argyllsmallwoods
```
Part of this identifies the dataset:
```
https://w3id.solidarityeconomy.coop/dotcoop
```
and the remaining part identifies the SSE initiative itself:
```
argyllsmallwoods
```

The URI is the 'primary key' into the 'database':
- it must not be changed when updating the data for an initiative.
- when a new initiative is created, a new (not already used) URI must be 'minted' (in the sense that coins are minted).

To make life simple, restrictions should be imposed on the characters that can be used for a URI.

For the dotcoop dataset, URIs were generated from the `.coop` domain name.
This made the job very straightforward.

If we look at other datasets, (consider the Newcastle and Oxford pilot projects, for example), there isn't such an easy solution.
- Perhaps we can generated URIs by taking the name of an initiative, converting to lower case (maybe), removing punctuation ...
- Perhaps we can generate URIs from the domain name of an initiative, if it has a website ...

This is a question that requires further deliberation. 

Ideally, the minting of URIs should not disrupt the flow (for example, by requiring 'expert' advice) when putting new initatives on a map in a mapjam, for example.
Maybe we can allow for *temporary URIs*, which are to be replaced by permanent ones when an 'expert' is available to do so?


## Approaches

We'll consider the following approaches:
- CSV - maintain a 'master' CSV file
- uMap - use uMap as the primary tool for updating data
- enhance our existing map software to act as a tool for updating the data.

### CSV as master

This is very straightforward to implement, but is very unpleasant to use!
Imagine running a 'mapjam' workshop where the focus was on a spreadsheet.

Not only is this ugly and unfriendly, but it also lacks a method to intereactively position something on a map.

### Maintaining a dataset using uMap

From https://wiki.openstreetmap.org/wiki/UMap:

> uMap lets you create a map with OpenStreetMap layers and embed it in your site. 

... and it's a great open source tool for creating a map based on OSM.
But our problem is a bit different: our goal is to maintain an LOD dataset, rather than to create a map.
This section contains findings from an investigation into using uMap to maintain an LOD dataset.

The most commonly used instance of uMap is hoseted at https://umap.openstreetmap.fr/

> Free usage without charge open to anyone. Warning, the service is very busy but does not offer any commercial support; it is not warrantied to work permanently and may temporarily be unavailable 


#### Authentication and authorization in uMap

uMap does not itself support autentication of the person editing it.

There are 2 settings for authorization:
- the whole world can edit the map, or
- only those with the 'secret link' (a URL with a long string of seemingly random characters in it) can edit the map.

This is a very weak form of protection. URLs tend to get copied, e.g. in emails, and can then easily escape into the wild.
It is unreasonable for the 'average user' to understand the differences between 2 URLs - one of which grants permission to edit the data, and the other which does not.

With this scheme, it would not be possible to track who had made which changes to the data.

#### Importing data into uMap

uMap can import a variety of formats, including CSV.

We created an [experimental CSV file](https://github.com/SolidarityEconomyAssociation/open-data-and-maps/blob/master/data/umap/experiments/example-umap-import.csv)
for testing. It was based on a CSV file that was generated during the process of converting CSV to RDF.
Here's a fragment of the CSV:
```
Identifier,Name,Description,Legal Forms,Street Address,Locality,Region,Postcode,Country Name,Website,Companies House Number,IgnoredLat,IgnoredLong,Geo Container,Latitude,Longitide
2020,20/20 Housing Co-operative,,Cooperative,,,,B13 8AB,,,,,,http://data.ordnancesurvey.co.uk/id/postcodeunit/B138AB,52.451880,-1.889728
2rivers,M&S Community Energy Society,,Cooperative,,,,LA14 2PN,,https://www.mandsenergysociety.com/,,,,http://data.ordnancesurvey.co.uk/id/postcodeunit/LA142PN,54.118489,-3.241650
3mules,3 Mules Coop LLP,,Cooperative,,,,M155RF,,,,,,http://data.ordnancesurvey.co.uk/id/postcodeunit/M155RF,53.465469,-2.248348
```

Most importantly, the headers in the first row of the CSV must be understandable by uMap. 
This applies particularly to 
- Latitude
- Longitude

The data was successfully loaded into uMap.

#### Editing fields on uMap

All of the fields included in the original CSV are now available for editing.

The lat and long fields are editable by dragging the icon on the map.
This is so easy to do that it is easy to do by accident!!

In the example CSV file, there's a column called 'Identifier'. 
This should not be edited!
But there does not seem to be a way to prevent this, other than deleting it from the CSV input.
But if we do that, we won't have it available when we want to export the data.

#### Creating new initiatives on uMap

Right-click on the map and choose `Add Marker` from the context menu.

Interestingly: the fields available for input match those provided in the input CSV file.

#### Saving data on uMap

Question: What happens if more than one instance of the map has been updated in different browsers at the same time?
In an attempt to test this, I tried loading the uMap into Safari (I had originally been working in Chrome): The button to edit the map did not appear in Safari. Why not?
I then tried in Firefox, with the same result: no edit button. Why? Perhaps this is to do with authentication/authorization?
Solution: It's about editing permissions! For example, you can share the 'secret link' (ho ho) that allows the map to be edited.

Answer: You get an error message after clicking `Save`:
> Woops! Someone else seems to have edited the data. You can save anyway, but this will erase the changes made by others.

That allows you to choose between wiping out all of your changes, or wiping out all of someone else's changes. 
I don't think there's an option to see what changes you are about to wipe out.

#### Exporting data from uMap

Do this via the icon whose hovertext is `Embed and share this map`.
This opens a dialogue which allows on to choose to download `Full Map Data`.
This downloads a file with extension `.umap` which is in JSON format.
Here's a fragment:
```
        {
          "type": "Feature",
          "properties": {
            "Identifier": "2020",
            "Name": "20/20 Housing Co-operative",
            "Description": "",
            "Legal Forms": "Cooperative",
            "Street Address": "",
            "Locality": "",
            "Region": "",
            "Postcode": "B13 8AB",
            "Country Name": "",
            "Website": "",
            "Companies House Number": "",
            "IgnoredLat": "",
            "IgnoredLong": "",
            "Geo Container": "http://data.ordnancesurvey.co.uk/id/postcodeunit/B138AB"
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
              -1.889728,
              52.45188
            ]
          }
        },

```

#### How to update our LOD from uMap

At any point, we can take a dump of the JSON from the uMap.
This requires 'expert' intervention to decide when to do this.
The mechanism for creating the JSON dump is via the uMap user interface.
If this is the only mechanism for doing this, then it is difficult to automate.

The JSON must then be copied to a place where it can be picked up be a conversion process.

The conversion process may well find errors (given the list of problems below).
It is unfortunate that these errors may only be found days after the error was made, during a uMap editing session.
Errors are always easier to fix if they can be reported at the time they are made.

If there are several JSON dumps, then it will require 'expert' intervention to select which ones to process, which to ignore, what order to process them in etc.

#### Problems with uMap as a dataset editor

We need to bare in mind that uMap is intended to edit a map, not a dataset.
It is a general-purpose tool that does not understand the peculiarities of our requirements.

- Users may reasonably think that the uMap *is* the production map.
If they have any problems with the somewhat complicated process of converting the uMap data into LOD, then they may well fall back on the uMap as their map, and in doing so, our goals to create LOD will not be met.

- The process of taking uMap data and creating LOD will require manual steps by an 'expert'. 
So there is likely to be delay (could easily be hours or even days) between ediiting uMap and the results being available on the LOD-based map.

- It's very easy to accidentally move a Marker. 
If the user clicks on a marker, then holds down the mouse for a short while, any subsequent mouse movement will be interpretted as a request to relocate the marker.
Accidents are inevitable.

- Currently, we often locate initiatives approximately using postcode. 
But we also provide LOD fields for specifying the location more accurately.
In the LOD, we can distinguish between initiatives that are using the approximate location, and those that have a precise location specified.
This distinction is likely to be lost in uMap.

- We must provide a unique identifier (from which the URI id derived) for each initiative.
This must be included in the data we load into uMap so that we can track which initiative is being updated.
This becomes broken if the user modifies the identifier within uMap.
But it is not possible to specify that the identifier field cannot be edited in uMap.

- uMap saves changes to the data for the whole dataset as one big lump.
So, if the data is being edited by two instances of uMap at the same time, there is the potential to loose a large amount of data.

- We can't specify validation criteria for fields. 
In particular, when we have a field that can only take one of a fixed set of possible values (and that's normal for fields specifying taxonomic info), we can't enforce this.
Workaround: invalid field values will have to be cleaned up manually.

- The Linked Data we generate for sse initiatives is located by a point (lat, long).
uMap allows features to be created which are polylines or polygons.
If a user exploits this feature of uMap, it will appear to work (the feature is created in uMap),
but we won't be able to generate LOD from the result.

- Sometimes we can't generate a geo-location for an initiative (e.g. due to an error in the postcode). 
But we still create LOD for the initiative.
These initiatives will never appear on a uMap, so the uMap can't be used to give them a geo-location.



### Update existing map software to provide editor

Of course, we don't want to develop more software if we don't have to.
But the list of problems withe uMap is sufficiently long that we should at least consider what might be required.

Developing our own editor allows us to exploit our domain-specific needs, to get a made-to-measure solution.

#### How it might work

First we need to authenticate any user, and check their authorization to change the dataset.
Any changes they make will be tagged with something to identify them (e.g. user name).

Let's assume that we are going to modify the triple store directly.

The editor can work at a fine level of granularity: the change to any field in the data can be treated as an atomic transaction.

To sketch a possible architectire:
- user modifies a field
- the modification request is sent to the web server that served the map
- the web server invokes an *update engine*, a process to implement the modification
- the update engine requests updates to the triplestore using SPARQL 1.1 update (see [Virtuoso SPARQL 1.1. Update Examples](http://vos.openlinksw.com/owiki/wiki/VOS/VirtTipsAndTricksSPARQL11Update)
Note that I don't think (needs checking) that Virtuoso supports `INSERT DATA`, but it supports `INSERT`.
There are various methods of securing a SPARQL endpoint on Virtuoso, oncluding OAUTH, WebID and 'digest authentication'.
- the update engine returns the success or failure to the original requester (the map app).

TODO: read [Deploying PHP applications using Virtuoso as Application Server](http://vos.openlinksw.com/owiki/wiki/VOS/VirtuosoPHP).
Does that provide a better way to interface the web server (serving map-app) to Virtuoso?

TODO: Look into alternatives: [SPARQL 1.1 Update](https://www.w3.org/TR/sparql11-update/), [SPARQL 1.1 Graph Store HTTP Protocol](https://www.w3.org/TR/sparql11-http-rdf-update/), [Linked Data Platform 1.0](https://www.w3.org/TR/ldp/), [Solid](https://github.com/solid/solid)

#### Authentication

We need to provide a way for a user to authenticate (login).
The [PHP-Auth library](https://github.com/delight-im/PHP-Auth) looks excellent.
It includes things like email verification, which is nice.

Presumably we'd use [PHP Mail](https://www.w3schools.com/php/php_ref_mail.asp) for sending email.
We shouldn't need to receive email. (I think).

This requires that we have mail set up on the web server.
A good option may be SSMTP which should allow us to use an existing SMTP server (e.g. webarch), without the need to get `sendmail` up and running in a way that satisfies gmail, etc.
See http://edoceo.com/howto/ssmtp for example configurations.

If we want to use [WebId 1.0](https://www.w3.org/2005/Incubator/webid/spec/), there's a go how-to guide [WebID – A Guide For The Clueless](https://trueg.wordpress.com/2012/03/15/webid-a-guide-for-the-clueless/).

#### User Interface

After authentication, an authorized user can then see a button, or menu option that puts the app into `edit-mode`.

In `edit-mode`, new menu options appear for each initiative's marker:
- re-position
- edit details

There may be some extra options that recognize the difference between a marker that has been positioned precisely, as opposed to one that is positioned via its geo-container (e.g. postcode). 

When re-positioning, the marker becomes draggable. We need to decide what user action makes the marker no longer draggable.

When editing details, a form is presented, perhaps in the sidebar, perhaps in a modal dialogue.

Changes are sent to the web server as 'transactions'. There needs to be a way to display feedback from the server to these transactions (errors, warnings, confirmations).

An undo mechanism would be highly desirable. 

This mechanism should support highly granular changes: usually one field at a time.

#### Editor configuration and validation

Some editable fields are plain text. Others require some configuration.
For example, when the field value comes from a fixed set (e.g. often the case for taxonomy items), a suitable UI widget should be used (e.g. drop-down menu, radio buttons, etc).

We should look at configuring these directly from the LD triples that describe the field. 
Using this mechanism, it also becomes possible to switch language where translations are available (as is the case for many fields in ESSGLOBAL).

Properly configured UI components reduce the chance of error.
If further validation is needed, we should investigate if this can also be specified in the LD triples that define the field.

##### Configuring new fields

There are two scenarios to consider:
- An initiative has no data for a particular field, but that field is commonly used for initiatives.
- We want to introduce a new field that is not used by any initiative.

These are both common scenarios.
We need to design a method for doing this that is as lightweight as possible, making it easy to add new fields.

Perhaps field definitions are available as triples from the triplestore, and these are loaded into the app when it is put into `edit-mode`?

#### What about initiatives without a valid geo-location?

In the absense of precise location information, our current approach is to create LOD with approximate geo-location using, for example, postcodes.
Sometimes, there is not a postcode for which we can find a geo-location (e.g. missing postode, error in postcode, new postcode, no geo-location available (e.g. for Northern Ireland postcodes) etc).
We still create LOD for these iitiatives, by obviously, they can't appear on a map.

We should provide a way to list these locationless initiatives so that the user can drag them to a position on the map.
Ideally, the UI lets us drag them directly onto the map. 
In any case, there should be a context menu (or similar thing) that allows the locationless initiative to be selected and then positioned.

#### Editing on a mobile device?

It may be that we restrict editing to desktop devices (more accurately, to devices that have enough pixels to simultaneously show a sidebar and the map).
More investigation needed.

#### Additions to LOD

We should include a `modification time` to show when something was last modified.
It would probably be sufficient to do this per initiative, rather than per 'field'.

We may want to provide an audit trail for the changes to each initiative.

It is likely to be useful if each initiative has a `comment` predicate, possible a list of comments.
This can be used for anything that an editor wants to add that is not possible in the fixed set of existing fields.




 





TODO - objectives. The underlying requirement is maintain a dataset. The triplestore is (probably) the 'master' copy of the data

TODO - consider issues around user authentication and authorisation to make changes. Consider audit trails.

TODO - Maybe we should add 'comments' about an initiative - similar to those in a word processor - can be marked as 'done', etc.

TODO - Document ideas around homegrown solution - transactions sent to server. Server then updates triple store. Triple store notifies changes to initiative, etc.

TODO - document findings about uMap, e.g. when loading open-data-and-maps/data/umap/experiments/bla.csv

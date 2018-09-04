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


#### Authentication and authorization

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

#### Editing fields

All of the fields included in the original CSV are now available for editing.

The lat and long fields are editable by dragging the icon on the map.
This is so easy to do that it is easy to do by accident!!

In the example CSV file, there's a column called 'Identifier'. 
This should not be edited!
But there does not seem to be a way to prevent this, other than deleting it from the CSV input.
But if we do that, we won't have it available when we want to export the data.

#### Creating new initiatives

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

#### Exporting data

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

#### How to update our LOD

At any point, we can take a dump of the JSON from the uMap.
This requires 'expert' intervention to decide when to do this.
The mechanism for creating the JSON dump is via the uMap user interface.
If this is the only mechanism for doing this, then it is difficult to automate.

#### Problems with uMap as a dataset editor

We need to bare in mind that uMap is intended to edit a map, not a dataset.
It is a general-purpose tool that does not understand the peculiarities of our requirements.

Users may reasonably think that the uMap *is* the production map.
If they have any problems with the somewhat complicated process of converting the uMap data into LOD, then they may well fall back on the uMap as their map, and in doing so, our goals to create LOD will not be met.

The process of taking uMap data and creating LOD will require manual steps by an 'expert'. 
So there is likely to be delay (could easily be hours or even days) between ediiting uMap and the results being available on the LOD-based map.

It's very easy to accidentally move a Marker. 
If the user clicks on a marker, then holds down the mouse for a short while, any subsequent mouse movement will be interpretted as a request to relocate the marker.
Accidents are inevitable.

Currently, we often locate initiatives approximately using postcode. 
But we also provide LOD fields for specifying the location more accurately.
In the LOD, we can distinguish between initiatives that are using the approximate location, and those that have a precise location specified.
This distinction is likely to be lost in uMap.

We must provide a unique identifier (from which the URI id derived) for each initiative.
This must be included in the data we load into uMap so that we can track which initiative is being updated.
This becomes broken if the user modifies the identifier within uMap.
But it is not possible to specify that the identifier field cannot be edited in uMap.

uMap saves changes to the data for the whole dataset as one big lump.
So, if the data is being edited by two instances of uMap at the same time, there is the potential to loose a large amount of data.

We can't specify validation criteria for fields. 
In particular, when we have a field that can only take one of a fixed set of possible values (and that's normal for fields specifying taxonomic info), we can't enforce this.
Workaround: invalid field values will have to be cleaned up manually.

The Linked Data we generate for sse initiatives is located by a point (lat, long).
uMap allows features to be created which are polylines or polygons.
If a user exploits this feature of uMap, it will appear to work (the feature is created in uMap),
but we won't be able to generate LOD from the result.



 



TODO - objectives. The underlying requirement is maintain a dataset. The triplestore is (probably) the 'master' copy of the data

TODO - consider issues around user authentication and authorisation to make changes. Consider audit trails.

TODO - Maybe we should add 'comments' about an initiative - similar to those in a word processor - can be marked as 'done', etc.

TODO - Document ideas around homegrown solution - transactions sent to server. Server then updates triple store. Triple store notifies changes to initiative, etc.

TODO - document findings about uMap, e.g. when loading open-data-and-maps/data/umap/experiments/bla.csv

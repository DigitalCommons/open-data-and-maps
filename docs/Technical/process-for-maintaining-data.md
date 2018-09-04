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


TODO - document scenarios
- New data created in map jam
- Situation where someone else hosts map and data

TODO - objectives. The underlying requirement is maintain a dataset. The triplestore is (probably) the 'master' copy of the data

TODO - consider issues around user authentication and authorisation to make changes. Consider audit trails.

TODO - Maybe we should add 'comments' about an initiative - similar to those in a word processor - can be marked as 'done', etc.

TODO - Document ideas around homegrown solution - transactions sent to server. Server then updates triple store. Triple store notifies changes to initiative, etc.

TODO - document findings about uMap, e.g. when loading open-data-and-maps/data/umap/experiments/bla.csv

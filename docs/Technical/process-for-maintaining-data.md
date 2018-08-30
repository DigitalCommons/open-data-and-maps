# Process for maintaining data

This document considers how we maintain a dataset.
Its purpose is to help us make a decision about a good approach.

## Background

Before September 2018, our datasets were created from CSV files. 
For example, the Co-ops-UK dataset is 'simply' a conversion of Coops UK's open data CSV files into Linked Open Data (LOD).
But now, we have pilot projects where the data needs to be gathered in the field: there is no longer a 'master' CSV file which contains the original data.

TODO - look at approaches

- uMap
- home grown
- csv editing!

TODO - document scenarios
- New data created in map jam
- Situation where someone else hosts map and data

TODO - objectives. The underlying requirement is maintain a dataset. The triplestore is (probably) the 'master' copy of the data

TODO - consider issues around user authentication and authorisation to make changes. Consider audit trails.

TODO - Maybe we should add 'comments' about an initiative - similar to those in a word processor - can be marked as 'done', etc.

TODO - Document ideas around homegrown solution - transactions sent to server. Server then updates triple store. Triple store notifies changes to initiative, etc.

TODO - document findings about uMap, e.g. when loading open-data-and-maps/data/umap/experiments/bla.csv

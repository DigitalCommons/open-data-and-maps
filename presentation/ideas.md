# Linked Open Data
TOTO - need a name

# Vision

Applications powered by data
- platform apps (mention "ratings"/feedback data - what's the proper word for this?)
- maps
- analysis
- TODO - better example apps

# Requirements

- global identifiers
- openness - of everything!
- encourage re-use of other people's work
- durable solutions, data infrastructure
- 

# Tension

Between quick (agile?) solutions and re-using existing work.

Lesson from software engineering - be very cautious about starting again from scratch.
Existing software may contain solutions to problems that you won't even have though about yet.
The devil is in the detail - bug fixes contain knowledge that may have been hard-earned.

Plugable adapters.

# LOD benefits

- global identifiers
- mature data models
- uses existing HTTP infrastructure
- excellent design

# Architecture

## Diagram

Shows the following components
- LOD at it's URL
- Virtuoso triplestore
- map-app
- browser

# LOD overview

- Identify things via HTTP URIs
- dereferenceable URIs - resolve to URLs
- {Subject, Predicate, Object} triples
- {Graph, Subject, Predicate, Object} quads
- triple stores - databases
- SPARQL - Like SQL, but for querying triple store databases
- reasoning engines
- Data models with well-defined semantics (maybe give example of geographic 'within' spatial relation).
- Links (data, models)
- Many existing data models
- Internationalisation - support for languages
- Excellent documentation and specification of standards (W3C)

# Taxonomy

- challenge to integrate/coallesce
- using the same terms for the same things

# Experimental dataset

- Co-ops UK open dataset
- ESSGLOBAL application profile (data model, vocabulary)

# Overview description

with the ISE website in mind ...

Data is the fuel that powers the World Wide Web. Huge global corporations realize that it is the most valuable commodity today, converting it into massive financial rewards for the few. 
For the Solidarity Economy, it can power the growth of our movement, and help to claw back some of what has been taken from us by global capitalism.

Data can help us grow by documenting what is out there, for example with maps, by making our movement more visible, and by providing statistics to chart progress, and much more. More people will use the alternatives if they are easier to find.
Data about and for the benefit of the Solidarity Economy can help us regain lost ground by powering platforms to provide alternatives to the global giants (airbnb, uber, deliveroo). 

ISE has undertaken a detailed study of the role that Linked Open Data can play in this arena, harnassing the power of the Semantic Web. We have produced experimental Linked Open Data desccribing over 13,000 UK co-operative outlets, based on the open dataset published by Co-ops UK. This data has been deployed in a "triple store" (database for Linked Open Data), with a SPARQL endpoint (for querying the data over the web). We have created a map application that is powered by queries made to SPARQL endpoint. 

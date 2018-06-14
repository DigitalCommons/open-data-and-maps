# SameAs



When we convert a dataset into LOD, there may be initiatives described within that dataset that are also described within other datasets that we have already convered to LOD.
We need to be able to say that two initiatives from different datasets both refer to the same real-work initiative.
For example, both of these URIs refer to the same thing:
```
https://w3id.solidarityeconomy.coop/dotcoop/solidarityeconomy
https://w3id.org/coops-uk/2017/R021071
```
This relationship is expressed in Linked data using the `owl:sameAs' predicate:
```
<https://w3id.solidarityeconomy.coop/dotcoop/solidarityeconomy> owl:sameAs <https://w3id.org/coops-uk/2017/R021071>
```

## How?

There are two related questions:
- how do we find out if initiatives in a new dataset are the `sameAs` initiatives in an old dataset?
- where do we store the information that one initiative is the `sameAs` another?

### Storage
Clearly the `sameAs` data needs to be stored in a triplestore.
More specifically if the data for `uri1` is tored in `NamedGraphA`, then all of `uri1`'s `sameAs` triples should also be stored in `NamedGraphA`.

Corollary: if `uri1 sameAs uri2`, where `uri1` is in `NamedGraphA` and `uri2` is in `NamedGraphB`, then the `sameAs` triple is stored in both Named Graphs.

### Detection
So,  it makes sense to have processes that read from existing triplestores to detect these `sameAs` relations.

## Publishing data

We need to publish these sameAs relationships.
It is desirable that we publish them in the RDF that is returned when the URI is dereferenced.

So, when we create the RDF, we need to be able to access sameAs data that has been created for previously generated datasets.

Where is that sameAs data stored?
- In triplestores
- Locally on disk



# PACKAGE

dataserver - Database query service application for Solidarity Economy initiatives

# USAGE

Add this as a dependency to a sea-site. In the site config directory, supply:

 - default-graph-uri.txt
 - endpoint.txt
 - query.rq

And optionally these others although FIXME I do not understand this
very well at the moment (pending full comprehension of
`get_dataset.php`):

 - construct_all.rq
 - activities.rq
 - org-structure.rq
 
Then specify the `www` directory as the appropriate parameter for
`sea-site-build`.
 
This supplies query functionality as expected by the `sea-map`, in
`get_dataset.php`.


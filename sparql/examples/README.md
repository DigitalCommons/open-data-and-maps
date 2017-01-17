# SPARQL examples

These examples have been generated in the course of research. They may not relate directly to the linked open data for the solidarity economy.

## Description of examples

### companies-in-sector

Using Companies House endpoint, and servicing Ordnance Survey's endpoint, this query will find every company in the same postcode sector as the given company, it will list their names along with their postcodes, it includes an OPTIONAL command which returns empty postcodes as well.

### list-postcodes-in-pcArea

Using Ordnance Survey's endpoint, this will find all the postcodes in a given postcode area.

### SIC-and-postcode-sector

This query is directed at the Companies House endpoint. It takes a specific company, and finds its postcode and SIC code. It then uses the SERVICE command to go to the Ordnance Survey endpoint, which finds all postcode units that belong to the same postcode sector. Then all the companies with those postcodes and the same SIC code are found.
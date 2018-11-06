
# WebId for Authentication

- [WebId wiki](https://www.w3.org/wiki/WebID)
- [Virtuoso: Securing your SPARQL Endpoint via WebID](http://vos.openlinksw.com/owiki/wiki/VOS/VirtSPARQLSecurityWebID)

## Experimentation

I've created a WebId using a clone of https://github.com/njh/gen-webid-cert.

```
bombyx:~/SEA/gen-webid-cert$ ./gen-webid-cert.sh
```

This generates `webid.pem` and outputs RDF to be located where the WebId will be dereferenced on a web server (e.g. in `foaf.rdf`):
```
<?xml version="1.0"?>
<rdf:RDF
 xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
 xmlns:cert="http://www.w3.org/ns/auth/cert#"
 xmlns:foaf="http://xmlns.com/foaf/0.1/">
  <foaf:Person rdf:about="https://w3id.solidarityeconomy.coop/people/matt/profile#me">
    <foaf:name>Matt Wallis</foaf:name>
    <cert:key>
      <cert:RSAPublicKey>
        <cert:modulus rdf:datatype="http://www.w3.org/2001/XMLSchema#hexBinary">E17501614523366DB940D5917FF287CB50DAA4D96539BB41F9A6A9D243E28E915996CC345FB058C1C1F12119695D16B3BFB982522581DB8BE49F251DA1252434B11FA2115959E748B73369226634DBC0373CF14DE10ACFA591471B37F15B3D5378F019A735DBFECAA09E748BD4782632BCE38304ACB1AE295C1B021526B32B42F14E6B592402C2B8186DC07426E7CC52637FFC2E11FC789DCA6E0D843BB5FD414C6E7A78595088CAB53BAB61F23C4041009CE307DD72D17E678B2038C270DB80FF0F5AA1D6DD1EE2CA51930AC78DAEED44C9D3A40C6344F9DB62F2294836EC30C389BDF265F9B56E95B3FAF21D9FA7BFA7C4F939C2C2BD92A8B39639EA7372DD</cert:modulus>
        <cert:exponent rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">65537</cert:exponent>
      </cert:RSAPublicKey>
    </cert:key>
  </foaf:Person>
</rdf:RDF>
```

I merged this into and existing `foaf.rdf` file:
```
bombyx:~/MattWebsite$ git diff
diff --git a/src/foaf.rdf b/src/foaf.rdf
index 908b71f..423995b 100644
--- a/src/foaf.rdf
+++ b/src/foaf.rdf
@@ -3,6 +3,7 @@
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
        xmlns:foaf="http://xmlns.com/foaf/0.1/"
+       xmlns:cert="http://www.w3.org/ns/auth/cert#"
        xmlns:admin="http://webns.net/mvcb/">
        <foaf:PersonalProfileDocument rdf:about="https://w3id.org/people/matt/foaf">
                <foaf:maker rdf:resource="https://w3id.org/people/matt"/>
@@ -21,4 +22,14 @@
                <foaf:workplaceHomepage rdf:resource="https://www.solidarityeconomy.coop/"/>
                <foaf:workInfoHomepage rdf:resource="https://www.solidarityeconomy.coop/aboutus/our-team"/>
        </foaf:Person>
+       <foaf:Person rdf:about="https://w3id.solidarityeconomy.coop/people/matt/profile#me">
+               <foaf:name>Matt Wallis</foaf:name>
+               <cert:key>
+                       <cert:RSAPublicKey>
+                               <cert:modulus rdf:datatype="http://www.w3.org/2001/XMLSchema#hexBinary">E17501614523366DB940D5917FF287CB50DAA4D96539BB41F9A6A9D243E28E915996CC345FB058C1C1F12119695D16B3BFB982522581DB8BE49F251DA1252434B11FA2115959E748B73369226634DBC0373CF14DE10ACFA591471B37F15B3D5378F019A735DBFECAA09E748BD4782632BCE38304ACB1AE295C1B021526B32B42F14E6B592402C2B8186DC07426E7CC52637FFC2E11FC789DCA6E0D843BB5FD414C6E7A78595088CAB53BAB61F23C4041009CE307DD72D17E678B2038C270DB80FF0F5AA1D6DD1EE2CA51930AC78DAEED44C9D3A40C6344F9DB62F2294836EC30C389BDF265F9B56E95B3FAF21D9FA7BFA7C4F939C2C2BD92A8B39639EA7372DD</cert:modulus>
+                               <cert:exponent rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">65537</cert:exponent>
+                       </cert:RSAPublicKey>
+               </cert:key>
+       </foaf:Person>
+
 </rdf:RDF>
```

Set up redirection from `profile` to `foaf.rdf`:
```
matt@ise-0:/var/www/html/w3id.org/people/matt$ git diff
diff --git a/people/matt/.htaccess b/people/matt/.htaccess
index 5100dc5..32af4ce 100644
--- a/people/matt/.htaccess
+++ b/people/matt/.htaccess
@@ -1,8 +1,18 @@
 Options +FollowSymLinks
 RewriteEngine on
 #A set of rewrite rules with content negotiation for w3id.org/people/matt
+
+# profile is used in matt's WebID: https://w3id.org/people/matt/profile#me
+RewriteCond %{HTTP_ACCEPT} ^.*application/rdf\+xml.* 
+RewriteRule ^profile$ http://163.172.187.51/matt/foaf.rdf [R=303,L]
+RewriteCond %{HTTP_ACCEPT} ^.*text/turtle.* 
+RewriteRule ^profile$ http://163.172.187.51/matt/foaf.ttl [R=303,L]
+
+# Other requests for RDF are also redirected to an appropriate foaf file:
 RewriteCond %{HTTP_ACCEPT} ^.*application/rdf\+xml.* 
 RewriteRule ^$ http://163.172.187.51/matt/foaf.rdf [R=303,L]
 RewriteCond %{HTTP_ACCEPT} ^.*text/turtle.* 
 RewriteRule ^$ http://163.172.187.51/matt/foaf.ttl [R=303,L]
+
+# And everything else gets passed to the host:
 RewriteRule ^(.*)$ http://163.172.187.51/matt/$1 [R=303,L]
```

Now test retrieval of the RDF:
```
bombyx:~/SEA/gen-webid-cert$ curl -L -H "Accept: application/rdf+xml" https://w3id.solidarityeconomy.coop/people/matt/profile#me
<?xml version="1.0" encoding="utf-8" ?>
<rdf:RDF
	xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
	xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
	xmlns:foaf="http://xmlns.com/foaf/0.1/"
	xmlns:cert="http://www.w3.org/ns/auth/cert#"
	xmlns:admin="http://webns.net/mvcb/">
	<foaf:PersonalProfileDocument rdf:about="https://w3id.org/people/matt/foaf">
		<foaf:maker rdf:resource="https://w3id.org/people/matt"/>
		<foaf:primaryTopic rdf:resource="https://w3id.org/people/matt"/>
		<foaf:title xml:lang="en">Matt Wallis' FOAF file</foaf:title>
	</foaf:PersonalProfileDocument>
	<foaf:Person rdf:about="https://w3id.org/people/matt">
		<foaf:name>Matt Wallis</foaf:name>
		<foaf:title>Mr</foaf:title>
		<foaf:givenName>Matt</foaf:givenName>
		<foaf:familyName>Wallis</foaf:familyName>
		<foaf:skypeID>mattwallis-oxford</foaf:skypeID>
		<foaf:homepage>https://w3id.org/people/matt</foaf:homepage>
		<foaf:based_near rdf:resource="http://dbpedia.org/resource/Oxford"/>
		<foaf:mbox_sha1sum>b932a9715e9e6d3c773d2b590f295d12ccffc62b</foaf:mbox_sha1sum>
		<foaf:workplaceHomepage rdf:resource="https://www.solidarityeconomy.coop/"/>
		<foaf:workInfoHomepage rdf:resource="https://www.solidarityeconomy.coop/aboutus/our-team"/>
	</foaf:Person>
	<foaf:Person rdf:about="https://w3id.solidarityeconomy.coop/people/matt/profile#me">
		<foaf:name>Matt Wallis</foaf:name>
		<cert:key>
			<cert:RSAPublicKey>
				<cert:modulus rdf:datatype="http://www.w3.org/2001/XMLSchema#hexBinary">E17501614523366DB940D5917FF287CB50DAA4D96539BB41F9A6A9D243E28E915996CC345FB058C1C1F12119695D16B3BFB982522581DB8BE49F251DA1252434B11FA2115959E748B73369226634DBC0373CF14DE10ACFA591471B37F15B3D5378F019A735DBFECAA09E748BD4782632BCE38304ACB1AE295C1B021526B32B42F14E6B592402C2B8186DC07426E7CC52637FFC2E11FC789DCA6E0D843BB5FD414C6E7A78595088CAB53BAB61F23C4041009CE307DD72D17E678B2038C270DB80FF0F5AA1D6DD1EE2CA51930AC78DAEED44C9D3A40C6344F9DB62F2294836EC30C389BDF265F9B56E95B3FAF21D9FA7BFA7C4F939C2C2BD92A8B39639EA7372DD</cert:modulus>
				<cert:exponent rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">65537</cert:exponent>
			</cert:RSAPublicKey>
		</cert:key>
	</foaf:Person>

</rdf:RDF>
```

It may be necessary to move the `<foaf:Person rdf:about="https://w3id.org/people/matt">` from this. 
More investigation needed.

Attempts to test the `webid.pem`, based on [this tutorial](https://github.com/dbpedia/webid#certificate-and-webid-validation-using-curl) have failed:
```
bombyx:~/SEA/gen-webid-cert$ curl -v -L --cert webid.pem https://webid.dbpedia.org/verify.php
*   Trying 95.216.13.238...
* TCP_NODELAY set
* Connected to webid.dbpedia.org (95.216.13.238) port 443 (#0)
* ALPN, offering http/1.1
* Cipher selection: ALL:!EXPORT:!EXPORT40:!EXPORT56:!aNULL:!LOW:!RC4:@STRENGTH
* successfully set certificate verify locations:
*   CAfile: /opt/local/share/curl/curl-ca-bundle.crt
  CApath: none
* TLSv1.2 (OUT), TLS header, Certificate Status (22):
* TLSv1.2 (OUT), TLS handshake, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Request CERT (13):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Certificate (11):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS handshake, CERT verify (15):
* TLSv1.2 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
* ALPN, server accepted to use http/1.1
* Server certificate:
*  subject: CN=webid.dbpedia.org
*  start date: Aug 22 13:38:38 2018 GMT
*  expire date: Nov 20 13:38:38 2018 GMT
*  subjectAltName: host "webid.dbpedia.org" matched cert's "webid.dbpedia.org"
*  issuer: C=US; O=Let's Encrypt; CN=Let's Encrypt Authority X3
*  SSL certificate verify ok.
> GET /verify.php HTTP/1.1
> Host: webid.dbpedia.org
> User-Agent: curl/7.61.1
> Accept: */*
> 
< HTTP/1.1 200 OK
< Date: Thu, 04 Oct 2018 08:54:02 GMT
< Server: Apache/2.4.29 (Ubuntu)
< Vary: Accept-Encoding
< Content-Length: 69
< Content-Type: text/html; charset=UTF-8
< 
Validating your WebId...[22] Client certificate SAN field is not set
* Connection #0 to host webid.dbpedia.org left intact
```

Needs investigation. Why does it say `Client certificate SAN field is not set` when SAN `SubjectAltName` is seen in the output of
```
bombyx:~/SEA/gen-webid-cert$ openssl x509 -in webid.pem -text
```

Testing using `http://id.myopenlink.net/ods/webid_demo.html` seems to have succeeded:

> Successfully located the Public Key associated with the agent identified by this certificate. The following information was obtained by de-referencing (looking-up) the WebID value of the certificate's Subject Alternative Name (SAN) field:

```
WebID - https://w3id.solidarityeconomy.coop/people/matt/profile#me
Public Key URI - No such info
Subject - /CN=WebID for Matt Wallis/UID=https://w3id.solidarityeconomy.coop/people/matt/profile#me
MD5 - FB:B3:17:72:69:C9:86:AB:F9:E1:2D:CF:1A:A9:7B:94
SHA1 - 9C:BB:FF:38:1A:10:44:49:3F:CD:6A:3A:2A:D1:3C:A2:C3:78:E1:90
Timestamp in ISO 8601 format - 2018-10-09T18:07:02.824340
Certificate WebID lookup (de-reference) completed in 1323 msec.
URI denoting Public Key (for Signature Verification) - http://id.myopenlink.net/issuer/key/dba/id_rsa
Server Public Key:
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuBJPs/ItWb5YHOIWvJBq
uBSXOggGF7PHgDbKVKIn/X3FXKra3WX1tATVl0mZSXU26QlOdJsovjCQWoU3TQAd
jnYU9fsaic9jHzJFAVWRKy+TNC2hl3Dc0Sw6Urfs5oioGRpxOnX34laLfAp0qeMq
um0tRtNY5coKmeDsY/2CeI1i5JBM4eVPWT4IoDcGQm76KHluzYIczuoPr1Gnj7yP
OBs/LlVjPHhMJqMcup/UAIYAS0fjSN46vao6o2LHMwHxSWFilTHm2SKGP4S/iBL+
PLBHA7wrS0P39qiLuFv+r0lY0M0gxGmlZZB88Kjt0s9nOSllPB1k2trYnJtDJGCK
OwIDAQAB
-----END PUBLIC KEY-----
```

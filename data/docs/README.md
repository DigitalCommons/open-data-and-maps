# Generating and deploying Linked Open Data

There are four main parts to generating Linked Open Data for SEA projects.

1. Converting data into standard format
2. Generating RDF/TTL/HTML files from the standard format
3. Deploying files to the server
4. Populating the triplestore

## Prerequisites

### Use a Unix/Linux environment (Mac, Ubuntu, etc)

Our processes heavily rely on [Gnu Make](https://www.gnu.org/software/make/) which requires a unix based operating system.

If you're running Windows 10 then [we recommend installing Ubuntu](https://www.microsoft.com/en-gb/p/ubuntu/9nblggh4msv6). Files on Windows can be accessed from within Ubuntu via the path `/mnt/c`

### Install required development tools

**macOS:**

1. Open **Terminal** (it is located in `Applications/Utilities`)
2. In the terminal window, run the command `xcode-select --install`
3. In the windows that pops up, click **Install**, and agree to the _Terms of Service_.

macOS is Unix based so it's similar to Linux. It doesn't, however, come with a package manager. There are two popular options, [Homebrew](https://brew.sh/) and [MacPorts](https://www.macports.org/). Both are great and will do what you need but what you use will come down to personal preference. Personally I chose Homebrew due to its ease of use.

To install Homebrew, run the command
`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

**Ubuntu:**

1. Run `sudo apt-get update` to make sure you have the most recent package version and dependency information
2. Run `sudo apt-get install build-essential patch ruby-dev zlib1g-dev liblzma-dev git`

### Install Ruby and required packages (Gems)

**macOS:**
macOS comes with Ruby preinstalled so you can skip this step – unless you want to install the latest stable version, in which case you can run the following:
`brew install ruby`

**Ubuntu:**

```
sudo apt-get install ruby
```

The Ruby scripts for generating RDF/TTL files rely on a package called `linkeddata` which in turn depends on an HTML, XML, SAX, and Reader parser called [Nokogiri](https://nokogiri.org/). The commands for installing these are the same for macOS and Ubuntu.

```
sudo gem install nokogiri
sudo gem install linkeddata
```

### Make a local clone the repository

To make a local clone of the repository, run the following command in your terminal:

```
git clone https://github.com/SolidarityEconomyAssociation/open-data-and-maps.git
```

Development work happens on the `development` branch, so run

```
cd open-data-and-maps
git checkout development
```

### Access to the server and Virtuoso

In order to deploy the files to the web server you will need SSH access to the server. This will require you to generate an SSH Key and have someone with server access add the public key to ~/.ssh/authorised_keys for each account you need access to.

If you already have access to the server, you can grant new machines access.

#### Generating SSH keys

To generate SSH keys, follow these steps:

In macOS, enter the following command in the Terminal window.

```
ssh-keygen -t rsa
```

In Ubuntu, enter the following command.

```
ssh-keygen
```

This starts the key generation process. When you execute this command, the ssh-keygen utility prompts you to indicate where to store the key.

Press the ENTER key to accept the default location. The ssh-keygen utility prompts you for a passphrase.

Type in a passphrase. You can also hit the ENTER key to accept the default (no passphrase). However, this is not recommended.
Warning! You will need to enter the passphrase a second time to continue.

After you confirm the passphrase, the system generates the key pair.

```
Your identification has been saved in /Users/myname/.ssh/id_rsa.
Your public key has been saved in /Users/myname/.ssh/id_rsa.pub.
The key fingerprint is:
ae:89:72:0b:85:da:5a:f4:7c:1f:c2:43:fd:c6:44:38 myname@mymac.local
The key's randomart image is:
+--[ RSA 2048]----+
|                 |
|         .       |
|        E .      |
|   .   . o       |
|  o . . S .      |
| + + o . +       |
|. + o = o +      |
| o...o * o       |
|.  oo.o .        |
+-----------------+
Your private key is saved to the id_rsa file in the .ssh directory and is used to verify the public key you use belongs to the same account.
```

⚠️ Never share your **private** key with anyone!

Your public key is saved to the id_rsa.pub;file and is the key you upload to your Triton Compute Service account.

On macOS, you can save this key to the clipboard by running this:

```
pbcopy < ~/.ssh/id_rsa.pub
```

On Ubuntu, you will need to `cat` the key and copy it manually:

```
cat ~/.ssh/id_rsa.pub
```

#### Authorising keys on the remote server

To be able to log into the remote server via `ssh` from a new machine, the machine needs to be whitelisted. This is done by adding the public key from the machine to a file called `authorized_keys` that's found in the .ssh folder in the home folder of the user account that you want access to (`/home/user/.ssh` or `~/.ssh` if you're currently logged in to that account).

Assuming you still have the public key copied to your clipboard, run the following on the remote server:

```
nano ~/.ssh/authorized_keys
```

And paste the public key on a new line at the end of the file. You can add a space and an identifier to the end of the key if you like (anything after the space is ignored and can be used as a note).

To be able to use the scripts in this document you'll need to do this on the accounts `joe` and `admin`.

On the machine you're running the scripts from, add the following to a file called `config` in your local `.ssh` folder.

```
nano ~/.ssh/config
```

```
Host sea-0-joe
 Hostname 51.15.116.30
 Port 22
 IdentityFile ~/.ssh/id_rsa
 HostbasedAuthentication yes
 PubkeyAuthentication yes
 PasswordAuthentication no
 User joe

Host sea-0-admin
 Hostname 51.15.116.30
 Port 22
 IdentityFile ~/.ssh/id_rsa
 HostbasedAuthentication yes
 PubkeyAuthentication yes
 PasswordAuthentication no
 User admin
```

A username and password will also be required to access Virtuoso Conductor (the triplestore). I've put this on the wiki.

## Converting data into standard format.

This process involves taking a source CSV (the data about initiatives that's collected by the mapping project coordinators) and converting it into a CSV that adheres to a standard format ([read a description of what's happening](#converting-the-data))

To start the process, navigate into the folder for the project you're working on:

```
cd data/[project_name]/[project_version]/
```

Place your original data in the folder name 'original-data' and follow the naming convention of the files in there. You'll now need to make a change to the csv.mk file before running it to make sure it knows to use the new source data.

Open the file in a text editor and look for the line (the start and end may be slightly different to this)

```
ORIGINAL_CSV := $(SRC_CSV_DIR)2019-09-17-original.csv
```

Change the text after `$(SRC_CSV_DIR)` to match the filename of your new source data. Save and close the file.

Now run the csv.mk Makefile

```
make -f csv.mk edition=experimental
```

The -f flag tells make you want it to run a named Makefile, in this case csv.mk. The editions=experimental variable provides us with a way to work in multiple environments depending on our needs. We might, for instance, want to try something new out without overwriting existing data. The options for each edition are stored in `editions/[name].mk`.

Once run, `standard.csv` will be placed in the `generated-data/[edition]/` folder and `initiatives.csv` and `report.csv` will be placed in `generated-data/[edition]/csv/`. `initiatives.csv` is used as an intermediate when generating `standard.csv`. `report.csv` will contain any notes generated in the process – these will appear in the final column alongside the initiative the note relates to.

In the case of an error, you will need to manually remove these files to run the Makefile again:

```
rm -rf generated-data/[edition]/csv
rm generated-data/[edition]/standard.csv
```

## Generate RDF/TTL/HTML files from standard CSV

The following step is to generate the RDF, TTL, HTML represetnations of the data. From the same location, run the following command:

```
make -f ../../tools/se_open_data/makefiles/generate.mk edition=experimental
```

The generated files will have been placed in the `generated-data/[edition]/www` folder. Like the CSV files, you may occasionally need to manually remove this folder to run the Makefile again.

## Deploy files to server

(Requires server access)

In order for the triplestore to be populated, the files need to be deployed to the webserver. To do this, run the command

```
make -f ../../tools/se_open_data/makefiles/deploy.mk edition=experimental --dry-run
```

Since running the script will delete live files, the `dry-run` flag allows you to make sure you're deploying to the correct location first. If you're happy, run the same script again without the `--dry-run` flag.

```
make -f ../../tools/se_open_data/makefiles/deploy.mk edition=experimental
```

## Generate graph and upload to triplestore

One the files are live, the triplestore needs to be populated. To do this, run the following command and look out for the message at the end - this is a multi-step process.

```
make -f ../../tools/se_open_data/makefiles/triplestore.mk edition=experimental
```

Once this is complete you should see the following message at the bottom of the output:

```
**** IMPORTANT! **** **** The final step is to load the data into Virtuoso with graph named https://w3id.solidarityeconomy.coop/sea-lod/[graph]/:
**** Execute the following command, providing the password for the Virtuoso dba user:
**** ssh sea-0-admin 'isql-vt localhost dba <password> /home/admin/Virtuoso/BulkLoading/Data/[some_numbers]/loaddata.sql'
```

Before you run the last command, you need to open up the [Graph view in Virtuoso Conductor](http://store1.solidarityeconomy.coop:8890/conductor/sparql_graph.vspx?sid=b1d624245c8092f7b246d8fa1da05743&realm=virtuoso_admin) (requires login) and remove the existing graph (beware - this is irreversible so make sure you remove the right one. The one you're looking for is listed in the message above after the text "\*\*\*\* The final step is to load the data into Virtuoso with graph named").

Once you've deleted the graph, come back to your command line, copy and paste the line starting `ssh sea-0-admin` from the message. Now replace ,password. with the virtuoso password and run the command.

```
ssh sea-0-admin 'isql-vt localhost dba <password> /home/admin/Virtuoso/BulkLoading/Data/[some_numbers]/loaddata.sql'
```

When this has finished, check that it has been added to the list of graphs in Virtuoso. Very occasionally it doesn't appear in the list and will need to be added again. In this situation, just run the last command in your terminal again.

## Further reading/explanations

### [Converting the data](#converting-the-data)

This standard format is defined in the module [SeOpenData::CSV::Standard::V1](../tools/se_open_data/csv/standard.rb). At the time of writing, this contains the following:

```
id: "Identifier",
name: "Name",
description: "Description",
organisational_structure: "Organisational Structure",
primary_activity: "Primary Activity",
activities: "Activities",
street_address: "Street Address",
locality: "Locality",
region: "Region",
postcode: "Postcode",
country_name: "Country Name",
homepage: "Website",
phone: "Phone",
email: "Email",
twitter: "Twitter",
facebook: "Facebook",
companies_house_number: "Companies House Number",
latitude: "Latitude",
longitude: "Longitude",
geocontainer: "Geo Container",
geocontainer_lat: "Geo Container Latitude",
geocontainer_lon: "Geo Container Longitude"
```

The text to the left of the colon is the key or symbol that's used to reference the values internally – we'll get back to this. The text to the right of the colon is the name that will be used for each field in the standard CSV that's generated. For example, the CSV headers will appear like this, with each of the initiative's Identifiers appearing on the Identifier column, names in the Name column and so on:

```
| Identifier | Name | Description | ... | Geo Container Latitude | Geo Container Longitude |
```

Within each project there is a script called `converter.rb`. These can be found in each of the `data/[project_name]/[project_version]/ folders.

`converter.rb` takes the values from the input CSV and pipes them into the output CSV. The data can either be passed straight through to the output or it can be processed before passing it on.

To pass the data through just assign the header name to the symbol from the standard. For instance, if the files that we want to use as the Identifier is in a field called ID in the source data then `InputHeaders` should contain a key of id (the symbol for Identifier in the output) with a value of ID (the header of the field containing the Identifier in the source). E.g.:

```
InputHeaders = {
id: "ID",
name: "Name",
description: "Description"
}
```

When the script is run, it will run through each row in the source CSV and place each item in the ID column in the Identifier column of the output, the Name fields in the Name output column and the Description fields in the Description column.

If we need to change any of the source data or process it in some other way – checking for validity for instance - then we can define a method with the same name as the symbol we want to populate. The output of the method will then be passed to the output. For instance, if we want to combine several fields from the input into one in the output we can use the following:

```
InputHeaders = {
id: "ID",
name: "Name",
description: "Description"

# ... Other headers

address1: "Address1",
address2: "Address2",
address3: "Address3"
}

def street_address
[
!address1.empty? ? address1 : nil,
!address2.empty? ? address2 : nil,
!address3.empty? ? address3 : nil
].compact.join(OutputStandard::SubFieldSeparator)
end
```

This method returns a string made up of the three fields address1, address2 and address3 (if they're populated). Each of these fields have been added to the InputHeader map so they can be referenced in the method.

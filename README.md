# Open Source Hollywood

* Build teams
* Manage projects
* Lease and donate assets
* Sell merch
* Tokenize projects
* Smart contracts

### How to use

#### Dependencies

- Meteor 1.3.2.4
- NodeJS 0.10

see https://github.com/meteor/meteor/issues/4526

If you have Meteor already installed you can use the `update` option of Meteor:

`meteor update --release 1.3.2.4`

Install dependencies

```
$ npm install
$ meteor npm install
$ # this one acts ephemeral
$ meteor npm install --save json-pretty-html
$ # run app
$ meteor run --settings settings.json
```

#### Configuration

You will need credentials for:
- Auth0
- AWS SES and S3 (r+w)
- Google Reverse Geolocation
- Stripe test credentials

The `lib` directory and `server/startup.js` make use of credentials. In particular, `lib` exports its own credentials for relative import to its subdirectories through its `util` file.

Credentials should be stored in `secrets.js` that you would create from the `tmp.secrets.js` file.

#### Meteor Settings

In Meteor there's a concept of the `settings.json` file, this project initially utilized this file for keeping secrets, and since moved to maintaining credentials from within the application.

However, this settings file is still used for PrerenderIO services, and remains active in the project

```
{
	"private":{
		"AUTH0_CLIENT_ID":"",
		"AUTH0_DOMAIN":"",
		"testSecretKey":"",
		"liveSecretKey":""
	},
	"public":{
		"stripe":{
			"testPublishableKey":"",
			"livePublishableKey":""
		}
	},
	"AWSAccessKeyId":"",
	"AWSSecretAccessKey":"",
	"PrerenderIO":{
		"token":""
	}
}
```

#### Localhost

To run the application, follow instructions from Meteor and make sure you're running the correct version

`$ meteor run --settings settings.json`

#### Deployment

To deploy the app, use Meteor's bundle system.

```
# meteor build . --architecture os.linux.x86_64
```

Transfer the bundle with `scp` or CICD. On the server side you'll need to install dependencies:

```
tar -xzf open_source_hollywood.tar.gz
cd bundle/programs/server
npm install
```

Configure your environment and include the `settings.json` file from above. Please use the paths appropriate for your environment, the paths below are meant only as examples for how to configure

```
$ cd /home/produsus/bundle
$ export PATH=/opt/local/bin:/opt/local/sbin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
$ export NODE_PATH=/usr/lib/nodejs:/usr/lib/node_modules:/usr/share/javascript
$ # set to home directory of the user Meteor will be running as
$ export PWD=/home/produsus
$ export HOME=/home/produsus
$ # leave as 127.0.0.1 for security
$ export BIND_IP=127.0.0.1
$ # the port nginx is proxying requests to
$ export PORT=8080
$ # this allows Meteor to figure out correct IP address of visitors
$ export HTTP_FORWARDED_COUNT=1
$ # MongoDB connection string using produsus as database name
export MONGO_URL=$URL_MONGO
$ # The domain name as configured previously as server_name in nginx
$ export ROOT_URL=$URL_APP
# # optional JSON config - the contents of file specified by passing "--settings" parameter to meteor command in development mode
$ export METEOR_SETTINGS=$SETTINGS
$ # this is optional: http://docs.meteor.com/#email
$ # commented out will default to no email being sent
$ # you must register with MailGun to have a username and password there
$ # export MAIL_URL=smtp://postmaster@mymetorapp.net:password123@smtp.mailgun.org
$ # alternatively install "apt-get install default-mta" and uncomment:
$ # export MAIL_URL=smtp://localhost
$ exec node bundle/main.js --settings settings.json >> logfile.log
```

#### Structure

<i>Models</i>
- find these in the `collections` directory

<i>Frontend + Templating + custom JS events / scripts</i>
- find these in the `client` directory

<i>Core Logic</i>
- find these in the `lib` directory

<i>Authentication + Permissions</i>
- find these in the `server` directory

<i>Core Logic</i>
- find these in the `lib` directory

#### API

* AUTHOR UPDATES 
> author adds public updates relating to a campaign

* FILTER 
> users can filter campaigns based on type and location

* DELETE NOTIFICATION 
> remove phone and/or email notification settings

* VERIFY PHONE SOURCE 
> 2-way authentication for phone notifications 

* VERIFY EMAIL SOURCE 
> 2-way authentication for email notifications 

* RE-VERIFY NOTIFICATION SOURCE 
> re-send verification for phone and/or email notification settings

* REAL-TIME NOTIFICATIONS 
> set phone and/or email notification settings
### notifies user when important events occur in real-time

* EDIT PROFILE 
> update personal information

* DEFAULT VIRTUAL ACCOUNT 
> users get assigned a virtual bank account by default

* ADD BANK INFO 
> user connects their real bank accounts to their virtual accounts

* REMOVE BANK INFO 
> remove link to real bank account

* CREATE CAMPAIGN
> author creates new campaign

* EDIT CAMPAIGN
> update campaign merchandise, roles, and settings

* VOTE UP 
> vote a campaign up, defines user behaviorally

* REMOVE VOTE UP
> remove a previous vote up to a campaign

* DONATION 
> campaign receives donations from the public

* LEND OFFER ASSET 
> offer from one user to a campaign to lend resources

* APPLY CREW & CAST 
> offer from one user to apply for a role on campaign

* BUY GIFT 
> merch sales

* ACCEPT USER TO PROJECT 
> author accepts user to a campaign

* REJECT USER FROM PROJECT 
> author declines user's offer to a campaign

* FINISH PROJECT 
> author marks campaign as ready for distribution

* ADD COMMENT 
> add comments to a campaign's page

* NEGOTIATION MESSAGE 
> adds a message from one user to another during negotiations of their role in a campaign

* TRANSFER FUNDS 
> on-demand transfer of any available funds to a user's real bank account

* FLAG MATERIAL 
> user determines the material should be removed or reviewed

* REVENUE SHARING - INITIAL PURCHASE 
> public sales of a portion of future earnings for a campaign

* ENTER NEGOTIATIONS WITH APPLICANT 
> author invites applicant to negotiate for role

* TOGGLE OFFER DURING NEGOTIATION 
> author can approve or deny individual role offers during negotiations

* ADD AUDITION URL 
> applicant shares audition materials with author

* UPDATE OFFER AGREEMENT 
> author changes terms of negotiated agreement

* LOCK AGREEMENT AND OFFER TO APPLICANT 
> author sends an agreement to applicant for review

* APPLICANT FORMAL OFFER 
> applicant agrees to offer, and makes formal offer with same terms to author

* APPLICANT COUNTER OFFER 
> applicant rejects offer, author is able to update terms

* AUTHOR ACCEPTS AGREEMENT 
> author makes final acceptance during negotiations


#### ISSUES

* This version of Uglify cannot parse ES6, it will throw you syntax errors on build. Requires post-processing on JS with Babel

As a workaround, disable minification
`$ meteor remove standard-minifier-js`


* There's too much "do everything" JS in client across domains that need to be converted to `Session.set|get` + Meteor's templating


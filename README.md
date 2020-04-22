# Open Source Hollywood

Description

### How to use

#### Dependencies

- Meteor 1.3.2.4

see https://github.com/meteor/meteor/issues/4526

If you have Meteor already installed you can use the `update` option of Meteor:

`meteor update --release 1.3.2.4`

#### Configuration

You will need credentials for:
- Auth0
- AWS SES and S3 (r+w)
- Google Reverse Geolocation
- Stripe test credentials
- Twilio test credentials

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

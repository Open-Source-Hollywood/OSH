// https://guide.meteor.com/v1.3/structure.html

// Date helper we'll be using
Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
// initialize client state
if (Meteor.isClient) {
  require('./initApp').init()
} /* isClient */

/* Meteor methods */
Meteor.methods({

    /*
        ACCOUNT
        =======
        relate to user preferences and details including profile
    */
    /** EDIT PROFILE */
    upgradeProfile: require('./account/edit'),
    /** CREATE EVENT */
    addEvent: require('./account/event'),
    /** ROUTE ON USER ROLES */
    homeRouter: require('./account/router'),
    /** ONBOARD CONFIG */
    userConfig: require('./account/config'),
    /** ONBOARD FINISH STATE */
    onboardNewUser: require('./account/onboard'),
    userBoardDidOnboard: require('./account/onboard'),

    /*
        ADMIN
        =====
        admin specific features such as blog posting
    */
    /** CRON 1 */
    projectsHousekeeping: require('./admin/cron'),
    /** CREATE BLOG */
    createBlog: require('./admin/blog'),
    /** FLAG MATERIAL */
    flagComplaint: require('./admin/flag'),

    /*
        CONTRACTS
        =========
        stakeholder offers and agreements
    */
    /** ENTER NEGOTIATIONS WITH APPLICANT */
    pokeApplicant: require('./contracts/poke'),
    /** REJECT USER FROM PROJECT */
    rejectUserFromProject: require('./contracts/reject'),
    /** ACCEPT STAKEHOLDER RELATIONSHIP */
    authorFinalizeAgreement: require('./contracts/accept'),
    /** COUNTER OFFER */
    counterRoleOffer: require('./contracts/counter'),
    /** ADD AUDITION URL */
    addAuditionURL:  require('./contracts/audition'),
    /** APPLICANT REJECTS COUNTER OFFER */
    applicantRejectOffer: require('./contracts/rejectCounterOffer'),
    /** APPLICANT FINALIZES AGREEMENT */
    applicantFinalizeAgreement: require('./contracts/accept'),
    revokeOffer: require('./contracts/revoke'),
    editExpressOffer: require('./contracts/edit'),

    /*
        FINANCE
        =======
        all financials including bank config, donations, subscriptions
    */
    /** DEFAULT VIRTUAL ACCOUNT */
    createBankingAccount: require('./finance/create'), 
    /** ADD BANK INFO */
    updateBanking: require('./finance/link'),
    /** REMOVE BANK INFO */
    deleteBanking: require('./finance/unlink'), 
    /** TRANSFER FUNDS */
    transferFunds: require('./finance/transfer'), 
    /** BLOCKCHAIN STAKEHOLDER for 3rd parties */
    buyShares: require('./finance/tokenize'),
    /** DONATION */
    donateToProject: require('./finance/donate'),
    /** CREATE SUBSCRIPTION */
    createSubscriptionDonation: require('./finance/subscriptionCreate'),
    /** CANCEL SUBSCRIPTION */
    cancelSubscription: require('./finance/subscriptionCancel'),

    /*
        GEOLOCATION
        ===========
        reverse geoid features for matching based on location
    */
    locationFromZip: require('./geolocation/reversegeo'),

    /*
        MERCHANDISE
        ===========
        user and project merchandise configs and sales
    */
    /** ADD USER MERCH */
    addPersonalMerch: require('./merchandise/userCreate'),
    /** BUY USER MERCH */
    purchaseGift: require('./merchandise/sellUser'),
    /** BUY PROJECT MERCH */
    userMerchSale: require('./merchandise/sellProject'),
    /** SELLER FULFILLS ORDER */
    markMerchFulfillment: require('./merchandise/fulfilled'),

    /*
        NOTIFICATIONS
        =============
        email and phone config + preferences
    */
    /** DELETE NOTIFICATION */
    removeNotificationRT: require('./notifications/remove'),
    /** VERIFY PHONE SOURCE */
    verifyPhonePIN: require('./notifications/verifyPhone'),
    /** RE-VERIFY NOTIFICATION SOURCE */
    resendVerification: require('./notifications/reverify'),
    /** REAL-TIME NOTIFICATIONS */
    setNotificationPreferences: require('./notifications/preferences'),
    /** SPLASH PAGE SUBSCRIBE EMAIL */
    subscribeEmail: require('./notifications/subscribe'),
    /** VISITOR CONTACT FORM */
    splashMessage: require('./notifications/contactus'),

    /*
        PROJECTS
        ========
        create, edit, manage projects
    */
    /** APPLY CREW & CAST */
    applyToProject: require('./projects/apply'),
    /** CREATE PROJECT */
    addProject: require('./projects/new'),
    /** EDIT PROJECT */
    editProject: require('./projects/edit'),
    /** VOTE UP */
    upvoteProject: require('./projects/upvote'),
    /** VOTE DOWN */
    downvoteProject: require('./projects/downvote'),
    /** AUTHOR UPDATES */
    projectUpdateText: require('./projects/text'),
    /** FINISH PROJECT */
    closeProject: require('./projects/close'),
    /** ADD COMMENT */
    addProjectComment: require('./projects/comment'),
    /** ADD MESSAGE */
    addProjectMessage: require('./projects/announce'),

    /*
        SERVICES
        ========
        asset leases and user services for hire
    */
    /** LEND OFFER ASSET */
    lendResource: require('./services/assetOffer'),
    offerProjectAsset: require('./services/assetRequest'),
    addOfferMessage: require('./services/message'),
    acceptAssetsOffer: require('./services/assetAccept'),
    rejectAssetsOffer: require('./services/assetReject'),
    leaseRequest: require('./services/leaseRequest'),
    directLeaseOffer: require('./services/leaseOffer'),
    revokeLeaseRequest: require('./services/leaseRevoke'),
    rejectLeaseRequest: require('./services/leaseReject'),
    approveLeaseRequest: require('./services/leaseAccept'),



    
}); 


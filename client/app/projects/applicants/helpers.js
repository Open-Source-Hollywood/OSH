Template.applicants.helpers({

  aaa: function() {
    // console.log(this)
  },
  activeOffers: function() {
    return this.assetOffers.filter(function(o) {
      if (!o.rejected&&!o.approved) return o;
    })
  },
  assetsConsolidated: function() {
    return {
      cat: this.assets[0].category,
      names: this.assets.map(function(a) {
        return a.name
      }).join(', '),
      express: this.expressOffer.offer ? true : false
    }
  },
  fulfilled: function() {
    if (this.fulfilled) return true;
    return false
  },
  giftTotals: function() {
    var totalAmount = 0
    var purchases = this.purchases()
    for (var i = 0; i < purchases.length; i++) {
      var p = purchases[i]
      if (p.purpose==='gift purchase') totalAmount += parseFloat(p.amount)
    };

    return totalAmount
  },
  orderDate: function() {
    return new Date(this.created).toDateString()
  },
  isWidth: function() {
    return $(window).width() >= 770;
  },
  anon: function() {
    return this.user.id==='anon';
  },
  currentSlug: function() {
    return currentSlug
  },
  appliedFor: function() {
    return appliedFor;
  },
  applicants: function() {
    return uniqueApplicantsFromProject('roleApplicants', this.project)
  },
  hasApplicant: function() {
    var lnRoles = this.project&&this.project.roleApplicants&&this.project.roleApplicants.length||0
    var lnCrew = this.project&&this.project.crewApplicants&&this.project.crewApplicants.length||0
    return (lnRoles + lnCrew) > 0
  }
})
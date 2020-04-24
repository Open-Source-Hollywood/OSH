Template.setLanguagePopup.helpers({
    languages: function() {
        return _.map(TAPi18n.getLanguages(), function(lang, tag) {
            return {
                tag: tag,
                name: lang.name
            };
        });
    },
    isCurrentLanguage: function() {
        return this.tag === TAPi18n.getLanguage();
    }
});
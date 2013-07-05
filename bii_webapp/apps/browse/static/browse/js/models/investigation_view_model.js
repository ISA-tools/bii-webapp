/**
 * Sets the size of the vertical investigation title
 * once it knows how many studies it contains.
 */
$(document).ready(function () {
    var investigation=vars.investigation;
    investigation.i_pubs_model=new PublicationModel(investigation.i_publications);
    investigation.i_contacts_model=new ContactModel(investigation.i_contacts);
    delete investigation['i_publications'];
    delete investigation['i_contacts'];

    viewModel = new InvestigationModel(investigation);
    ko.applyBindings(viewModel);

    // Activate jQuery Validation
    $("#createISAForm").validate({ submitHandler: viewModel.save });

    $(".study").each(function (index) {
        var elheight=$(this).outerHeight();
        $(this).children('.study_id').height(elheight);
        $(this).children('.study_id').css('line-height',elheight+'px');
    });
});

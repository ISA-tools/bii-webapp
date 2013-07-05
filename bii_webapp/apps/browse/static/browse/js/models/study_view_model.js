/**
 * Sets the size of the vertical investigation title
 * once it knows how many studies it contains.
 */
$(document).ready(function () {
    var study=vars.study;
    study.s_id=ko.observable(study.s_id)
    study.s_pubs_model=new PublicationModel(study.s_publications);
    study.s_contacts_model=new ContactModel(study.s_contacts);
    study.s_factors_model=new StudyFactorModel(study.s_factors);
    study.s_protocols_model=new StudyProtocolModel(study.s_protocols);
    study.s_assays_model=new StudyAssayModel(study.s_id,study.s_assays);
    delete study['s_publications'];
    delete study['s_contacts'];
    delete study['s_factors'];
    delete study['s_protocols'];
    delete study['s_assays'];

    viewModel = new StudyModel([study]);
    ko.applyBindings(viewModel);

    // Activate jQuery Validation
    $("#createISAForm").validate({ submitHandler: viewModel.save });

});

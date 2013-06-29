/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */
var viewModel;
$(document).ready(function () {
    viewModel = new StudyModel(vars.study);
    ko.applyBindings(viewModel);

    // Activate jQuery Validation
    $("#createISAForm").validate({ submitHandler: viewModel.save });
});
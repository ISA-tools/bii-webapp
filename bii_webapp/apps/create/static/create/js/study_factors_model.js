/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */

var StudyFactorModel;
$(document).ready(function () {

    StudyFactorModel = function (factors) {
        if(!factors)
            factors=[{
                s_factor_name: "",
                s_factor_type: ""
            }]

        var self = this;
        self.factors = ko.observableArray(factors);

        self.addFactor = function () {
            self.factors.push({
                s_factor_name: "",
                s_factor_type: ""
            });
        };

        self.removeFactor = function (factor) {
            self.factors.remove(factor);
        };

        self.toJSON=function(){
            var factors=[];
            for (var i = 0; i < self.factors().length; i++) {
                var factor = {
                    s_factor_name: self.factors()[i].s_factor_name,
                    s_factor_type: self.factors()[i].s_factor_type
                }
                factors.push(factor);
            }
            return{
                factors:factors
            }
        }
    };

});
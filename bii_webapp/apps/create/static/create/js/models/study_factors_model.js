/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */


var StudyFactorModel = function (factors) {
    if (!factors)
        factors = [
            {
               factor_name: "",
               factor_type: ""
            }
        ]

    var self = this;
    self.factors = ko.observableArray(factors);

    self.addFactor = function () {
        self.factors.push({
           factor_name: "",
           factor_type: ""
        });
    };

    self.removeFactor = function (factor) {
        var index = self.factors.indexOf(factor);
        if (index != self.factors().length - 1) {
            var factors = [];
            for (var i = 0; i < self.factors().length; i++) {
                if (i != index) {
                    factors.push(self.factors()[i]);
                }
            }
            factors.push(self.factors()[index]);
            self.factors(factors);
        }
        self.factors.remove(factor);
    };

    self.toJSON = function () {
        var factors = [];
        for (var i = 0; i < self.factors().length; i++) {
            var factor = {
               factor_name: self.factors()[i].factor_name,
               factor_type: self.factors()[i].factor_type
            }
            factors.push(factor);
        }
        return{
            factors: factors
        }
    }
};

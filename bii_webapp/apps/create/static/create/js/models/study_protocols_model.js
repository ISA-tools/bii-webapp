/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */


var StudyProtocolModel = function (protocols) {
    if (!protocols)
        protocols = [
            {
                protocol_name: "",
                protocol_type: "",
                protocol_description: "",
                protocol_uri: "",
                protocol_version: "",
                protocol_parameters_name: "",
                protocol_components_name: "",
                protocol_components_type: ""
            }
        ]

    var self = this;
    self.protocols = ko.observableArray(protocols);

    self.addProtocol = function () {
        self.protocols.push({
            protocol_name: "",
            protocol_type: "",
            protocol_description: "",
            protocol_uri: "",
            protocol_version: "",
            protocol_parameters_name: "",
            protocol_components_name: "",
            protocol_components_type: ""
        });
    };

    self.removeProtocol = function (protocol) {
        var index = self.protocols.indexOf(protocol);
        if (index != self.protocols().length - 1) {
            var protocols = [];
            for (var i = 0; i < self.protocols().length; i++) {
                if (i != index) {
                    protocols.push(self.protocols()[i]);
                }
            }
            protocols.push(self.protocols()[index]);
            self.protocols(protocols);
        }
        self.protocols.remove(protocol);
    };

    self.toJSON = function () {
        var protocols = [];
        for (var i = 0; i < self.protocols().length; i++) {
            var protocol = {
                protocol_name: self.protocols()[i].protocol_name,
                protocol_type: self.protocols()[i].protocol_type,
                protocol_description: self.protocols()[i].protocol_description,
                protocol_uri: self.protocols()[i].protocol_uri,
                protocol_version: self.protocols()[i].protocol_version,
                protocol_parameters_name: self.protocols()[i].protocol_parameters_name,
                protocol_components_name: self.protocols()[i].protocol_components_name,
                protocol_components_type: self.protocols()[i].protocol_components_type
            }
            protocols.push(protocol);
        }
        return{
            protocols: protocols
        }
    }
};

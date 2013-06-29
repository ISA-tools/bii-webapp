/**
 * Created with IntelliJ IDEA.
 * User: Pavlos
 * Date: 6/22/13
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */

var StudyProtocolModel;
$(document).ready(function () {

    StudyProtocolModel = function (protocols) {
        if(!protocols)
            protocols=[{
                s_protocol_name: "",
                s_protocol_type: "",
                s_protocol_description: "",
                s_protocol_uri: "",
                s_protocol_version: "",
                s_protocol_parameters_name:"",
                s_protocol_components_name:"",
                s_protocol_components_type:""
            }]

        var self = this;
        self.protocols = ko.observableArray(protocols);

        self.addProtocol = function () {
            self.protocols.push({
                s_protocol_name: "",
                s_protocol_type: "",
                s_protocol_description: "",
                s_protocol_uri: "",
                s_protocol_version: "",
                s_protocol_parameters_name:"",
                s_protocol_components_name:"",
                s_protocol_components_type:""
            });
        };

        self.removeProtocol = function (protocol) {
            self.protocols.remove(protocol);
        };

        self.toJSON=function(){
            var protocols=[];
            for (var i = 0; i < self.protocols().length; i++) {
                var protocol = {
                    s_protocol_name: self.protocols()[i].s_protocol_name,
                    s_protocol_type: self.protocols()[i].s_protocol_type,
                    s_protocol_description: self.protocols()[i].s_protocol_description,
                    s_protocol_uri: self.protocols()[i].s_protocol_uri,
                    s_protocol_version: self.protocols()[i].s_protocol_version,
                    s_protocol_parameters_name: self.protocols()[i].s_protocol_parameters_name,
                    s_protocol_components_name: self.protocols()[i].s_protocol_components_name,
                    s_protocol_components_type: self.protocols()[i].s_protocol_components_type
                }
                protocols.push(protocol);
            }
            return{
                protocols:protocols
            }
        }
    };

});
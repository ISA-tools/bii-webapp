sites = Array("http://bii.heroku.com","http://bii-test.heroku.com","http://bii-ws.heroku.com","http://bii-test-ws.heroku.com")

For Each site In sites

    Set Http = WScript.CreateObject("MSXML2.ServerXMLHTTP") 
    Http.Open "GET", site, False
    Http.Send

    'If(Http.Status <> 200) Then 'site isn't 200
     '       MsgBox "The site at " & vbNewLine & site & vbNewLine & "has status: " & Http.Status
    'End If
Next

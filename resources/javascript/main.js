
var jpdbBaseUrl = "http://api.login2explore.com:5577"
var jpdbIML = "/api/iml"
var jpdbIRL = "/api/irl"
var conToken = "90932051|-31949220122139629|90962342"
var ShipDB = "ShipmentDB"
var ShipRel = "Ship-Relation"

function resetForm(){
    $('#shipno').val('') 
    $('#source').val('') 
    $('#dest').val('') 
    $('#desc').val('') 
    $('#shipdate').val('') 
    $('#deldate').val('') 
    $('#gridCheck').val(false)
    $('#shipno').prop('disabled',false) 
    $('#save').prop('disabled',true) 
    $('#change').prop('disabled',true) 
    $('#reset').prop('disabled',true) 
    
    $('#shipno').focus();
}

function saveToLocalStore(jsonObj){
    var data = JSON.parse(jsonObj.data)
    localStorage.setItem('rec',data.rec_no)
}

function getshipidAsJsonObj(){
    var sid = $('#shipno').val()
    var jsonStr = {
        shipno:sid
    }
    return JSON.stringify(jsonStr)
}

function fillData(jsonObj){
    saveToLocalStore(jsonObj)
    var data = JSON.parse(jsonObj.data).record;
    $('#shipno').val(data.shipno) 
    $('#source').val(data.source) 
    $('#dest').val(data.destination) 
    $('#desc').val(data.description) 
    $('#shipdate').val(data.shipment_date) 
    $('#deldate').val(data.Exp_del_date) 

}
function checkShipNo(){
    var sid = getshipidAsJsonObj()
    var getreq = createGET_BY_KEYRequest(conToken,ShipDB,ShipRel,sid)
    $.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getreq,jpdbBaseUrl,jpdbIRL)
    $.ajaxSetup({async:true});

    if(resJsonObj.status === 400){
        $('#save').prop('disabled',false)
        $('#reset').prop('disabled',false)
        $('#source').focus()
    }
    else if(resJsonObj.status === 200){
        $('#shipno').prop('disabled',true)
        fillData(resJsonObj)
        $('#change').prop('disabled',false)
        $('#reset').prop('disabled',false)
        $('#source').focus()
    }
}

function validateData(){
    var shipno,source,dest,desc,shipdate,deldate,gridcheck
    shipno = $('#shipno').val()
    source = $('#source').val()
    dest = $('#dest').val()
    desc = $('#desc').val()
    shipdate = $('#shipdate').val()
    deldate = $('#deldate').val()
    gridcheck  = document.getElementById('gridCheck');

    if(shipno === ""){
        alert("please provide shipment no")
        $('#shipno').focus()
        return "";
    }
    if(source === ""){
        alert("please provide source")
        $('#source').focus()
        return "";
    }
    if(dest === ""){
        alert("please provide destination")
        $('#dest').focus()
        return "";
    }
    if(desc === ""){
        alert("please provide description")
        $('#desc').focus()
        return "";
    }
    if(shipdate === ""){
        alert("please provide shipment date")
        $('#shipdate').focus()
        return "";
    }
    if(deldate === ""){
        alert("please provide Expected delivery date")
        $('#deldate').focus()
        return "";
    }
    if(!gridcheck.checked){
        alert("please check the box and confirm shipment")
        $('#gridCheck').focus()
        return "";
    }
    

    jsonObj = {
        shipno:shipno,
        source:source,
        destination:dest,
        description:desc,
        shipment_date:shipdate,
        Exp_del_date:deldate
    }
    return JSON.stringify(jsonObj)
}

function saveData(){
    jsonStr = validateData();
    if(jsonStr===""){
        return 
    }

    var putreq = createPUTRequest(conToken,jsonStr,ShipDB,ShipRel);
    $.ajaxSetup({async:false});
    var resjsonobj = executeCommandAtGivenBaseUrl(putreq,jpdbBaseUrl,jpdbIML)
    $.ajaxSetup({async:true});
    resetForm()
    $("#shipno").focus()
}
function changeData(){
    var jsonchange = validateData()
    if(jsonchange===""){
        return 
    }
    var updreq = createUPDATERecordRequest(conToken,jsonchange,ShipDB,ShipRel,localStorage.getItem('rec'))
    $.ajaxSetup({async:false});
    var resjsonobj = executeCommandAtGivenBaseUrl(updreq,jpdbBaseUrl,jpdbIML)
    $.ajaxSetup({async:true});
    resetForm()
    $('#change').prop('disabled',true)
    $('#reset').prop('disabled',true)
    $("#shipno").focus()
}

$(document).ready(function () {
    $("#tableSearch").hide();
    table = null;
    table1 = null;

    otherEvents(new Date().getMonth());



    $('#search_box').keyup(function(){
        var searchStr = $(this).val();
            if(table != null){
                table.destroy();
                table = null;
            }  else {
                $("#tableSearch").show();
            }
             customEvent(searchStr);   // call the filter function with required parameters

    });





});





function customEvent(searchStr) {
    table =  $('#dtBasicExampleSearch').DataTable({
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "oSearch": {"sSearch": searchStr, bSmart: true},
        "serverSide": true,
        'ajax': {
            'type': 'GET',
            'url': urlFinal+'allBirthdays/getDataSearch',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].birthdayName);
                    json.data[i].birthdayOptions= '&nbsp; &nbsp; &nbsp; &nbsp;<a href="/viewBirthday?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="View" ><i class="glyphicon glyphicon-eye-open" ></i></a>' ;
                }
                console.log(json);
                return json.data;
            }
        },
        'columns':
            [
                {'data': 'name', "defaultContent": "N", 'name': 'Name'},
                {'data': 'sn', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'dob', "defaultContent": "N", 'name': 'Birthday'},
                {'data': 'house', "defaultContent": "N", 'name': 'House'},
                {'data': 'options', "defaultContent": 'N', 'name': 'View and Comment'}
            ],

    });
    $('.dataTables_length').addClass('bs-select');

}

function otherEvents(month) {
    console.log('otherr btroo!!')

    table1 =  $('#dtBasicExample1').DataTable({
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        'ajax': {
            'type': 'GET',
            'url': urlFinal+'allBirthdays/getData1?month='+month,
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                   json.data[i].options= '&nbsp; &nbsp; &nbsp; &nbsp;<a href="/viewBirthday?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="View" ><i class="glyphicon glyphicon-eye-open" ></i></a>' +
                        '                                                            &nbsp; ' ;
                    // '                                                            <a href="/editEvent?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="Edit" ><i class="fa fa-pencil" ></i></a>' +
                    // '                                                            &nbsp; &nbsp; &nbsp;' +
                    // '                                                            <a href="/allevents/delete?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="Delete" ><i class="fa fa-trash" ></i></a>';

                }
                console.log(json);
                return json.data;
            }
        },
        'columns':
            [
                    {'data': 'name', "defaultContent": "N", 'name': 'Name'},
                {'data': 'sn', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'dob', "defaultContent": "N", 'name': 'Birthday'},
                {'data': 'house', "defaultContent": "N", 'name': 'House'},
                {'data': 'options', "defaultContent": 'N', 'name': 'View and Comment'}
            ],

    });
    $('.dataTables_length').addClass('bs-select');
}

function monthChange(forMonth){
    table1.destroy();
    otherEvents(forMonth);
}

// function destroyOther() {
//     table1.destroy();
//
// }

function destroySearch() {
    $("#tableSearch").hide();
    if(table!= null){
        table.destroy();
        table = null;
    }
}

$(document).ready(function () {
    table = null;
    otherEvents();


});


function checkMyOther() {
    if (document.getElementById('myOther').checked)
    {
        table.destroy();
        myEvents();
    } else {
        table.destroy();
        otherEvents();
    }

}

function myEvents() {
    table =  $('#dtBasicExample').DataTable({
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        'ajax': {
            'type': 'GET',
            'url': urlFinal+'allAchievers/getMyData',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].achieverName);
                    json.data[i].achieverOptions= '<a href="/viewAchiever?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="View" ><i class="glyphicon glyphicon-eye-open" ></i></a>' +
                        '                                                            &nbsp; ' +
                        '                                                            <a href="/editAchiever?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="Edit" ><i class="fa fa-pencil" ></i></a>' +
                        '                                                            &nbsp;' +
                        '                                                            <a href="/allAchievers/delete?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="Delete" ><i class="fa fa-trash" ></i></a>';

                }
                console.log(json);
                return json.data;
            }
        },
        'columns':
            [
                {'data': 'achieverName', "defaultContent": "N", 'name': 'Achiever Name'},
                {'data': 'achieverSchoolNo', "defaultContent": "N", 'name': 'School Number'},

                {'data': 'achieverBackground', "defaultContent": "N", 'name': 'Background'},

                {'data': 'achieverOptions', "defaultContent": 'N', 'name': 'Options'},
                {'data': 'achieverStatus', "defaultContent": "N", 'name': 'Status'}
            ],

    });
    $('.dataTables_length').addClass('bs-select');
}

function otherEvents() {

    table =  $('#dtBasicExample').DataTable({
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        'ajax': {
            'type': 'GET',
            'url': urlFinal+'allAchievers/getData',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].achieverName);
                    json.data[i].achieverOptions= '&nbsp; &nbsp; &nbsp; &nbsp;<a href="/viewAchiever?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="View" ><i class="glyphicon glyphicon-eye-open" ></i></a>' +
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
                {'data': 'achieverName', "defaultContent": "N", 'name': 'Achiever Name'},
                {'data': 'achieverSchoolNo', "defaultContent": "N", 'name': 'School Number'},

                {'data': 'achieverBackground', "defaultContent": "N", 'name': 'Background'},

                {'data': 'achieverOptions', "defaultContent": 'N', 'name': 'Options'},
                {'data': 'achieverStatus', "defaultContent": "N", 'name': 'Status'}
            ],

    });
    $('.dataTables_length').addClass('bs-select');
}
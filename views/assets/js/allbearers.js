
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
            'url': urlFinal+'allBearers/getMyData',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].bearerName);
                    json.data[i].bearerOptions= '<a href="/viewBearer?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="View" ><i class="glyphicon glyphicon-eye-open" ></i></a>' +
                        '                                                            &nbsp; ' +
                        '                                                            <a href="/editBearer?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="Edit" ><i class="fa fa-pencil" ></i></a>' +
                        '                                                            &nbsp;' +
                        '                                                            <a href="/allBearers/delete?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="Delete" ><i class="fa fa-trash" ></i></a>';

                }
                console.log(json);
                return json.data;
            }
        },
        'columns':
            [
                {'data': 'bearerPost', "defaultContent": "N", 'name': 'Bearer Post'},
                {'data': 'bearerName', "defaultContent": "N", 'name': 'Bearer Name'},
                {'data': 'bearerSchoolNo', "defaultContent": "N", 'name': 'School No.'},
                {'data': 'bearerFromDate', "defaultContent": "N", 'name': 'From'},
                {'data': 'bearerToDate', "defaultContent": "N", 'name': 'To'},
                {'data': 'bearerBackground', "defaultContent": "N", 'name': 'Background'},
                {'data': 'bearerRank', "defaultContent": "None", 'name': 'Rank'},
                {'data': 'bearerOptions', "defaultContent": 'N', 'name': 'Options'},
                {'data': 'bearerStatus', "defaultContent": "N", 'name': 'Status'}
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
            'url': urlFinal+'allBearers/getData',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].bearerName);
                    json.data[i].bearerOptions= '&nbsp; &nbsp; &nbsp; &nbsp;<a href="/viewBearer?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="View" ><i class="glyphicon glyphicon-eye-open" ></i></a>' +
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
                {'data': 'bearerPost', "defaultContent": "N", 'name': 'Bearer Post'},
                {'data': 'bearerName', "defaultContent": "N", 'name': 'Bearer Name'},
                {'data': 'bearerSchoolNo', "defaultContent": "N", 'name': 'School No.'},
                {'data': 'bearerFromDate', "defaultContent": "N", 'name': 'From'},
                {'data': 'bearerToDate', "defaultContent": "N", 'name': 'To'},
                {'data': 'bearerBackground', "defaultContent": "N", 'name': 'Background'},
                {'data': 'bearerRank', "defaultContent": "None", 'name': 'Rank'},
                {'data': 'bearerOptions', "defaultContent": 'N', 'name': 'Options'},
                {'data': 'bearerStatus', "defaultContent": "N", 'name': 'Status'}
            ],

    });
    $('.dataTables_length').addClass('bs-select');
}
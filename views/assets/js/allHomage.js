
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
            'url': urlFinal+'allHomage/getMyData',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].homageName);
                    json.data[i].homageOptions= '<a href="/viewHomage?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="View" ><i class="glyphicon glyphicon-eye-open" ></i></a>' +
                        '                                                            &nbsp; ' +
                        '                                                            <a href="/editHomage?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="Edit" ><i class="fa fa-pencil" ></i></a>' +
                        '                                                            &nbsp;' +
                        '                                                            <a href="/allHomage/delete?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="Delete" ><i class="fa fa-trash" ></i></a>';

                }
                console.log(json);
                return json.data;
            }
        },
        'columns':
            [
                {'data': 'homageName', "defaultContent": "N", 'name': 'Homage Name'},
                {'data': 'homageSchoolNo', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'homageDate', "defaultContent": "N", 'name': 'Died on Date'},
                {'data': 'homageBackground', "defaultContent": "N", 'name': 'Background'},
                {'data': 'homageRank', "defaultContent": "N", 'name': 'Rank'},
                {'data': 'homageOptions', "defaultContent": 'N', 'name': 'Options'},
                {'data': 'homageStatus', "defaultContent": "N", 'name': 'Status'}
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
            'url': urlFinal+'allHomage/getData',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].homageName);
                    json.data[i].homageOptions= '&nbsp; &nbsp; &nbsp; &nbsp;<a href="/viewHomage?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="View" ><i class="glyphicon glyphicon-eye-open" ></i></a>' +
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
                {'data': 'homageName', "defaultContent": "N", 'name': 'Homage Name'},
                {'data': 'homageSchoolNo', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'homageDate', "defaultContent": "N", 'name': 'Died on Date'},
                {'data': 'homageBackground', "defaultContent": "N", 'name': 'Background'},
                {'data': 'homageRank', "defaultContent": "None", 'name': 'Rank'},
                {'data': 'homageOptions', "defaultContent": 'N', 'name': 'Options'},
                {'data': 'homageStatus', "defaultContent": "N", 'name': 'Status'}
            ],

    });
    $('.dataTables_length').addClass('bs-select');
}

$(document).ready(function () {
    console.log("yoo")
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
            'url': urlFinal+'allMartyrs/getMyData',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    // console.log(json.data[i].homageName);
                    json.data[i].martyrOptions= '<a href="/viewMartyr?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="View" ><i class="glyphicon glyphicon-eye-open" ></i></a>' +
                        '                                                            &nbsp; ' +
                        '                                                            <a href="/editMartyr?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="Edit" ><i class="fa fa-pencil" ></i></a>' +
                        '                                                            &nbsp;' +
                        '                                                            <a href="/allMartyrs/delete?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="Delete" ><i class="fa fa-trash" ></i></a>';

                }
                console.log(json);
                return json.data;
            }
        },
        'columns':
            [
                {'data': 'martyrName', "defaultContent": "N", 'name': 'Name'},
                {'data': 'martyrSchoolNo', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'martyrDate', "defaultContent": "N", 'name': 'Died on Date'},
                {'data': 'martyrCitation', "defaultContent": "N", 'name': 'Citation'},
                {'data': 'martyrRank', "defaultContent": "N", 'name': 'Rank'},
                {'data': 'martyrOptions', "defaultContent": 'N', 'name': 'Options'},
                {'data': 'martyrStatus', "defaultContent": "N", 'name': 'Status'}
            ],

    });
    $('.dataTables_length').addClass('bs-select');
}

function otherEvents() {
console.log('yoo')
    table =  $('#dtBasicExample').DataTable({
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        'ajax': {
            'type': 'GET',
            'url': urlFinal+'allMartyrs/getData',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].martyrName);
                    json.data[i].martyrOptions= '&nbsp; &nbsp; &nbsp; &nbsp;<a href="/viewMartyr?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="View" ><i class="glyphicon glyphicon-eye-open" ></i></a>' +
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
                {'data': 'martyrName', "defaultContent": "N", 'name': 'Name'},
                {'data': 'martyrSchoolNo', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'martyrDate', "defaultContent": "N", 'name': 'Died on Date'},
                {'data': 'martyrCitation', "defaultContent": "N", 'name': 'Citation'},
                {'data': 'martyrRank', "defaultContent": "N", 'name': 'Rank'},
                {'data': 'martyrOptions', "defaultContent": 'N', 'name': 'Options'},
                {'data': 'martyrStatus', "defaultContent": "N", 'name': 'Status'}
            ],

    });
    $('.dataTables_length').addClass('bs-select');
}
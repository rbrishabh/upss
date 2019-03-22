
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
            'url': urlFinal+'allEvents/getMyData',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].eventName);
                    json.data[i].eventOptions= '<a href="/viewEvent?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="View" ><i class="glyphicon glyphicon-eye-open" ></i></a>' +
                        '                                                            &nbsp; ' +
                        '                                                            <a href="/editEvent?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="Edit" ><i class="fa fa-pencil" ></i></a>' +
                        '                                                            &nbsp;' +
                        '                                                            <a href="/allevents/delete?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="Delete" ><i class="fa fa-trash" ></i></a>';

                }
                console.log(json);
                return json.data;
            }
        },
        'columns':
            [
                {'data': 'eventName', "defaultContent": "N", 'name': 'Event Name'},
                {'data': 'eventDate', "defaultContent": "N", 'name': 'Date'},
                {'data': 'eventOrganizer', "defaultContent": "N", 'name': 'Organizer'},
                {'data': 'eventRepeatFreq', "defaultContent": "N", 'name': 'Repeat'},
                {'data': 'eventLocation', "defaultContent": "N", 'name': 'Location'},
                {'data': 'eventOptions', "defaultContent": 'N', 'name': 'Options'},
                {'data': 'eventStatus', "defaultContent": "N", 'name': 'Status'}
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
            'url': urlFinal+'allEvents/getData',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].eventName);
                    json.data[i].eventOptions= '&nbsp; &nbsp; &nbsp; &nbsp;<a href="/viewEvent?id=' + json.data[i]._id + '" class=""  data-toggle="tooltip" data-placement="top" title="View" ><i class="glyphicon glyphicon-eye-open" ></i></a>' +
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
                {'data': 'eventName', "defaultContent": "N", 'name': 'Event Name'},
                {'data': 'eventDate', "defaultContent": "N", 'name': 'Date'},
                {'data': 'eventOrganizer', "defaultContent": "N", 'name': 'Organizer'},
                {'data': 'eventRepeatFreq', "defaultContent": "N", 'name': 'Repeat'},
                {'data': 'eventLocation', "defaultContent": "N", 'name': 'Location'},
                {'data': 'eventOptions', "defaultContent": 'N', 'name': 'Options'},
                {'data': 'eventStatus', "defaultContent": "N", 'name': 'Status'}
            ],

    });
    $('.dataTables_length').addClass('bs-select');
}
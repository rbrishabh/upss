i = 0;
len = 0;
str = "";

$(document).ready(function () {
    $("#tableSearch").hide();
    table = null;
    table1 = null;
    table2 = null;
    table3 = null;
    table4 = null;
    table5 = null;
    table6 = null;
    table7 = null;
    table8 = null;
    table9 = null;
    table10 = null;
    table11 = null;
    table12 = null;
    otherEvents();

    $('#search_box').keyup(function(){
        var searchStr = $(this).val();
        if(str!==searchStr){
            str = searchStr;
            if(i>0){
                table.destroy();
                i=0;
            }
            if((searchStr).length)
            {
                i++;
                $("#tablesBirthday").hide();
                $("#tableSearch").show();
                if(len == 0){
                    table1.destroy();
                    table2.destroy();
                    table3.destroy();
                    table4.destroy();
                    table5.destroy();
                    table6.destroy();
                    table7.destroy();
                    table8.destroy();
                    table9.destroy();
                    table10.destroy();
                    table11.destroy();
                    table12.destroy();
                }

                len++;
                customEvent(searchStr);   // call the filter function with required parameters
            }
            else
            {

                $("#tableSearch").hide();
                $("#tablesBirthday").show();
                len = 0;
                otherEvents();
            }
        }

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
                {'data': 'SchoolNumber', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'birthDate', "defaultContent": "N", 'name': 'Birthday'},
                {'data': 'background', "defaultContent": "N", 'name': 'Background'},
                {'data': 'rank', "defaultContent": "None", 'name': 'Rank'},
                {'data': 'options', "defaultContent": 'N', 'name': 'Options'}
            ],

    });
    $('.dataTables_length').addClass('bs-select');

}

function otherEvents() {
    console.log('otherr btroo!!')

    table1 =  $('#dtBasicExample1').DataTable({
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        'ajax': {
            'type': 'GET',
            'url': urlFinal+'allBirthdays/getData1',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].birthdayName);
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
                {'data': 'SchoolNumber', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'birthDate', "defaultContent": "N", 'name': 'Birthday'},
                {'data': 'background', "defaultContent": "N", 'name': 'Background'},
                {'data': 'rank', "defaultContent": "None", 'name': 'Rank'},
                {'data': 'options', "defaultContent": 'N', 'name': 'Options'}
            ],

    });
    table2 =  $('#dtBasicExample2').DataTable({
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        'ajax': {
            'type': 'GET',
            'url': urlFinal+'allBirthdays/getData1',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].birthdayName);
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
                {'data': 'SchoolNumber', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'birthDate', "defaultContent": "N", 'name': 'Birthday'},
                {'data': 'background', "defaultContent": "N", 'name': 'Background'},
                {'data': 'rank', "defaultContent": "None", 'name': 'Rank'},
                {'data': 'options', "defaultContent": 'N', 'name': 'Options'}
            ],

    });
    table3 =  $('#dtBasicExample3').DataTable({
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        'ajax': {
            'type': 'GET',
            'url': urlFinal+'allBirthdays/getData1',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].birthdayName);
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
                {'data': 'SchoolNumber', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'birthDate', "defaultContent": "N", 'name': 'Birthday'},
                {'data': 'background', "defaultContent": "N", 'name': 'Background'},
                {'data': 'rank', "defaultContent": "None", 'name': 'Rank'},
                {'data': 'options', "defaultContent": 'N', 'name': 'Options'}
            ],

    });
    table4 =  $('#dtBasicExample4').DataTable({
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        'ajax': {
            'type': 'GET',
            'url': urlFinal+'allBirthdays/getData1',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].birthdayName);
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
                {'data': 'SchoolNumber', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'birthDate', "defaultContent": "N", 'name': 'Birthday'},
                {'data': 'background', "defaultContent": "N", 'name': 'Background'},
                {'data': 'rank', "defaultContent": "None", 'name': 'Rank'},
                {'data': 'options', "defaultContent": 'N', 'name': 'Options'}
            ],

    });
    table5 =  $('#dtBasicExample5').DataTable({
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        'ajax': {
            'type': 'GET',
            'url': urlFinal+'allBirthdays/getData1',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].birthdayName);
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
                {'data': 'SchoolNumber', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'birthDate', "defaultContent": "N", 'name': 'Birthday'},
                {'data': 'background', "defaultContent": "N", 'name': 'Background'},
                {'data': 'rank', "defaultContent": "None", 'name': 'Rank'},
                {'data': 'options', "defaultContent": 'N', 'name': 'Options'}
            ],

    });
    table6 =  $('#dtBasicExample6').DataTable({
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        'ajax': {
            'type': 'GET',
            'url': urlFinal+'allBirthdays/getData1',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].birthdayName);
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
                {'data': 'SchoolNumber', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'birthDate', "defaultContent": "N", 'name': 'Birthday'},
                {'data': 'background', "defaultContent": "N", 'name': 'Background'},
                {'data': 'rank', "defaultContent": "None", 'name': 'Rank'},
                {'data': 'options', "defaultContent": 'N', 'name': 'Options'}
            ],

    });
    table7 =  $('#dtBasicExample7').DataTable({
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        'ajax': {
            'type': 'GET',
            'url': urlFinal+'allBirthdays/getData1',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].birthdayName);
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
                {'data': 'SchoolNumber', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'birthDate', "defaultContent": "N", 'name': 'Birthday'},
                {'data': 'background', "defaultContent": "N", 'name': 'Background'},
                {'data': 'rank', "defaultContent": "None", 'name': 'Rank'},
                {'data': 'options', "defaultContent": 'N', 'name': 'Options'}
            ],

    });
    table8 =  $('#dtBasicExample8').DataTable({
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        'ajax': {
            'type': 'GET',
            'url': urlFinal+'allBirthdays/getData1',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].birthdayName);
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
                {'data': 'SchoolNumber', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'birthDate', "defaultContent": "N", 'name': 'Birthday'},
                {'data': 'background', "defaultContent": "N", 'name': 'Background'},
                {'data': 'rank', "defaultContent": "None", 'name': 'Rank'},
                {'data': 'options', "defaultContent": 'N', 'name': 'Options'}
            ],

    });
    table9 =  $('#dtBasicExample9').DataTable({
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        'ajax': {
            'type': 'GET',
            'url': urlFinal+'allBirthdays/getData1',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].birthdayName);
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
                {'data': 'SchoolNumber', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'birthDate', "defaultContent": "N", 'name': 'Birthday'},
                {'data': 'background', "defaultContent": "N", 'name': 'Background'},
                {'data': 'rank', "defaultContent": "None", 'name': 'Rank'},
                {'data': 'options', "defaultContent": 'N', 'name': 'Options'}
            ],

    });
    table10 =  $('#dtBasicExample10').DataTable({
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        'ajax': {
            'type': 'GET',
            'url': urlFinal+'allBirthdays/getData1',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].birthdayName);
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
                {'data': 'SchoolNumber', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'birthDate', "defaultContent": "N", 'name': 'Birthday'},
                {'data': 'background', "defaultContent": "N", 'name': 'Background'},
                {'data': 'rank', "defaultContent": "None", 'name': 'Rank'},
                {'data': 'options', "defaultContent": 'N', 'name': 'Options'}
            ],

    });
    table11 =  $('#dtBasicExample11').DataTable({
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        'ajax': {
            'type': 'GET',
            'url': urlFinal+'allBirthdays/getData1',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].birthdayName);
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
                {'data': 'SchoolNumber', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'birthDate', "defaultContent": "N", 'name': 'Birthday'},
                {'data': 'background', "defaultContent": "N", 'name': 'Background'},
                {'data': 'rank', "defaultContent": "None", 'name': 'Rank'},
                {'data': 'options', "defaultContent": 'N', 'name': 'Options'}
            ],

    });
    table12 =  $('#dtBasicExample12').DataTable({
        "paging": true,
        "pageLength": 10,
        "processing": true,
        "serverSide": true,
        'ajax': {
            'type': 'GET',
            'url': urlFinal+'allBirthdays/getData1',
            "dataSrc": function (json) {
                console.log(json);

                for (var i = 0; i < json.data.length; i++) {
                    console.log(json.data[i].birthdayName);
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
                {'data': 'SchoolNumber', "defaultContent": "N", 'name': 'School Number'},
                {'data': 'birthDate', "defaultContent": "N", 'name': 'Birthday'},
                {'data': 'background', "defaultContent": "N", 'name': 'Background'},
                {'data': 'rank', "defaultContent": "None", 'name': 'Rank'},
                {'data': 'options', "defaultContent": 'N', 'name': 'Options'}
            ],

    });
    $('.dataTables_length').addClass('bs-select');
}
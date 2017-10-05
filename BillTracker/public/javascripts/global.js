var billListData = [];

$(document).ready(function() {
    populateTable();
    $('#billList table tbody').on('click', 'td a.linkshowbill', showBillInfo);
    $('#btnAddBill').on('click', addBill);
    $('#billList table tbody').on('click', 'td a.linkdeletebill', deleteBill);

    //Handle bill paid events for each tenant - probably a better way to do this
    $('#andy').on('click', changeStatus);
    $('#grant').on('click', changeStatus);
    $('#ryan').on('click', changeStatus);
    $('#pat').on('click', changeStatus);
});

function populateTable() {
    var tableContent = '';
    $.getJSON('bills/billlist', function(data) {
        billListData = data;
        $.each(data, function() {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowbill" rel="' + this.name + '">' + this.name + '</a></td>';
            tableContent +='<td>' + this.amount + '</td>';
            tableContent += '<td>' + ((this.amount) / 4) + '</td>';
            tableContent += '<td>' + this.duedate + '</td>';
            tableContent += '<td><a href="#" class="linkdeletebill" rel="' + this._id + '">Delete</a></td>';
            tableContent += '</tr>' ;
        });

        $('#billList table tbody').html(tableContent);
    });
};

function showBillInfo(event) {


    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisBillName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = billListData.map(function(arrayItem) { return arrayItem.name; }).indexOf(thisBillName);

    // Get our User Object
    var thisBillObject = billListData[arrayPosition];

    //Populate Info Box
    $('#andy').text(thisBillObject.andy);
    $('#grant').text(thisBillObject.grant);
    $('#ryan').text(thisBillObject.ryan);
    $('#pat').text(thisBillObject.pat);

};


function addBill(event) {
    event.preventDefault();

    var errorCount = 0;
    $('#addBill input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    if(errorCount == 0) {
        var newBill = {
            'name': $('#addBill fieldset input#inputBillName').val(),
            'amount': $('#addBill fieldset input#inputBillAmount').val(),
            'duedate': $('#addBill fieldset input#inputDueDate').val(),
            'andy' : 'Not Paid',
            'grant' : 'Not Paid',
            'ryan' : 'Not Paid',
            'pat' : 'Not Paid'
        }

        $.ajax({
            type: 'POST',
            data: newBill,
            url: '/bills/addbill',
            dataType: 'JSON'
        }).done(function(response){
            if (response.msg === '') {
                $('#addBill fieldset input').val('');
                populateTable();
            } else {
                alert('Error: ' + response.msg);
            }
        });
    } else {
        alert("Please fill out all fields");
        return false;
    }
};

// Delete User
function deleteBill(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this bill?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/bills/deletebill/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

function changeStatus(event) {
    event.preventDefault();

    let tentantToUpdate = $(this).attr('id')

    //set Ajax request params to update based on the tenantToUpdate
    $.ajax({
            type: 'POST',
            data: newBill,
            url: '/bills/addbill',
            dataType: 'JSON'
        }).done(function(response){
            if (response.msg === '') {
                $('#addBill fieldset input').val('');
                populateTable();
            } else {
                alert('Error: ' + response.msg);
            }
        });
    
};
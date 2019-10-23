// Set global variables to track states
var itemChangeDialogueState = false;
var totalItemsNum = 0;

// Set initial event listeners to list and item functions
function setEvenListeners() {
    // Attach Event Listeners to List functions
    $('#add_item').click(function(){
        $('#current_list').addItem();
    });

    $('#clear_list').click(function(){
        $('#current_list').clearList(); 
    });

    // Attach Event Listeners to List Item Functions
    $('.action-done').click(function(){
        $(this).makeDone(this);
    });

    $('.action-modify').click(function(){
        $(this).modifyItem(this);
    });

    $('.action-delete').click(function(){
        $(this).deleteItem(this);
    });
    
    return;
};

function refreshEventListenersForRow(row) {
    $(`.action-done[data-row=${row}]`).click(function(){
        $(this).makeDone(this);
    });

    $(`.action-modify[data-row=${row}]`).click(function(){
        $(this).modifyItem(this);
    });

    $(`.action-delete[data-row=${row}]`).click(function(){
        $(this).deleteItem(this);
    });
    
    return;
}

function countItems() {
    totalItemsNum = $('#current_list').find('tbody').find('tr').length;
    return;
}

function rearrangeItemIds(deletedRow, totalNumberOfRows) {
    var start = parseInt(deletedRow);
    var stop = parseInt(totalNumberOfRows);
    
//    console.log(`start from ${start}`);
//    console.log(`stop at ${stop}`);
    
    for (i=start; i <= stop; i++) {
//        console.log(`re-arrange for row ${i}`);
        // Update each row after the deleted one decreasing the ID with 1
        $(`#current_list > tbody > tr:nth-child(${i}) > th:nth-child(1)`).html(`${i}`);
        $(`[data-row=${i+1}]`).each(function(){
            $(this).attr('data-row', i);
        });
        
        // Refresh event listeners
        refreshEventListenersForRow(i);
    };
    
    countItems();
    return;
};

(function( $ ) {

    $.fn.addItem = function() {
        // If new item dialogue is already open, stop the function exec
        // if not open 'false', if open 'true'
        if (itemChangeDialogueState) {
            alert('An item is already being modified!');
            return;
        }
        
        // Get the next available itemId
        var newItemNum = this.find('tbody').find('tr').length + 1;
        
        // Append the new row
        this.append('<tr><th>' + newItemNum + '</th>' + 
                '<th><input type="text" name="newItemDescription"></th>' + 
                '<th class="state-new-item">New</th>' + 
                '<th><a href="#" class="action-save"' + 
                ' data-row="' + newItemNum + 
                '" >Save</a> | <a href="#" class="action-cancel" data-row="' +
                newItemNum + '">Cancel</a></th>' + 
                '<th><span>Sharable? </span><input id="newItemShare" type="checkbox">' +
                '</th></tr>');
                
        // Focus on the description input field
        this.find('tbody').find('tr').find('[name="newItemDescription"]').focus();
        
        // Add event listeners for save and cancel
        $(`.action-save[data-row=${newItemNum}]`).click(function(){
            $(this).saveItem(this);
        });
        $(`.action-cancel[data-row=${newItemNum}]`).click(function(){
            $(this).cancelNewItem(this);
        });
        
        // Update global variables
        itemChangeDialogueState = true;
        
        return;
    };
    
    $.fn.saveItem = function(e) {
        // Get description field
        var taskDescription = $('[name="newItemDescription"]');

        // Check whether the description field is empty
        if (taskDescription.val() === '') {
            alert('Please write task description');
            taskDescription.focus();
            return;
        }

        // Get row id, description field value and whether to be sharable
        var row = e.getAttribute('data-row');
        var desc = taskDescription.val();
        var sharable = '-';
        var actions = `<a href="#" class="action-done" data-row="${row}">Done</a> | `
                        + `<a href="#" class="action-modify" data-row="${row}">Modify</a> | `
                        + `<a href="#" class="action-delete" data-row="${row}">Delete</a>`;

        // Check whether should be sharable or not
        if ($('#newItemShare').is(':checked')) sharable = 'Facebook | Twitter | Mail';

        // Update description field
        $(`#current_list > tbody > tr:nth-child(${row}) > th:nth-child(2)`)
                .html(desc);
        // Update Actions field
        $(`#current_list > tbody > tr:nth-child(${row}) > th:nth-child(4)`)
                .html(actions);
        // Update Share field
        $(`#current_list > tbody > tr:nth-child(${row}) > th:nth-child(5)`)
                .html(sharable);

        // Attach Event Listeners to List Item Functions
        refreshEventListenersForRow(row);

        // Update global variables
        itemChangeDialogueState = false;
        countItems();

        return;
    };
    
    $.fn.cancelNewItem = function(e) {
        var row = e.getAttribute('data-row');
        $(`#current_list > tbody > tr:nth-child(${row})`).remove();
        itemChangeDialogueState = false;
        return;
    };
    
    $.fn.makeDone = function(e) {
        var row = e.getAttribute('data-row');
        
        // Update description field
        $(`#current_list > tbody > tr:nth-child(${row}) > th:nth-child(3)`)
                .html('Done').removeClass('state-new-item').addClass('state-done-item');
        // Update Actions field
        $(`#current_list > tbody > tr:nth-child(${row}) > th:nth-child(4)`)
                .html(`<a href="#" class="action-delete" data-row="${row}">Delete</a>`);
        
        // Refresh event listener for Delete button
        $(`.action-delete[data-row=${row}]`).click(function(){
            $(this).deleteItem(this);
        });
        
        return;
    };
    
    $.fn.modifyItem = function(e) {
        
        if (itemChangeDialogueState) {
            alert('An item is already being modified');
            return;
        }
        
        itemChangeDialogueState = true;
        
        var row = e.getAttribute('data-row');
        var currentDescContent = $(`#current_list > tbody > tr:nth-child(${row}) > th:nth-child(2)`).html();
        var currentActionsContent = $(`#current_list > tbody > tr:nth-child(${row}) > th:nth-child(4)`).html();
        
        $(`#current_list > tbody > tr:nth-child(${row}) > th:nth-child(2)`)
                .html(`<input id="modify-row-${row}" type="text" data-row="${row}">`);
        $(`#modify-row-${row}`).val(currentDescContent).focus();
        $(`#current_list > tbody > tr:nth-child(${row}) > th:nth-child(4)`)
                .html(`<a href="#" class="action-save-modification" data-row="${row}" >Save</a>
                        | <a href="#" class="action-cancel-modification" data-row="${row}">Cancel</a>`);
        
        // Attach event listeners
        $(`.action-save-modification[data-row=${row}]`).click(function(){
            var newDescContent = $(`#modify-row-${row}`).val();
            $(this).saveItemModification(row, newDescContent, currentActionsContent);
        });
        $(`.action-cancel-modification[data-row=${row}]`).click(function(){
            $(this).cancelItemModification(row, currentDescContent, currentActionsContent);
        });
        
        return;
    };
    
    $.fn.saveItemModification = function(row, newDescContent, newActionsContent) {
        $(`#current_list > tbody > tr:nth-child(${row}) > th:nth-child(2)`)
                .html(newDescContent);
        $(`#current_list > tbody > tr:nth-child(${row}) > th:nth-child(4)`)
                .html(newActionsContent);
        
        // Refresh event listeners
        refreshEventListenersForRow(row);
        
        itemChangeDialogueState = false;
        
        return;
    };
    
    $.fn.cancelItemModification = function(row, oldDescContent, oldActionsContent) {
        $(`#current_list > tbody > tr:nth-child(${row}) > th:nth-child(2)`)
                .html(oldDescContent);
        $(`#current_list > tbody > tr:nth-child(${row}) > th:nth-child(4)`)
                .html(oldActionsContent);
        
        itemChangeDialogueState = false;
        
        // Refresh event listeners
        refreshEventListenersForRow(row);
        
        return;
    };
    
    $.fn.deleteItem = function(e) {
        // Get the row and delete it
        var row = e.getAttribute('data-row');
//        console.log(`start delete function for row ${row}`);

        $(`#current_list > tbody > tr:nth-child(${row})`).remove();
                
        // Check if is last element; if 'false' rearrange items/rows IDs
        if (parseInt(row) === parseInt(totalItemsNum)) {
//            console.log('last row, don\'t start rearranging');
            // Update the number of available rows/items
            countItems();
            return;
        } else {
//            console.log('not last row, start rearranging');
            // Rearrange the rows/items IDs if not the last row/item
            rearrangeItemIds(row, totalItemsNum);
            return;
        }
    };
    
    $.fn.clearList = function() {
        // Remove the tbody html contents
        this.find('tbody').html('');
    };
    
//    $.fn.rearrangeItemIds = function(deletedRow, totalNumberOfRows) {
//        var start = deletedRow;
//        var stop = (totalNumberOfRows - (deletedRow-1));
//        
//        for (i=start; i <= stop; i++) {
//            // Update each row after the deleted one decreasing the ID with 1
//            $(`#current_list > tbody > tr:nth-child(${i}) > th:nth-child(1)`).html(`${i}`);
//        }
//        
//        return;
//    };
 
}( jQuery ));

// Not in use yet
//function todo(name, itemNum) {
//    this.name = name;
//    this.itemNum = itemNum;
//    
//    start = 0;
//    stop = itemNum;
//    
//    for (i=start; i <= stop; i++) {
//        var newRow = 'row' + (i+1);
//        this.newRow = [];
//        
//        innerStart = 0;
//        innerStop = $('#current_list > tbody > tr:nth-child(' + i + ')').find("th").length;
//        for (j=innerStart; j<=innerStop; j++) {
//            this.newRow[j-1] = $('#current_list > tbody > tr:nth-child(' + i + ') > th:nth-child(' + j + ')').text();
//        }
//    }
//    
//    return this;
//};
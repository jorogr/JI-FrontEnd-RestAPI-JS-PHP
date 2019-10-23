<?php
echo '<div id="list_wrapper">'
        . '<div id="title_wrapper">'
            . '<div id="list_title" class="display-inline">My First List</div>'
            . '<div id="list_actions" class="display-inline float-right">'
                . '<div id="add_item" class="button display-inline">Add Item</div>'
                . '<div id="clear_list" class="button-warn display-inline">Clear List</div>'
            . '</div>'
        . '</div>'
        . '<table id="current_list" data-ListId="my_first_list">'
        . '<thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
              <th>Share</th>
            </tr>
           </thead>'
        . '<tbody>'
        . '</tbody>'
        . '</table>'
. '</div>';

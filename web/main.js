$(function() {
    $("body").html("Loading items...");
    $.post('/app', {"access_token": access_token, "action": "items"}, function(resp) {
        if (!resp.success) {
            $("body").html("FAILED");
        } else {
            var html = "<h3>Items</h3>"
            html += '<table class="table"><thead><tr><td>Item ID</td><td>Style</td><td>Size</td></tr></thead>';
            html += "<tbody>"
            for (var i = 0; i < resp.items.length; ++i) {
                item = resp.items[i];
                html += "<tr><td>" + item.pk  + "</td><td>" + item.style + "</td><td>" + item.size + "</td></tr>";
            }
            html += "</tbody></table>";
            $("body").html(html);
        }
    });
});

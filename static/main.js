$(function() {
    $("#app").html("Loading items...");

    // Ideally we'd just query the remote API directly here, but it's a bit
    // tedious to set up all of the CORS stuff on a local dev server...
    $.post('/app', {"access_token": access_token, "action": "items"}, function(resp) {
        if (!resp.success) {
            $("#app").html("FAILED");
        } else {
            var html = "<h3>Items</h3>"
            html += '<table class="table"><thead><tr><td>Item ID</td><td>Style</td><td>Size</td><td>Listing</td></tr></thead>';
            html += "<tbody>"
            for (var i = 0; i < resp.items.length; ++i) {
                item = resp.items[i];
                html += "<tr><td>" + item.pk  + "</td><td>" + item.style + "</td><td>" + item.size + '</td><td>';
                if (item.listingLink)
                    html += '<a target="_blank" href="' + item.listingLink + '">Open</a>';
                html += "</td></tr>";
            }
            html += "</tbody></table>";
            $("#app").html(html);
        }
    });
});

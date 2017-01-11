var next_link = null;

function recomputeNextLink(url) {
    next_link = url;
    if (next_link === null)
        $("#btnNext").hide();
    else
        $("#btnNext").show();
}

function loadItems(urlOrPath) {
    $("#itemsTable").append('<tr id="loadingRow"><td colspan="5">Loading items...</td></tr>');
    // Ideally we'd just query the remote API directly here, but it's a bit
    // tedious to set up all of the CORS stuff on a local dev server...
    $.post('/app', {"access_token": access_token, "path": urlOrPath}, function(resp) {
        $("#loadingRow").remove();
        var html = "";
        for (var i = 0; i < resp.results.length; ++i) {
            item = resp.results[i];
            html += '<tr><td><img width="50px;" src="' + item.image.image_thumbnail + '"></td><td>' + item.pk  + "</td><td>" + item.style + "</td><td>" + item.size + '</td><td>';
            if (item.listingLink)
                html += '<a target="_blank" href="' + item.listingLink + '">Open</a>';
            html += "</td></tr>";
        }
        recomputeNextLink(resp.next);
        $("#itemsTable").append(html);
    });
}

$(function() {
    $("#btnNext").on('click', function() {
        if (!next_link)
            return;
        loadItems(next_link);
    });

    loadItems("items");
});

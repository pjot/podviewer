Podviewer = {};

Podviewer.getItem = function (id)
{
    for (i in Podviewer.podcast.items)
    {
        item = Podviewer.podcast.items[i];
        if (item.id == id)
            return item;
    }
    return false;
};

Podviewer.moveList = function () {
    var current = $('.list-group-item-info'),
        current_top = current.position().top,
        current_height = current.outerHeight(),
        scroller = current.parent(),
        scroller_top = scroller.scrollTop(),
        scroller_height = scroller.height();

    scroller.scrollTop(scroller_top - scroller_height / 2 + current_top + current_height / 2);
};

Podviewer.up = function () {
    var item = $('.list-group-item.list-group-item-info'), next;
    item.removeClass('list-group-item-info');

    next = item.prev().length > 0
        ? item.prev()
        : item.parent().find('.list-group-item:last');

    next.addClass('list-group-item-info');
    Podviewer.moveList();
};

Podviewer.down = function () {
    var item = $('.list-group-item.list-group-item-info'), next;
    item.removeClass('list-group-item-info');

    next = item.next().length > 0
        ? item.next()
        : item.parent().find('.list-group-item:first');

    next.addClass('list-group-item-info');
    Podviewer.moveList();
};

Podviewer.view = function () {
    var current = $('.list-group-item.list-group-item-info'),
        id = current.attr('rel'),
        item = Podviewer.getItem(id);

    if ( ! item)
        return;

    $('.player').show();
    $('iframe').attr('src', item.url);
    $('.active').removeClass('active');
    $('.playing').hide();
    current.addClass('active');
    $('.active .playing').show();
    $('#current_title').html(item.title);
    $('#current_description').html(item.description);
};

Podviewer.toggleVolumeIcon = function () {
    var elements = $('.playing');
    elements.toggleClass('glyphicon-volume-up');
    elements.toggleClass('glyphicon-volume-down');
};

$(document).ready(function () {
    $('.list-group-item:first').addClass('list-group-item-info');
    $(document).on('keydown', function (event) {
        event.preventDefault();
        switch (event.keyCode)
        {
            case 40:
                Podviewer.down();
                break;
            case 38:
                Podviewer.up();
                break;
            case 13:
                Podviewer.view();
                break;
        }
    });
    window.setInterval(Podviewer.toggleVolumeIcon, 1000);
});

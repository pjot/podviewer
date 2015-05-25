/**
 * Global static object containing the current state and all the static methods
 */
Podviewer = {
    has_started : false,
    current_view : 'episodes',
    podcast : {},
};

/**
 *  Searches the current podcast's items and retrieves one by id
 *
 *  @param str id ID of item
 *
 *  @return Item
 */
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

/**
 * Sets the current view to the selected one.
 *
 * Allowed ones are:
 *  - movie
 *  - episodes
 *  - mix
 *
 * @param str view
 */
Podviewer.setView = function (view)
{
    // If nothing has been played yet, only allow the episodes list
    Podviewer.current_view = Podviewer.has_started
        ? view
        : 'episodes';
    switch (Podviewer.current_view)
    {
        case 'movie':
            $('.episodes, .header').hide();
            $('.movie').removeClass('col-md-8').addClass('col-md-12');
            break;
        case 'episodes':
            $('.episodes, .header').show();
            $('.movie').hide();
            $('.episodes').removeClass('col-md-4').addClass('col-md-12');
            // List is visible, ensure that it's in the right place
            Podviewer.moveList();
            break;
        case 'mix':
            $('.episodes, .movie, .header').show();
            $('.episodes').removeClass('col-md-12').addClass('col-md-4');
            $('.movie').removeClass('col-md-12').addClass('col-md-8');
            // List is visible, ensure that it's in the right place
            Podviewer.moveList();
            break;
    }
};

/**
 *  Move the list to center the current selection
 */
Podviewer.moveList = function ()
{
    var current = $('.list-group-item-info'),
        current_top = current.position().top,
        current_height = current.outerHeight(),

        scroller = current.parent(),
        scroller_top = scroller.scrollTop(),
        scroller_height = scroller.height();

    scroller.scrollTop(scroller_top - scroller_height / 2 + current_top + current_height / 2);
};

/**
 * Handles when the up-arrow key is pressed
 *
 * Moves up in the list
 */
Podviewer.up = function ()
{
    var item = $('.list-group-item.list-group-item-info'), next;
    item.removeClass('list-group-item-info');

    next = item.prev().length > 0
        ? item.prev()
        : item.parent().find('.list-group-item:last');

    next.addClass('list-group-item-info');
    Podviewer.moveList();
};

/**
 * Handles when the down-array key is pressed
 *
 * Moves down in the list
 */
Podviewer.down = function ()
{
    var item = $('.list-group-item.list-group-item-info'), next;
    item.removeClass('list-group-item-info');

    next = item.next().length > 0
        ? item.next()
        : item.parent().find('.list-group-item:first');

    next.addClass('list-group-item-info');
    Podviewer.moveList();
};

/**
 * Handles when the enter key is pressed
 *
 * Start playing the selected episode and change to the mix view
 */
Podviewer.view = function ()
{
    var current = $('.list-group-item.list-group-item-info'),
        id = current.attr('rel'),
        item = Podviewer.getItem(id);

    // Halt if not able to find the item
    if ( ! item)
        return;

    // Update selected item
    $('.active').removeClass('active');
    current.addClass('active');

    // Ensure that the player is visible
    $('.player').show();

    // Use the selected item
    $('iframe').attr('src', item.url);
    $('#current_title').html(item.title);
    $('#current_description').html(item.description);

    Podviewer.has_started = true;
    Podviewer.setView('mix');
    // Fix the height of the list
    $('.episodes .list-group').height($('.movie .panel').height())
};

/**
 * Add an item to the episodes list
 *
 * @param item Object containing id, title and date
 */
Podviewer.addItem = function (item)
{
    var html = $('#item').html();
    html = html.replace('{id}', item.id);
    html = html.replace('{title}', item.title);
    html = html.replace('{date}', item.date);
    $('.episodes .list-group').append(html);
};

/**
 * Load the podcast
 *
 * Fetches the data from the server and puts it in the episodes list
 */
Podviewer.loadPodcast = function ()
{
    $.getJSON('ajax.php', function (data) {
        Podviewer.podcast = data;
        Podviewer.loadItems();
        Podviewer.setView('episodes');
    });
};

/**
 * Toggle the volume icon between <) and <))
 *
 * Used to "animate" it because I was bored
 */
Podviewer.toggleVolumeIcon = function ()
{
    var elements = $('.playing');
    elements.toggleClass('glyphicon-volume-up');
    elements.toggleClass('glyphicon-volume-down');
};

/**
 * Loads all the items from the stored data
 */
Podviewer.loadItems = function ()
{
    // Set data from Podcast
    $('#podcast_title').html(Podviewer.podcast.title);
    $('#podcast_description').html(Podviewer.podcast.description);
    $('#podcast_logo').attr('src', Podviewer.podcast.logo);
    // Fill the episodes lsit
    $('.episodes .list-group').html(''); 
    for (i in Podviewer.podcast.items)
    {
        item = Podviewer.podcast.items[i];
        Podviewer.addItem(item);
    }
    // Pre-select the first one
    $('.list-group-item:first').addClass('list-group-item-info');
};

/**
 * Handler for keypress event
 *
 * @param event Event
 */
Podviewer.handleKeyPress = function (event)
{
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
        case 39:
            if (Podviewer.current_view == 'mix')
                return Podviewer.setView('movie');

            if (Podviewer.current_view == 'episodes')
                return Podviewer.setView('mix');
            break;
        case 37:
            if (Podviewer.current_view == 'mix')
                Podviewer.setView('episodes');

            if (Podviewer.current_view == 'movie')
                Podviewer.setView('mix');
            break;
    }
    return false;
};

/**
 * Initiate the client-side app
 */
Podviewer.init = function ()
{
    Podviewer.loadPodcast(Podviewer.initial);
    $(document).on('keydown', Podviewer.handleKeyPress);
    window.setInterval(Podviewer.toggleVolumeIcon, 1000);
};

/**
 * Go go go!
 */
$(document).ready(function () {
    Podviewer.init();
});

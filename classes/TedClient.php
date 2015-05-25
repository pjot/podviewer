<?php

/**
 * Class for fetching and parsing TED Talks RSS feeds
 *
 * Fetching, parsing XML are split into separate methods to make it possible to
 * add unit tests in the future.
 */
class TedClient
{
    /**
     * RSS URL
     *
     * @var str
     */
    protected static $url = 'http://feeds.feedburner.com/tedtalks_video';

    /**
     * Retrieve and store XML from feed
     *
     * @return str XML from feed
     */
    public function retrieveXML()
    {
        return file_get_contents(self::$url);
    }

    /**
     * Parse XML from feed
     *
     * @return Podcast object
     */
    public function parseXML($xml)
    {
        $xml = new SimpleXMLElement($xml);
        $xml->registerXPathNamespace('media', 'http://search.yahoo.com/mrss/');

        // Channel content
        $podcast = new stdClass;
        $podcast->title = (string) $xml->channel->title;
        $podcast->description = (string) $xml->channel->description;
        $podcast->logo = (string) $xml->channel->image->url;

        // Episodes
        $xml_items = $xml->xpath('channel/item');
        $podcast->items = array();
        foreach ($xml_items as $item_xml)
        {
            $item = new stdClass;
            $item->title = (string) $item_xml->title;
            $item->description = strip_tags((string) $item_xml->description);
            $item->id = md5($item->description);
            // Better control of date format..
            $date = DateTime::createFromFormat('D, d M Y H:i:s T', (string) $item_xml->pubDate);
            $item->date = $date->format('Y-m-d H:i');
            $item->url = (string) $item_xml->xpath('//media:content')[0]['url'];

            $podcast->items[] = $item;
        }

        return $podcast;
    }

    /**
     * Get the podcast object
     */
    public function getPodcast()
    {
        $xml = $this->retrieveXML();
        $podcast = $this->parseXML($xml);
        return $podcast;
    }
}

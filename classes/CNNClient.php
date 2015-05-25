<?php

class CNNClient
{
    protected static $base_url = 'http://rss.cnn.com/services/podcasting/%s/rss';

    public function __construct($podcast)
    {
        $this->url = sprintf(self::$base_url, $podcast);
    }

    public function retrieveXML()
    {
        $this->xml = file_get_contents($this->url);
    }

    public function parseXML()
    {
        $xml = new SimpleXMLElement($this->xml);

        $podcast = new stdClass;
        $podcast->title = (string) $xml->channel->title;
        $podcast->description = (string) $xml->channel->description;

        $xml_items = $xml->xpath('channel/item');
        $podcast->items = array();
        foreach ($xml_items as $item_xml)
        {
            $date = DateTime::createFromFormat('D, d M Y H:i:s T', (string) $item_xml->pubDate);
            $item = new stdClass;
            $item->title = (string) $item_xml->title;
            $item->description = strip_tags((string) $item_xml->description);
            $item->id = md5($item->description);
            $item->date = $date->format('Y-m-d H:i');
            $item->url = (string) $item_xml->link;

            $podcast->items[] = $item;
        }

        $this->podcast = $podcast;
        $this->json = json_encode($podcast);
    }

    public function getPodcast()
    {
        $this->retrieveXML();
        $this->parseXML();
        return $this->podcast;
    }
}

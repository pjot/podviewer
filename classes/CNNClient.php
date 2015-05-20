<?php

class CNNClient
{
    public function __construct($url)
    {
        $this->url = $url;
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
        $i = 1;
        foreach ($xml_items as $item_xml)
        {
            $date = DateTime::createFromFormat('D, d M Y H:i:s T', (string) $item_xml->pubDate);
            $item = new stdClass;
            $item->id = $i;
            $item->title = (string) $item_xml->title;
            $item->description = strip_tags((string) $item_xml->description);
            $item->date = $date->format('Y-m-d H:i');
            $item->url = (string) $item_xml->link;
            $i++;

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

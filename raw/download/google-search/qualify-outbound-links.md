<!--
Nguồn: https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links?hl=en
Tiêu đề gốc: Qualify your outbound links to Google
Tải về: 2026-09-29 · Google ghi "Last updated 2025-12-10 UTC"
Chuyển từ HTML sang Markdown bằng pandoc; liên kết đã đổi thành URL tuyệt đối.
-->

# Qualify your outbound links to Google

For certain links on your site, you might want to tell Google your relationship with the linked page. In order to do that, use one of the following ` rel ` attribute values in the ` <a> ` tag.

For regular links that you expect Google to fetch and parse without any qualifications, you don't need to add a ` rel ` attribute. For example:

\<p\>My favorite horse is the \<a href="https://horses.example.com/Palomino"\>palomino\</a\>.\</p\>

For other links, use one or more of the following values:

<table class="responsive fixed" style="width:20%;">
<colgroup>
<col style="width: 20%" />
</colgroup>
<thead>
<tr>
<th><code dir="ltr" translate="no"> rel </code> values</th>
</tr>
</thead>
<tbody>
<tr>
<td><h3 id="sponsored" data-text="rel=&quot;sponsored&quot;" tabindex="-1"><code dir="ltr" translate="no"> rel="sponsored" </code></h3></td>
</tr>
<tr>
<td><h3 id="ugc" data-text="rel=&quot;ugc&quot;" tabindex="-1"><code dir="ltr" translate="no"> rel="ugc" </code></h3></td>
</tr>
<tr>
<td><h3 id="nofollow" data-text="rel=&quot;nofollow&quot;" tabindex="-1"><code dir="ltr" translate="no"> rel="nofollow" </code></h3></td>
</tr>
<tr>
<td><h3 id="multiple-values" data-text="Multiple values" tabindex="-1"><em>Multiple values</em></h3></td>
</tr>
</tbody>
</table>

Links marked with these ` rel ` attributes will generally not be followed. Remember that the linked pages may be found through other means, such as sitemaps or links from other sites, and thus they may still be crawled. These ` rel ` attributes are used only in [` <a> ` elements that Google can crawl](https://developers.google.com/search/docs/crawling-indexing/links-crawlable#crawlable-links) , except ` nofollow ` , which is also available as [robots ` meta ` tag](https://developers.google.com/search/docs/crawling-indexing/special-tags) .

If you need to prevent Google from fetching a link to a page on your own site, use the [robots.txt ` disallow ` rule](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt#disallow) .

To prevent Google from indexing a page, allow crawling and use the [` noindex ` robots rule](https://developers.google.com/search/docs/crawling-indexing/block-indexing) .


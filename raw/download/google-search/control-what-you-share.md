<!--
Nguồn: https://developers.google.com/search/docs/crawling-indexing/control-what-you-share?hl=en
Tiêu đề gốc: Control what you share with Google
Tải về: 2026-09-29 · Google ghi "Last updated 2025-12-10 UTC"
Chuyển từ HTML sang Markdown bằng pandoc; liên kết đã đổi thành URL tuyệt đối.
-->

# Control what you share with Google

Google supports a variety of ways that allows site owners control what shows up in Google's search results. While most people focus on getting their pages indexed, sometimes it's important to do the opposite: prevent content from appearing in Search. There are a few reasons you might want to hide content from Google:

- **To restrict data** : You might have data hosted on your site that you want to show only to users who are already on your site. You can block Google from crawling such data so it doesn't show up in search results.\
  Also keep in mind that certain files published on your site may have metadata that can show up in Search. [Learn more about keeping redacted information out of Search](https://developers.google.com/search/docs/crawling-indexing/keep-redacted-information-out) .
- **To hide content of less value to your audience** : Your website might have low quality content that shouldn't show up in Search. For example, if your website allows users to create content, some of that content might be [low quality or even spam](https://developers.google.com/search/docs/essentials/spam-policies#user-generated-spam) . Allowing indexing of such content may have a negative effect on your site's ranking in Google's search results.
- **To have Google focus on your important content** : If you have a very large site (over hundreds of thousands of URLs) and pages with less important content, or if you have a lot of duplicate content, you might want to prevent Google from crawling the duplicate or less important pages in order to focus on your more important content.

## How to block content

Here are the main ways to block content from appearing in Google:

<table class="details responsive">
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Methods</th>
</tr>
</thead>
<tbody>
<tr>
<td><h3 id="remove-the-content-from-your-site" data-text="Remove the content from your site" tabindex="-1">Remove the content from your site</h3></td>
<td><p><strong>Applicable: all content types</strong></p>
<p>Removing content from your site is the best way to ensure that it won't appear in Google Search and anywhere else on the Internet.</p></td>
</tr>
<tr>
<td><h3 id="password-protect-your-files" data-text="Password-protect your files" tabindex="-1">Password-protect your files</h3></td>
<td><p><strong>Applicable: all content types</strong></p>
<p>If you have confidential or private content on your site, you need to password protect it to ensure only authorized users can access it. This will also prevent that content from appearing in Google Search, or if it already appears, it will eventually remove that content from our search results.</p></td>
</tr>
<tr>
<td><a href="/search/docs/crawling-indexing/block-indexing"><code dir="ltr" translate="no"> noindex </code> rule</a></td>
<td><p><strong>Applicable: all content types</strong></p>
<p>The <code dir="ltr" translate="no"> noindex </code> <span translate="no"> robots </span> <code dir="ltr" translate="no"> meta </code> tag is a rule that tells Google not to index your content or let it appear in Google search results. Your content can still be linked to and visited through other web pages, or directly visited by users with a link, but the content will not appear in Google search results.</p></td>
</tr>
<tr>
<td><h3 id="disallow-crawling-with-robots.txt" data-text="         Disallow crawling with         robots.txt       " tabindex="-1">Disallow crawling with <a href="/search/docs/crawling-indexing/prevent-images-on-your-page#for-non-emergency-image-removal">robots.txt</a></h3></td>
<td><p><strong>Applicable: images and video</strong></p>
<p>Google only indexes images and videos that Googlebot is allowed to crawl. To prevent Googlebot from accessing your media files, use <a href="/search/docs/crawling-indexing/prevent-images-on-your-page#for-non-emergency-image-removal">robots.txt rules to block the files</a> .</p></td>
</tr>
<tr>
<td><a href="https://support.google.com/webmasters/answer/3035947" class="external-link">Opt out of specific Google properties</a></td>
<td><p><strong>Applicable: web pages</strong></p>
<p>You can tell Google not to include content from your site in specific Google properties, such as <a href="https://www.google.com/shopping" class="external-link">Google Shopping</a> , <a href="https://www.google.com/travel/hotels" class="external-link">Google Hotels</a> , and vacation rentals.</p></td>
</tr>
</tbody>
</table>

## Remove existing content from Google

If the content hosted on your site is already appearing in Google, you can request the removal of those search results. Learn how to [remove a page hosted on your site from Google](https://developers.google.com/search/docs/crawling-indexing/remove-information) .


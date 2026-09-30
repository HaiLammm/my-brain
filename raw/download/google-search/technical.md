<!--
Nguồn: https://developers.google.com/search/docs/essentials/technical?hl=en
Tiêu đề gốc: Google Search technical requirements
Tải về: 2026-09-29 · Google ghi "Last updated 2025-12-18 UTC"
Chuyển từ HTML sang Markdown bằng pandoc; liên kết đã đổi thành URL tuyệt đối.
-->

# Google Search technical requirements

It costs nothing to get your page in search results, no matter what anyone tries to tell you. As long as your page meets the minimum technical requirements, it's eligible to be indexed by Google Search:

1.  Googlebot isn't blocked.
2.  The page works, meaning that Google receives an HTTP ` 200 (success) ` status code.
3.  The page has indexable content.

## Googlebot isn't blocked (it can find and access the page)

Google only indexes pages on the web that are accessible to the public and which don't block our crawler, [Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot) , from crawling them. If a page is made private, such as requiring a log-in to view it, Googlebot will not crawl it. Similarly, if one of the [several mechanisms](https://developers.google.com/search/docs/crawling-indexing/control-what-you-share) are used to block Google from indexing, the page will not be indexed.

### Check if Googlebot can find and access your page

Pages that are blocked by [robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro) are unlikely to show in Google Search results. To see a list of pages that are inaccessible to Google (but that you would like to see in Search results), use both the <a href="https://support.google.com/webmasters/answer/7440203" class="external-link">Page Indexing report</a> and <a href="https://support.google.com/webmasters/answer/9679690" class="external-link">Crawl Stats report</a> in Search Console. Each report may contain different information about your URLs, so it's a good idea to look at both reports.

To test a specific page, use the <a href="https://support.google.com/webmasters/answer/9012289" class="external-link">URL Inspection tool</a> .

## The page works (it's not an error page)

Google only indexes pages that are served with an [HTTP ` 200 (success) ` status code](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes#2xx-success) . Client and server error pages aren't indexed. You can check the HTTP status code for a given page with the <a href="https://support.google.com/webmasters/answer/9012289" class="external-link">URL Inspection tool</a> .

## The page has indexable content

Once Googlebot can find and access a working page, Google checks the page for indexable content. Indexable content means:

- The textual content is in a [file type that Google Search supports](https://developers.google.com/search/docs/crawling-indexing/indexable-file-types) .
- The content doesn't violate our [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) .


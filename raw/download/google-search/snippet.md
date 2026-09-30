<!--
Nguồn: https://developers.google.com/search/docs/appearance/snippet?hl=en
Tiêu đề gốc: Control your snippets in search results
Tải về: 2026-09-29 · Google ghi "Last updated 2026-04-20 UTC"
Chuyển từ HTML sang Markdown bằng pandoc; liên kết đã đổi thành URL tuyệt đối.
-->

# Control your snippets in search results

A *snippet* is the description or summary part of search result on Google Search and other properties (for example, Google News). Google primarily uses the content on the page to automatically determine the appropriate snippet. We may also use descriptive information in the [meta description](#meta-descriptions) element when it describes the page better than other parts of the content.

![](https://developers.google.com//search/docs/appearance/data:image/svg+xml;base64,PHN2ZyBhcmlhLWxhYmVsbGVkYnk9InN2Zy1zbmlwcGV0IiBkaXJlY3Rpb249Imx0ciIgdmlld2JveD0iMCAwIDgwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICA8dGl0bGUgaWQ9InN2Zy1zbmlwcGV0Ij4KICAgIEFuIGlsbHVzdHJhdGlvbiBvZiBhIHRleHQgcmVzdWx0IGluIEdvb2dsZSBTZWFyY2gsIHdpdGggYSBoaWdobGlnaHRlZCBib3ggYXJvdW5kIHRoZSBzbmlwcGV0IHBhcnQKICAgPC90aXRsZT4KICAgPGltYWdlIHdpZHRoPSIxMDAlIiB4bGluazpocmVmPSIvc2VhcmNoL2RvY3MvaW1hZ2VzL2JsYW5rLXNuaXBwZXQucG5nIiB5PSIxMCUiPjwvaW1hZ2U+CiAgIDxmb3JlaWdub2JqZWN0IGhlaWdodD0iNjUiIHdpZHRoPSI2ODAiIHg9IjU1IiB5PSIxNDAiPgogICAgPHAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwiPgogICAgIEdldCBldmVyeXRoaW5nIHlvdSBuZWVkIHRvIHNldyB5b3VyIG5leHQgZ2FybWVudC4KICAgICAgICBPcGVuIE1vbmRheS1GcmlkYXkgOC01cG0sIGxvY2F0ZWQgaW4gdGhlIEZhc2hpb24gRGlzdHJpY3QuCiAgICA8L3A+CiAgIDwvZm9yZWlnbm9iamVjdD4KICA8L3N2Zz4=)

While we can't manually change snippets for individual sites, we're always working to make them as relevant as possible. You can help improve the quality of the snippet displayed for your pages by following the [best practices for creating quality meta descriptions](#meta-descriptions) .

## How snippets are created

Snippets are automatically created from page content. Snippets are designed to emphasize and preview the page content that best relates to a user's specific search. This means that Google Search might show different snippets for different searches.

Snippets are primarily created from the page content itself. However, Google sometimes uses the [meta description](#meta-descriptions) HTML element if it might give users a more accurate description of the page than content taken directly from the page.

## How to prevent snippets or adjust snippet length

You can prevent snippets from being created and shown for your site in search results, or let Google know about the maximum lengths that you want your snippets to be. To prevent Google from displaying a snippet for your page in search results, use the [` nosnippet ` meta tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#nosnippet) . To specify the maximum length for your snippets, use the [` max-snippet: `*`[number]`*` `](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#max-snippet) ` meta ` tag. You can also prevent certain parts of the page from being shown in a snippet by using the [` data-nosnippet `](https://developers.google.com/search/docs/crawling-indexing/special-tags#data-nosnippet) attribute.

## Best practices for creating quality meta descriptions

Google will sometimes use the [` <meta name="description"> ` tag](https://developers.google.com/search/docs/crawling-indexing/special-tags) from a page to generate a snippet in search results, if we think it gives users a more accurate description than would be possible purely from the on-page content. A meta description tag generally informs and interests users with a short, relevant summary of what a particular page is about. They are like a pitch that convince the user that the page is exactly what they're looking for. There's no limit on how long a meta description can be, but the snippet is truncated in Google Search results as needed, typically to fit the device width.

### Create unique descriptions for each page on your site

Identical or similar descriptions on every page of a site aren't helpful when individual pages appear in search results. Wherever possible, create descriptions that accurately describe the specific page. Use site-level descriptions on the main home page or other aggregation pages, and use page-level descriptions everywhere else. If you don't have time to create a description for every single page, try to prioritize your content; at the very least, create a description for the critical URLs like your home page and popular pages.

### Include relevant information about the content in the description

The meta description doesn't just have to be in sentence format; it's also a great place to include information about the page. For example, news or blog postings can list the author, date of publication, or byline information. This can give potential visitors very relevant information that might not be displayed in the snippet otherwise. Similarly, product pages might have the key bits of information—price, age, manufacturer—scattered throughout a page. A good meta description can bring all this data together.

For example, the following meta description provides detailed information about a book, and information is clearly tagged and separated:

> <span translate="no"> \<meta name="description" content=" </span> Written by A.N. Author, Illustrated by V. Gogh, Price: \$17.99, Length: 784 pages <span translate="no"> "\> </span>

### Programmatically generate descriptions

For some sites, like news media sources, generating an accurate and unique description for each page is easy: since each article is hand-written, it takes minimal effort to also add a one-sentence description. For larger database-driven sites, like product aggregators, hand-written descriptions can be impossible. In the latter case, however, programmatic generation of the descriptions can be appropriate and are encouraged. Good descriptions are human-readable and diverse. Page-specific data is a good candidate for programmatic generation.

Keep in mind that meta descriptions comprised of long strings of keywords don't give users a clear idea of the page's content, and are less likely to be displayed as a snippet.

### Use quality descriptions

Make sure your descriptions are truly descriptive. Because meta descriptions aren't displayed in the pages the user sees, it's easy to let this content slide. But high-quality descriptions can be displayed in Google's search results, and can go a long way to improving the quality and quantity of your search traffic.

Here are some examples of how a meta description can be improved:

<span class="compare-no" aria-hidden="true"> </span> **Bad (list of keywords)** :

> <span translate="no"> \<meta name="description" content=" </span> Sewing supplies, yarn, colored pencils, sewing machines, threads, bobbins, needles <span translate="no"> "\> </span>

<span class="compare-yes" aria-hidden="true"> </span> **Better (explains what the shop sells and details like opening hours and location)** :

> <span translate="no"> \<meta name="description" content=" </span> Get everything you need to sew your next garment. Open Monday-Friday 8-5pm, located in the Fashion District. <span translate="no"> "\> </span>

<span class="compare-no" aria-hidden="true"> </span> **Bad (same description used for every news article)** :

> <span translate="no"> \<meta name="description" content=" </span> Local news in Whoville, delivered to your doorstep. Find out what happened today. <span translate="no"> "\> </span>

<span class="compare-yes" aria-hidden="true"> </span> **Better (uses a snippet from the specific news article)** :

> <span translate="no"> \<meta name="description" content=" </span> Upsetting the small town of Whoville, a local elderly man steals everyone's presents the night before an important event. Stay tuned for live updates on the matter. <span translate="no"> "\> </span>

<span class="compare-no" aria-hidden="true"> </span> **Bad (doesn't summarize the page)** :

> <span translate="no"> \<meta name="description" content=" </span> Eggs are a source of joy in everyone's life. When I was a small child, I remember picking eggs from the hen house and bringing them to the kitchen. Those were the days. <span translate="no"> "\> </span>

<span class="compare-yes" aria-hidden="true"> </span> **Better (summarizes the whole page)** :

> <span translate="no"> \<meta name="description" content=" </span> Learn how to cook eggs with this complete guide in 1 hour or less. We cover all the methods, including: over-easy, sunny side up, boiled, and poached. <span translate="no"> "\> </span>

<span class="compare-no" aria-hidden="true"> </span> **Bad (too short)** :

> <span translate="no"> \<meta name="description" content=" </span> Mechanical pencil <span translate="no"> "\> </span>

<span class="compare-yes" aria-hidden="true"> </span> **Better (specific and detailed)** :

> <span translate="no"> \<meta name="description" content=" </span> Self-sharpening mechanical pencil that autocorrects your penmanship. Includes 2B auto-replenishing lead. Available in both Vintage Pink and Schoolbus Yellow. Order 50+ pencils, get free shipping. <span translate="no"> "\> </span>

## Best practices for "Read more" deep links in Google Search

A "Read more" deep link is a link within a snippet that leads users to a specific section on that page.

<img src="/static/search/docs/images/read-more-deep-link.png" width="600" alt="A read more deep link in Google Search" />

To increase the likelihood that "read more" deep links appear for your site in Google Search, follow these best practices:

- Make sure content is immediately visible on the page to a human (and not hidden behind an expandable section or tabbed interface, for example).
- Avoid using JavaScript to control the user's scroll position on page load (for example, don't force the user's scroll position to the top of the page).
- If you make <a href="https://developer.mozilla.org/en-US/docs/Web/API/History/pushState" class="external-link">history API</a> calls or <a href="https://developer.mozilla.org/en-US/docs/Web/API/Location/hash" class="external-link">window.location.hash</a> modifications on page load, make sure you don't remove the hash fragment from the URL, as this breaks deep linking behavior.


<!--
Nguồn: https://developers.google.com/search/docs/appearance/title-link?hl=en
Tiêu đề gốc: Influencing your title links in search results
Tải về: 2026-09-29 · Google ghi "Last updated 2025-12-10 UTC"
Chuyển từ HTML sang Markdown bằng pandoc; liên kết đã đổi thành URL tuyệt đối.
-->

# Influencing your title links in search results

A *title link* is the title of a search result on Google Search and other properties (for example, Google News) that links to the web page. Google uses a number of different sources to automatically determine the title link, but you can indicate your preferences by following our [best practices for influencing title links](#page-titles) .

![](https://developers.google.com//search/docs/appearance/data:image/svg+xml;base64,PHN2ZyBhcmlhLWxhYmVsbGVkYnk9InN2Zy10aXRsZS1saW5rIiBkaXJlY3Rpb249Imx0ciIgdmlld2JveD0iMCAwIDgwMCAyNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICA8dGl0bGUgaWQ9InN2Zy10aXRsZS1saW5rIj4KICAgIEFuIGlsbHVzdHJhdGlvbiBvZiBhIHRleHQgcmVzdWx0IGluIEdvb2dsZSBTZWFyY2gsIHdpdGggYSBoaWdobGlnaHRlZCBib3ggYXJvdW5kIHRoZSB0aXRsZSBsaW5rIHBhcnQKICAgPC90aXRsZT4KICAgPGltYWdlIHdpZHRoPSIxMDAlIiB4bGluazpocmVmPSIvc2VhcmNoL2RvY3MvaW1hZ2VzL2JsYW5rLXRpdGxlLWxpbmsucG5nIiB5PSIwJSI+PC9pbWFnZT4KICAgPGZvcmVpZ25vYmplY3QgaGVpZ2h0PSI4MCIgd2lkdGg9IjYwMCIgeD0iNTUiIHk9IjY0Ij4KICAgIDxwIHN0eWxlPSJmb250OiB2YXIoLS1kZXZzaXRlLWgyLWZvbnQpIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCI+CiAgICAgPGEgY2xhc3M9ImV4dGVybmFsLWxpbmsiIGhyZWY9Imh0dHBzOi8vd2lraXBlZGlhLm9yZy93aWtpL0ZyaWVkX2VnZyI+CiAgICAgIEhvdyB0byBtYWtlIGNyaXNweSBmcmllZCBlZ2dzCiAgICAgPC9hPgogICAgPC9wPgogICA8L2ZvcmVpZ25vYmplY3Q+CiAgPC9zdmc+)

## Best practices for influencing title links

Title links are critical to giving users a quick insight into the content of a result and why it's relevant to their query. It's often the primary piece of information people use to decide which result to click, so it's important to use high-quality title text on your web pages.

- Make sure **every page on your site has a title specified in the ` <title> ` element** .

- Write **descriptive and concise** text for your ` <title> ` elements. Avoid vague descriptors like "Home" for your home page, or "Profile" for a specific person's profile.\
  Also avoid unnecessarily long or verbose text in your ` <title> ` elements. While there's no limit on how long a ` <title> ` element can be, the title link is truncated in Google Search results as needed, typically to fit the device width.

- Avoid **keyword stuffing** . It's sometimes helpful to have a few descriptive terms in the ` <title> ` element, but there's no reason to have the same words or phrases appear multiple times. Title text like "Foobar, foo bar, foobars, foo bars" doesn't help the user, and this kind of [keyword stuffing](https://developers.google.com/search/docs/essentials/spam-policies#keyword-stuffing) can make your results look spammy to Google and to users.

- Avoid **repeated or boilerplate text in ` <title> ` elements** . It's important to have distinct text that describes the content of the page in the ` <title> ` element for each page on your site. Titling every page on a commerce site "Cheap products for sale", for example, makes it impossible for users to distinguish between two pages. Long text in the ` <title> ` element that varies by only a single piece of information ("boilerplate" titles) is also bad; for example, a common ` <title> ` element for all pages with text like "Band Name - See videos, lyrics, posters, albums, reviews and concerts" contains a lot of uninformative text.

  One solution is to dynamically update the ` <title> ` element to better reflect the actual content of the page. For example, include the words "video" and "lyrics" only if that particular page contains video or lyrics.

- **Brand your titles** concisely. The ` <title> ` element on your site's home page is a reasonable place to include some additional information about your site. For example:

  > <span translate="no"> \<title\> </span> ExampleSocialSite, a place for people to meet and mingle <span translate="no"> \</title\> </span>

  But displaying that text in the ` <title> ` element of every single page on your site will look repetitive if several pages from your site are returned for the same query. In this case, consider including just your [site name](https://developers.google.com/search/docs/appearance/site-names) at the beginning or end of each ` <title> ` element, separated from the rest of the text with a delimiter such as a hyphen, colon, or pipe, like this:

  > <span translate="no"> \<title\> </span> ExampleSocialSite: Sign up for a new account. <span translate="no"> \</title\> </span>

- **Make it clear which text is the main title** for the page. Google looks at various [sources when creating title links](#sources) , including the main visual title, heading elements, and other large and prominent text, and it can be confusing if multiple headings carry the same visual weight and prominence. Consider ensuring that your main title is distinctive from other text on a page and stands out as being the most prominent on the page (for example, using a larger font, putting the title text in the first visible ` <h1> ` element on the page, etc).

- **Be careful about disallowing search engines** from crawling your pages. Using the [robots.txt](https://developers.google.com/search/reference/robots_txt) protocol on your site can stop Google from crawling your pages, but it may not always prevent them from being indexed. For example, Google may index your page if we discover it by following a link from someone else's site. If we don't have access to the content on your page, we will rely on off-page content to generate the title link, such as anchor text from other sites. To prevent a URL from being indexed, you can use the [` noindex ` rule](https://developers.google.com/search/docs/crawling-indexing/block-indexing) .

- **Use the same language and writing system (meaning, the script or alphabet for a given language) as the primary content** on your pages. For example, if a page is written in Hindi, make sure to also write the ` <title> ` element in Hindi (don't write title text in English or transliterate the title into Latin characters).\
  Google tries to show a title link that matches the primary language and writing system of a page. If Google determines that a ` <title> ` element does not match the writing system or language of the page's primary content, we may choose a different text as the title link.

- <span id="flight-pages">**Avoid including flight price information in ` <title> ` elements.** Our systems will likely not show price information when generating title links for flight pages. This is because pricing for flights can change so fast (sometimes every few minutes), that what's shown in title links may not correspond to the actual price on the landing page.</span>

## How title links in Google Search are created

Google's generation of title links on the Google Search results page is completely automated and takes into account both the content of a page and references to it that appear on the web. The goal of the title link is to best represent and describe each result.

Google Search uses the following sources to automatically determine title links:

- Content in ` <title> ` elements
- Main visual title shown on the page
- Heading elements, such as ` <h1> ` elements
- Content in ` og:title ` ` meta ` tags
- Other content that's large and prominent through the use of style treatments
- Other text contained in the page
- Anchor text on the page
- Text within links that point to the page
- [` WebSite ` structured data](https://developers.google.com/search/docs/appearance/site-names#how-to-add-structured-data)

Keep in mind that Google has to recrawl and reprocess the page to notice updates to these sources, which may take a few days to a few weeks. If you've made changes, you can [request that Google recrawl your pages](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl) .

While we can't manually change title links for individual sites, we're always working to make them as relevant as possible. You can help improve the quality of the title link that's displayed for your page by following the [best practices](#page-titles) .

## Common issues and how Google manages them

Here are the most common issues we see with title links in search results. To avoid these issues, follow the [best practices for influencing title links](#page-titles) .

<table class="responsive">
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr>
<th colspan="2">Common issues</th>
</tr>
</thead>
<tbody>
<tr>
<td><h3 id="half-empty-title-elements" data-text="           Half-empty &lt;title&gt; elements           " tabindex="-1">Half-empty <code dir="ltr" translate="no"> &lt;title&gt; </code> elements</h3></td>
<td><p>When part of the title text is missing. For example:</p>
<blockquote>
<span translate="no"> &lt;title&gt; </span> | Site Name <span translate="no"> &lt;/title&gt; </span>
</blockquote>
<p>Google Search looks at information in header elements or other large and prominent text on the page to produce a title link:</p>
<blockquote>
Product Name | Site Name
</blockquote></td>
</tr>
<tr>
<td><h3 id="obsolete-title-elements" data-text="             Obsolete &lt;title&gt; elements           " tabindex="-1">Obsolete <code dir="ltr" translate="no"> &lt;title&gt; </code> elements</h3></td>
<td><p>When the same page is used year-after-year for recurring information, but the <code dir="ltr" translate="no"> &lt;title&gt; </code> element didn't get updated to reflect the latest date. For example:</p>
<blockquote>
<span translate="no"> &lt;title&gt; </span> 2020 admissions criteria - University of Awesome <span translate="no"> &lt;/title&gt; </span>
</blockquote>
<p>In this example, the page has a large, visible title that says "2021 admissions criteria", and the <code dir="ltr" translate="no"> &lt;title&gt; </code> element wasn't updated to the current date. Google Search may detect this inconsistency and uses the right date from the visible title on the page in the title link:</p>
<blockquote>
2021 admissions criteria - University of Awesome
</blockquote></td>
</tr>
<tr>
<td><h3 id="inaccurate-title-elements" data-text="             Inaccurate &lt;title&gt; elements           " tabindex="-1">Inaccurate <code dir="ltr" translate="no"> &lt;title&gt; </code> elements</h3></td>
<td><p>When the <code dir="ltr" translate="no"> &lt;title&gt; </code> elements don't accurately reflect what the page is about. For example, the page could have dynamic content with the following <code dir="ltr" translate="no"> &lt;title&gt; </code> element:</p>
<blockquote>
<code dir="ltr" translate="no"> &lt;title&gt; </code> Giant stuffed animals, teddy bears, polar bears - Site Name <span translate="no"> &lt;/title&gt; </span>
</blockquote>
<p>Google Search tries to determine if the <code dir="ltr" translate="no"> &lt;title&gt; </code> element isn't accurately showing what a page is about. Google Search might modify the title link to better help users if it determines that the page title doesn't reflect the page content. For example:</p>
<blockquote>
Stuffed animals - Site Name
</blockquote></td>
</tr>
<tr>
<td><h3 id="micro-boilerplate-text-in-title-elements" data-text="             Micro-boilerplate text in &lt;title&gt; elements           " tabindex="-1">Micro-boilerplate text in <code dir="ltr" translate="no"> &lt;title&gt; </code> elements</h3></td>
<td><p>When there are repeated boilerplate text in <code dir="ltr" translate="no"> &lt;title&gt; </code> elements for a subset of pages within a site. For example, a television website has multiple pages that share the same <code dir="ltr" translate="no"> &lt;title&gt; </code> element that omits the season numbers, and it's not clear which page is for what season. That produces duplicate <code dir="ltr" translate="no"> &lt;title&gt; </code> elements like this:</p>
<blockquote>
<span translate="no"> &lt;title&gt; </span> My so-called amazing TV show <span translate="no"> &lt;/title&gt; </span>
</blockquote>
<blockquote>
<span translate="no"> &lt;title&gt; </span> My so-called amazing TV show <span translate="no"> &lt;/title&gt; </span>
</blockquote>
<blockquote>
<span translate="no"> &lt;title&gt; </span> My so-called amazing TV show <span translate="no"> &lt;/title&gt; </span>
</blockquote>
<p>Google Search can detect the season number used in large, prominent title text and insert the season number in the title link:</p>
<blockquote>
Season 1 - My so-called amazing TV show
</blockquote>
<blockquote>
Season 2 - My so-called amazing TV show
</blockquote>
<blockquote>
Season 3 - My so-called amazing TV show
</blockquote></td>
</tr>
<tr>
<td><h3 id="no-clear-main-title" data-text="             No clear main title           " tabindex="-1">No clear main title</h3></td>
<td><p>When there's more than one large, prominent heading, and it isn't clear which text is the main title of the page. For example, a page has two or more headings that use the same styling or heading level. If Google Search detects that there are multiple large, prominent headings, it may use the first heading as the text for the title link. Consider ensuring that your main heading is distinctive from other text on a page and stands out as being the most prominent on the page (for example, using a larger font, putting the title text in the first visible <code dir="ltr" translate="no"> &lt;h1&gt; </code> element on the page, etc).</p></td>
</tr>
<tr>
<td><h3 id="mismatch-of-writing-system-or-language-used-in-title-elements" data-text="             Mismatch of writing system or language used in &lt;title&gt; elements           " tabindex="-1">Mismatch of writing system or language used in <code dir="ltr" translate="no"> &lt;title&gt; </code> elements</h3></td>
<td><p>When the writing system or language of the text in <code dir="ltr" translate="no"> &lt;title&gt; </code> elements doesn't match the writing system or language of the primary text on a page. For example, when a page is in written in Hindi, but the title includes text in English or is transliterated into Latin characters. If Google detects a mismatch, it may generate a title link that better matches the primary content. Consider ensuring that the script and language matches what is most prominent on the page.</p></td>
</tr>
<tr>
<td><h3 id="duplication-of-the-site-name-in-the-title-element" data-text="             Duplication of the site name in the &lt;title&gt; element           " tabindex="-1">Duplication of the <a href="/search/docs/appearance/site-names">site name</a> in the <code dir="ltr" translate="no"> &lt;title&gt; </code> element</h3></td>
<td><p>In the case of domain-level site names, Google may omit the site name from the title link, if it's repetitive with the <a href="/search/docs/appearance/site-names">site name that's already shown in the search result</a> .</p></td>
</tr>
</tbody>
</table>

## Submitting feedback about title links

If you're seeing your pages appear in the search results with modified title links, check whether your page has [one of the issues](#issues) that Google adjusts for. If not, consider whether the title link in search results is a better fit for the query. To discuss your pages' title links and get feedback about your pages from other site owners, join our <a href="https://support.google.com/webmasters/community" class="external-link">Google Search Central Help Community</a> .


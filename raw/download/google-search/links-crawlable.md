<!--
Nguồn: https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=en
Tiêu đề gốc: Link best practices for Google
Tải về: 2026-09-29 · Google ghi "Last updated 2025-12-10 UTC"
Chuyển từ HTML sang Markdown bằng pandoc; liên kết đã đổi thành URL tuyệt đối.
-->

# Link best practices for Google

Google uses links as a signal when determining the relevancy of pages and to find new pages to crawl. Learn how to make your links crawlable so that Google can find other pages on your site via the links on your page, and how to improve your anchor text so that it's easier for people and Google to make sense of your content.

## Make your links crawlable

Generally, Google can only crawl your link if it's an ` <a> ` HTML element (also known as *anchor element* ) with an ` href ` attribute. Most links in other formats won't be parsed and extracted by Google's crawlers. Google can't reliably extract URLs from ` <a> ` elements that don't have an ` href ` attribute or other tags that perform as links because of script events. Here are examples of links that Google can and can't parse:

<span class="compare-yes" aria-hidden="true"> </span> **Recommended (Google can parse)**

\<a href="https://example.com"\>

\<a href="/products/category/shoes"\>

\<a href="./products/category/shoes"\>

\<a href="/products/category/shoes" onclick="javascript:goTo('shoes')"\>

\<a href="/products/category/shoes" class="pretty"\>

<span class="compare-no" aria-hidden="true"> </span> **Not recommended (but Google may still attempt to parse this):**

\<a routerLink="products/category"\>

\<span href="https://example.com"\>

\<a onclick="goto('https://example.com')"\>

Make sure that the URL in your ` <a> ` element resolves into an actual web address (meaning, it resembles a URI) that Google crawlers can send requests to, for example:

<span class="compare-yes" aria-hidden="true"> </span> **Recommended (Google can resolve):**

\<a href="**https://example.com/stuff**"\>

\<a href="**/products**"\>

\<a href="**/products.php?id=123**"\>

<span class="compare-no" aria-hidden="true"> </span> **Not recommended (but Google may still attempt to resolve this):**

\<a href="**javascript:goTo('products')**"\>

\<a href="**javascript:window.location.href='/products'**"\>

## Anchor text placement

*Anchor text* (also known as *link text* ) is the visible text of a link. This text tells people and Google something about the page you're linking to. Place anchor text between [` <a> ` elements that Google can crawl](#crawlable-links) .

<span class="compare-yes" aria-hidden="true"> </span> **Good:**

> <span translate="no"> \<a href="https://example.com/ghost-peppers"\> </span> **ghost peppers** <span translate="no"> \</a\> </span>

<span class="compare-no" aria-hidden="true"> </span> **Bad (empty link text):**

> <span translate="no"> \<a href="https://example.com"\> </span> <span translate="no"> \</a\> </span>

As a fallback, Google can use the ` title ` attribute as anchor text if the ` <a> ` element is for some reason empty.

> <span translate="no"> \<a href="https://example.com/ghost-pepper-recipe" title=" </span> **how to pickle ghost peppers** <span translate="no"> "\>\</a\> </span>

For images as links, Google uses the ` alt ` attribute of the ` img ` element as anchor text, so be sure to [add descriptive alt text to your images](https://developers.google.com/search/docs/appearance/google-images#descriptive-alt-text) :

<span class="compare-yes" aria-hidden="true"> </span> **Good:**

> <span translate="no"> \<a href="/add-to-cart.html"\>\<img src="enchiladas-in-shopping-cart.jpg" alt=" </span> **add enchiladas to your cart** <span translate="no"> "/\>\</a\> </span>

<span class="compare-no" aria-hidden="true"> </span> **Bad (empty alt text and empty link text):**

> <span translate="no"> \<a href="/add-to-cart.html"\>\<img src="enchiladas-in-shopping-cart.jpg" alt=""/\>\</a\> </span>

If you are using JavaScript to insert anchor text, use the <a href="https://support.google.com/webmasters/answer/9012289" class="external-link">URL Inspection Tool</a> to make sure it's present in the rendered HTML.

## Write good anchor text

Good anchor text is descriptive, reasonably concise, and relevant to the page that it's on and to the page it links to. It provides context for the link, and sets the expectation for your readers. The better your anchor text, the easier it is for people to navigate your site and for Google to understand what the page you're linking to is about.

<span class="compare-no" aria-hidden="true"> </span> **Bad (too generic):**

> <span translate="no"> \<a href="https://example.com"\> </span> **Click here** <span translate="no"> \</a\> </span> to learn more.

> <span translate="no"> \<a href="https://example.com"\> </span> **Read more** <span translate="no"> \</a\> </span> .

> Learn more about our cheese on our <span translate="no"> \<a href="https://example.com"\> </span> **website** <span translate="no"> \</a\> </span> .

> We have an <span translate="no"> \<a href="https://example.com"\> </span> **article** <span translate="no"> \</a\> </span> that provides more background on how the cheese is made.

<span class="compare-yes" aria-hidden="true"> </span> **Better (more descriptive):**

> For a full list of cheese available for purchase, see the <span translate="no"> \<a href="https://example.com"\> </span> **list of cheese types** <span translate="no"> \</a\> </span> .

<span class="compare-no" aria-hidden="true"> </span> **Bad (weirdly long):**

> Starting next Tuesday, the <span translate="no"> \<a href="https://example.com"\> </span> **Knitted Cow invites local residents of Wisconsin to their grand re-opening by also offering complimentary cow-shaped ice sculptures** <span translate="no"> \</a\> </span> to the first 20 customers.

<span class="compare-yes" aria-hidden="true"> </span> **Better (more concise):**

> Starting next Tuesday, the <span translate="no"> \<a href="https://example.com"\> </span> **Knitted Cow invites local residents of Wisconsin** <span translate="no"> \</a\> </span> to their grand re-opening by also offering complimentary cow-shaped ice sculptures to the first 20 customers.

Write as naturally as possible, and resist the urge to cram every keyword that's related to the page that you're linking to (remember, [keyword stuffing](https://developers.google.com/search/docs/essentials/spam-policies#keyword-stuffing) is a violation of our spam policies). Ask yourself, does the reader need these keywords to understand the next page? If it feels like you're forcing keywords into the anchor text, then it's probably too much.

Remember to give context to your links: the words before and after links matter, so pay attention to the sentence as a whole. Don't chain up links next to each other; it's harder for your readers to distinguish between links, and you lose surrounding text for each link.

<span class="compare-no" aria-hidden="true"> </span> **Bad (too many links next to each other):**

> I've written about cheese <span translate="no"> \<a href="https://example.com/page1"\> </span> **so** <span translate="no"> \</a\> </span> <span translate="no"> \<a href="https://example.com/page2"\> </span> **many** <span translate="no"> \</a\> </span> <span translate="no"> \<a href="https://example.com/page3"\> </span> **times** <span translate="no"> \</a\> </span> <span translate="no"> \<a href="https://example.com/page4"\> </span> **this** <span translate="no"> \</a\> </span> <span translate="no"> \<a href="https://example.com/page5"\> </span> **year** <span translate="no"> \</a\> </span> .

<span class="compare-yes" aria-hidden="true"> </span> **Better (links are spaced out with context):**

> I've written about cheese so many times this year: who can forget the <span translate="no"> \<a href="https://example.com/blue-cheese-vs-gorgonzola"\> </span> **controversy over blue cheese and gorgonzola** <span translate="no"> \</a\> </span> , the <span translate="no"> \<a href="https://example.com/worlds-oldest-brie"\> </span> **world's oldest brie** <span translate="no"> \</a\> </span> piece that won the Cheesiest Research Medal, the epic retelling of <span translate="no"> \<a href="https://example.com/the-lost-cheese"\> </span> **The Lost Cheese** <span translate="no"> \</a\> </span> , and my personal favorite, <span translate="no"> \<a href="https://example.com/boy-and-his-cheese"\> </span> **A Boy and His Cheese: a story of two unlikely friends** <span translate="no"> \</a\> </span> .

## Internal links: cross-reference your own content

You may usually think about linking in terms of pointing to external websites, but paying more attention to the anchor text used for internal links can help both people and Google make sense of your site more easily and find other pages on your site. Every page you care about should have a link from at least one other page on your site. Think about what other resources on your site could help your readers understand a given page on your site, and link to those pages in context.

## External links: link to other sites

Linking to other sites isn't something to be scared of; in fact, using external links can help establish trustworthiness (for example, citing your sources). Link out to external sites when it makes sense, and provide context to your readers about what they can expect.

<span class="compare-yes" aria-hidden="true"> </span> **Good (citing your sources)** :

> According to a recent study from Swiss researchers, Emmental cheese wheels that were exposed to music had a milder flavor when compared to the control cheese wheels (which experienced no such musical treatment), with the full findings available in <span translate="no"> \<a href="https://example.com"\> </span> **Cheese in Surround Sound—a culinary art experiment** <span translate="no"> \</a\> </span> .

Use [` nofollow `](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links#nofollow) only when you don't trust the source, and not for every external link on your site. For example, you're a cheese enthusiast and someone published a story badmouthing your favorite cheese, so you want to write an article in response; however, you don't want to give the site some of your reputation from your link. This would be a good time to use ` nofollow ` .

If you were paid in some way for the link, qualify these links with [` sponsored `](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links#sponsored) or ` nofollow ` . If users can insert links on your site (for example, you have a forum section or Q&A site), add [` ugc `](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links#ugc) or ` nofollow ` to these links too.


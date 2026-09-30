<!--
Nguồn: https://developers.google.com/search/docs/appearance/video?hl=en
Tiêu đề gốc: Video SEO best practices
Tải về: 2026-09-29 · Google ghi "Last updated 2025-12-18 UTC"
Chuyển từ HTML sang Markdown bằng pandoc; liên kết đã đổi thành URL tuyệt đối.
-->

# Video SEO best practices

If you have videos on your site, following these video SEO best practices can help more people find your site through video results on Google. Videos can appear in several different places on Google, including the main search results page, Video mode, Google Images, and [Discover](https://developers.google.com/search/docs/appearance/google-discover) :

![Video content in Google search results, the video tab, and Discover](https://developers.google.com/static/search/docs/images/video-on-google.png)

Optimize your videos to appear on Google by following these best practices:

1.  [Help Google find your videos](#help-google-find)
2.  [Ensure your videos can be indexed](#indexing-criteria)
3.  [Enable specific video features](#enable-search-features)
4.  [Remove, restrict, or update your videos as needed](#remove)
5.  [Monitor your videos with Search Console](#monitor)
6.  [Troubleshoot video issues](#troubleshoot)

## Help Google find your videos

The [technical requirements](https://developers.google.com/search/docs/essentials/technical) for getting your content in Google's search results applies to videos too. There are some additional requirements to making your videos eligible to be discovered, crawled, and indexed by Google Search:

- Use HTML elements commonly used for embedding videos. Google can find videos referenced by a ` <video> ` , ` <embed> ` , ` <iframe> ` , or ` <object> ` element.
- Don't use <a href="https://wikipedia.org/wiki/URI_fragment" class="external-link">fragment identifiers</a> to load the video, as Google Search doesn't generally support URL fragments.
- If you're using JavaScript to inject the video, make sure that it [appears in the rendered HTML in the URL inspection tool](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) .
- If you're using a media API (for example, the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API" class="external-link">Media Source API</a> ), make sure the HTML video container element is still injected even if the media API call fails (in addition to providing metadata about the video). That way Google can still locate the position of the video container even if there's an issue with calling the media API.
- Don't rely on user actions (such as swiping, clicking, or typing) to load the video.

To make it easier for Google to find your videos, we recommend providing metadata about the video. We support [structured data](https://developers.google.com/search/docs/appearance/structured-data/video) , [video sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps) , and the <a href="https://ogp.me/" class="external-link">Open Graph protocol (OGP)</a> .

## Ensure your videos can be indexed

To be eligible for video features, a video must meet the following indexing requirements:

- The [watch page](#watch-page) must be indexed.
- The indexed watch page must be performing well in Search before its video can be considered for indexing.
- The video must be embedded on a watch page.
- The video can't be hidden behind other elements.
- The video must have a [valid thumbnail](#valid-thumbnail) that's available at a [stable URL](#stable-url) .

### Use a supported video file type

To be eligible for video features, use a supported video file type. Google can process the following video file types: 3GP, 3G2, ASF, AVI, DivX, M2V, M3U, M3U8, M4V, MKV, MOV, MP4, MPEG, OGV, QVT, RAM, RM, VOB, WebM, WMV, and XAP.

<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs" class="external-link">Data URLs</a> aren't supported.

### Use stable URLs

Some CDNs use quickly expiring URLs. If the video's thumbnail URL changes too often, Google may not be able to successfully index your videos. To make sure your videos can be indexed, use a single unique and stable thumbnail URL for each video.

To make your videos [eligible for specific features](#enable-search-features) like key moments and video previews, make sure your video files are available at stable URLs too. This also helps Google discover and process the videos consistently, confirm they are still available, and collect signals on the videos.

If you are concerned about bad actors (for example, hackers or spammers) accessing your content, you can [verify Googlebot](https://developers.google.com/search/docs/crawling-indexing/verifying-googlebot) before displaying a stable version of your media URLs. For example, you can choose to serve the [` contentUrl `](https://developers.google.com/search/docs/appearance/structured-data/video#content-url) property only to trusted clients like Googlebot, whereas other clients accessing your page wouldn't see that field. With this setup, only trusted clients will be able to access the location of your video file.

### Create a dedicated watch page for each video

To be eligible for video features (including video results on the main search results page, Video mode, [Key Moments](https://developers.google.com/search/docs/appearance/video#key-moments) , the [Live Badge](https://developers.google.com/search/docs/appearance/video#live-badge) , and other rich formats), create a dedicated watch page for each video, if it makes sense for your business.

<img src="/static/search/docs/images/dedicated-video-page.png" class="attempt-right" alt="a web page where the video is the main content on the page" />

A *watch page* 's main purpose is to show users a single video. The following pages are watch pages because watching an individual video is the main reason the user is visiting the page:

- A video landing page
- A TV episode video player page
- A news video watch page
- A sports highlight page
- An events clip page

These pages aren't watch pages because the video is complementary to the rest of the content on the page:

- A blog post that reviews an embedded video
- A product page with a 360 video of a product
- A video category page that lists multiple videos of equal prominence
- A movie review page with an embedded movie trailer

Make sure each watch page has a page title and description that are unique to that video. For tips, check our best practices for writing good [titles](https://developers.google.com/search/docs/appearance/title-link#page-titles) and [descriptions](https://developers.google.com/search/docs/appearance/snippet#meta-descriptions) .

### Using third-party embedded players

If your website embeds videos from third-party platforms like YouTube, Vimeo, or Facebook, Google may index the video both on your web page and on the third-party platform's equivalent page. Both versions may appear in video features on Google, as long as the pages meet the [video indexing criteria](#indexing-criteria) .

For your own watch page where you've embedded the third-party player, we still recommend that you [provide structured data](#structured-data) , and you may also include these pages in your [video sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps) . To be eligible for more video features, check with your video host to ensure they allow Google to [fetch your video file](#allow-fetch) .

## Which URL is which?

There are several URLs associated with a video. Here's a summary of the main ones:

![URLs on a video page](https://developers.google.com/static/search/docs/images/diagram-urls-in-page.png)

| URLs related to the video |
|---------------------------|
| **1. Watch page**         |
| **2. Video player**       |
| **3. Video file**         |

### Provide a high-quality video thumbnail

To be eligible to appear in video features, a video must have a valid thumbnail image. If you [allow Google to fetch your video files](#allow-fetch) , Google will try to automatically generate a thumbnail for you.

However, you can influence which thumbnail is shown in video features by providing your preferred thumbnail through one of the following metadata sources:

- If you're using the ` <video> ` HTML element, specify the ` poster ` attribute.
- In a video sitemap (including mRSS), specify the ` <video:thumbnail_loc> ` tag (or ` <media:thumbnail> ` respectively).
- For structured data, specify the ` `[` thumbnailUrl `](https://developers.google.com/search/docs/appearance/structured-data/video#thumbnail-url)` ` property.
- For <a href="https://ogp.me/" class="external-link">OGP</a> , specify the ` og:video:image ` property.

If you choose to specify multiple metadata sources (for example, specifying a thumbnail in both your sitemap and structured data), make sure you're using the same thumbnail URL per video across all metadata.

| Video thumbnail specifications  |
|---------------------------------|
| **Supported thumbnail formats** |
| **Size**                        |
| **Location**                    |
| **Transparency**                |

### Provide consistent and unique information in your structured data

To influence how your videos appear on Google, describe your video with [structured data](https://developers.google.com/search/docs/appearance/structured-data/video) . Ensure that any information that you provide in structured data is consistent with the actual video content and other metadata you provide. Make sure to provide unique information in the ` thumbnailUrl ` , ` name ` , and ` description ` properties for each video on your site.

## Enable specific video features

### Video previews

<img src="/static/search/docs/images/video-preview.gif" class="attempt-left" alt="Video preview in search results" />

Google selects a few seconds from your video to display a moving preview, which can help users better understand what they'll find in your video. To make your videos eligible for this feature, [allow Google to fetch your video files](#allow-fetch) . You can set the maximum duration for these video previews using the [` max-video-preview `](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#max-video-preview) <span translate="no"> robots </span> ` meta ` tag.

### Key moments

<img src="/static/search/docs/images/video-key-moments.png" class="attempt-right" width="300" alt="Video with key moments in search results" />

The key moments feature is a way for users to navigate video segments like chapters in a book, which can help users engage more deeply with your content. Google Search tries to automatically detect the segments in your video and show key moments to users, without any effort on your part. Alternatively, you can tell Google about the important points of your video. We will prioritize key moments set by you, either through structured data or the YouTube description.

- **If your video is embedded on your web page or you're running a video platform** , there are two ways that you can enable key moments:
  - [` Clip ` structured data](https://developers.google.com/search/docs/appearance/structured-data/video#clip) : Specify the exact start and end time to each segment, and what label to display for each segment. This is supported in all languages where Google Search is available.
  - [` SeekToAction ` structured data](https://developers.google.com/search/docs/appearance/structured-data/video#seek) : Tell Google where timestamps typically go in your URL structure, so that Google can automatically identify key moments and link users to those points within the video. This is supported for the following languages: English, Spanish, Portuguese, Italian, Chinese, French, Japanese, German, Turkish, Korean, Dutch, and Russian.
- **If your video is hosted on YouTube** , you can specify the exact timestamps and labels in the video description on YouTube. Check out the [best practices for marking timestamps in YouTube descriptions](https://developers.google.com/search/docs/appearance/structured-data/video#best-practices-youtube) . This is supported in all languages where Google Search is available. If you want to enable Video Chapters on YouTube, follow these <a href="https://support.google.com/youtube/answer/9884579" class="external-link">additional guidelines</a> .

To opt out of the key moments feature completely (including any efforts Google may make to show key moments automatically for your video), use the [` nosnippet `](https://developers.google.com/search/docs/appearance/snippet#nosnippet) ` meta ` tag.

### Live Badge

<img src="/static/search/docs/images/video-livestream.png" class="attempt-right" alt="Video with a LIVE badge in search results" />

For livestreaming videos, you can enable a red "LIVE" badge to appear in search results by using [` BroadcastEvent ` structured data](https://developers.google.com/search/docs/appearance/structured-data/video#broadcast-event) .

## Allow Google to fetch your video files

Google needs to successfully fetch the actual bytes of a video file to enable features like [video previews](#video-previews) and [key moments](#key-moments) .

Allow Google to find and fetch your video files by following these best practices:

- Allow Google to fetch the video's streaming file URL (such as M3U8). Don't block the URL of the actual video bytes with the [` noindex `](https://developers.google.com/search/docs/crawling-indexing/block-indexing) rule or [robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro) file.
- The video file must be available at a [stable URL](#stable-url) .
- Use structured data to provide the [` contentURL `](https://developers.google.com/search/docs/appearance/structured-data/video#content-url) value of a [supported file type](#supported-video-files) .
- The host of the video watch page and the server that's streaming the actual video must have enough server resources to support crawling. So if your landing page at ` example.com/puppies.html ` has an embedded puppies video served by ` streamserver.example.com ` , both ` example.com ` and ` streamserver.example.com ` must meet the [technical requirements for Google Search](https://developers.google.com/search/docs/essentials/technical) and have [available server capacity](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors#availability_issues) .

## Remove or restrict your videos

### Remove a video

To remove a video from your site, do one of the following:

- **Return a ` 404 (Not found) `** for any watch page that's embedding the removed or expired video. In addition to the ` 404 ` response code, you can still return the HTML of the page to make the change transparent to most users.
- **Include a [` noindex `](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) <span translate="no"> robots </span> ` meta ` tag** on any watch page that's embedding a removed or expired video. This prevents the watch page from being indexable.
- **Indicate an expiration date** in your structured data (the [` expires `](https://developers.google.com/search/docs/appearance/structured-data/video#expires) property) or video sitemap (use the ` <video:expiration_date> ` element). Here is an example of a video sitemap with a video that expired in November 2009:

  \<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"\> \<url\> \<loc\>https://example.com/videos/some_video_landing_page.html\</loc\> \<video:video\> \<video:thumbnail_loc\> https://example.com/thumbs/123.jpg \</video:thumbnail_loc\> \<video:title\> Grilling steaks for summer \</video:title\> \<video:description\> Bob shows you how to grill steaks perfectly every time \</video:description\> \<video:player_loc\> https://example.com/videoplayer?video=123 \</video:player_loc\> **\<video:expiration_date\>2009-11-05T19:20:30+08:00\</video:expiration_date\>** \</video:video\> \</url\> \</urlset\>

When a video has an expiration date in the past, the video won't appear in video results. The watch page may still be shown as a text result, without a video thumbnail. This includes expiration dates from sitemaps, structured data, and [` meta ` tags](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#unavailable-after) . Make sure that your expiration dates are correct for each video. While this is useful if your video is no longer available after the expiration date, it's easy to accidentally set the date to the past for an available video. If a video doesn't expire, don't include expiration information.

### Restrict a video based on the user's location

You can restrict search results for your video based on the user's location. If your video doesn't have any country restrictions, omit the country restriction tags.

#### Restrict using structured data

If you use [` VideoObject ` structured data](https://developers.google.com/search/docs/appearance/structured-data/video) to describe a video, set the [` regionsAllowed `](https://developers.google.com/search/docs/appearance/structured-data/video#regions-allowed) property to specify which regions can get the video result. If you omit this property, all regions can see the video in search results.

Alternatively, you can use the [` ineligibleRegion `](https://developers.google.com/search/docs/appearance/structured-data/video#ineligible-region) property to specify which regions can't get the video result.

#### Restrict using a video sitemap

In a video sitemap, the [` <video:restriction> `](https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps#country-restriction) tag can be used to allow or deny the video from appearing in specific countries. Only one ` <video:restriction> ` tag is allowed per video entry.

The ` <video:restriction> ` tag must contain one or more space-delimited <a href="https://en.wikipedia.org/wiki/ISO_3166-1" class="external-link">ISO 3166-1 two- or three-letter country codes</a> . The required ` relationship ` attribute specifies the type of restriction.

- ` relationship="allow" ` : The video can appear only for the specified countries. If no countries are specified, the video won't appear anywhere.
- ` relationship="deny" ` : The video can appear everywhere except for the specified countries. If no countries are specified, the video will appear everywhere.

In this video sitemap example, the video will only appear in search results in Canada and Mexico.

\<url\> \<loc\>https://example.com/videos/some_video_landing_page.html\</loc\> \<video:video\> \<video:thumbnail_loc\> https://example.com/thumbs/123.jpg \</video:thumbnail_loc\> \<video:title\>Grilling steaks for summer\</video:title\> \<video:description\> Bob shows you how to get perfectly done steaks every time \</video:description\> \<video:player_loc\> https://example.com/player?video=123 \</video:player_loc\> \<video:restriction relationship="allow"\>ca mx\</video:restriction\> \</video:video\> \</url\>

## Optimize for SafeSearch

SafeSearch is a setting in Google user accounts that specifies whether to show or block explicit images, videos, and websites in Google Search results. Make sure Google understands the nature of your site so that Google can apply SafeSearch filters to your site if appropriate. [Learn more about labeling SafeSearch pages](https://developers.google.com/search/docs/crawling-indexing/safesearch) .

## Monitor video watch pages with Search Console

The following Search Console reports and tools can help you monitor and optimize how your video content is performing on Google Search:

- <a href="https://support.google.com/webmasters/answer/9495631" class="external-link">Video indexing report</a> : See how many of your indexed watch pages contain an indexed video, and see reasons for why other videos didn't get indexed.
- <a href="https://support.google.com/webmasters/answer/7552505" class="external-link">Video rich result report</a> : Review and fix issues with your ` VideoObject ` structured data implementation.
- <a href="https://support.google.com/webmasters/answer/7576553#by_search_appearance&amp;zippy=%2Csearch-appearance" class="external-link">Performance report</a> : Use the Videos search appearance filter to monitor how your videos are performing in Google Search.

## Troubleshoot video issues

You can troubleshoot video issues with Search Console. See the <a href="https://support.google.com/webmasters/answer/9495631#troubleshooting" class="external-link">video troubleshooting guide</a> for help.


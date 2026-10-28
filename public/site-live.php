<?php
/**
 * The live parts of the website, reached through .htaccess rewrites. The site is static files, so
 * without this a blog post published in the dashboard would reach the sitemap, llms.txt and
 * crawlers only with the next website build:
 *
 *   /sitemap.xml   the build's sitemap (every page) with the blog posts replaced by the live list
 *   /llms.txt      the build's llms.txt with its blog sections replaced by the live ones
 *   /blog/<slug>   the app shell (index.csr.html) with the post's title, meta tags, JSON-LD and
 *                  text written in, for crawlers that never run JavaScript (most AI assistants);
 *                  browsers remove that copy at once and run the app as on every other page
 *
 * The data comes from the CES API (GET /seo/public/blog-index and /seo/public/blog-page/:slug -
 * the API's address is in site-live.json, written by scripts/generate-site-files.mjs) and is kept
 * for a few minutes. If the API can't be reached, the last copy - or else the build's own file -
 * is served, so these URLs never fail.
 *
 * Runs on PHP 7.1+ - no arrow functions (7.4), match or str_contains (8.0): the host's PHP version
 * is set per site in hPanel and may be older than the developer's.
 */
declare(strict_types=1);

const CACHE_SECONDS = 300;

$config = json_decode((string) @file_get_contents(__DIR__ . '/site-live.json'), true);
$api = rtrim((string) ($config['api'] ?? ''), '/');
$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https';
$site = ($https ? 'https' : 'http') . '://' . preg_replace('/[^A-Za-z0-9.:-]/', '', (string) ($_SERVER['HTTP_HOST'] ?? 'cesociety.in'));

switch ($_GET['f'] ?? '') {
    case 'sitemap':
        serveSitemap($api, $site);
        break;
    case 'llms':
        serveLlms($api, $site);
        break;
    case 'post':
        servePost($api, $site);
        break;
    default:
        http_response_code(404);
}

/** The API's `data` for $path, or null when it can't be read. */
function apiData(string $api, string $path): ?array
{
    if ($api === '') return null;
    $url = $api . $path;
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8, CURLOPT_CONNECTTIMEOUT => 4]);
        $body = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if ($body === false || $status !== 200) return null;
    } else {
        $body = @file_get_contents($url, false, stream_context_create(['http' => ['timeout' => 8]]));
        if ($body === false) return null;
    }
    $json = json_decode((string) $body, true);
    return is_array($json['data'] ?? null) ? $json['data'] : null;
}

/**
 * apiData() kept for CACHE_SECONDS; when the API fails, the last good copy (however old). A "not
 * found" answer is never stored, so requests for made-up URLs can't fill the cache.
 */
function cachedApiData(string $api, string $path): ?array
{
    $dir = sys_get_temp_dir() . '/ces-site-live';
    $file = $dir . '/' . md5($api . $path) . '.json';
    if (is_file($file) && time() - (int) filemtime($file) < CACHE_SECONDS) {
        $cached = json_decode((string) file_get_contents($file), true);
        if (is_array($cached)) return $cached;
    }
    $data = apiData($api, $path);
    if ($data !== null) {
        if (($data['found'] ?? true) !== false) {
            @mkdir($dir, 0700, true);
            @file_put_contents($file, json_encode($data), LOCK_EX);
        }
        return $data;
    }
    $stale = is_file($file) ? json_decode((string) file_get_contents($file), true) : null;
    return is_array($stale) ? $stale : null;
}

function blogIndex(string $api, string $site): ?array
{
    return cachedApiData($api, '/seo/public/blog-index?site=' . rawurlencode($site));
}

function serveSitemap(string $api, string $site): void
{
    header('Content-Type: application/xml; charset=UTF-8');
    header('Cache-Control: public, max-age=300');
    $static = (string) @file_get_contents(__DIR__ . '/sitemap.xml');
    $index = blogIndex($api, $site);
    if ($index === null || !is_array($index['sitemap'] ?? null)) {
        echo $static;
        return;
    }
    // Every page from the build, minus its (possibly old) post list, plus the live one.
    $lines = array_filter(explode("\n", $static), function ($line) {
        return !preg_match('#<loc>[^<]*/blog/[^<]+</loc>#', $line);
    });
    $xml = implode("\n", $lines);
    $posts = implode("\n", $index['sitemap']);
    echo str_replace('</urlset>', ($posts !== '' ? $posts . "\n" : '') . '</urlset>', $xml);
}

function serveLlms(string $api, string $site): void
{
    header('Content-Type: text/plain; charset=UTF-8');
    header('Cache-Control: public, max-age=300');
    $static = (string) @file_get_contents(__DIR__ . '/llms.txt');
    $index = blogIndex($api, $site);
    if ($index === null || !is_string($index['llms'] ?? null)) {
        echo $static;
        return;
    }
    $live = rtrim($index['llms']);
    // The build's blog sections are dropped - the live ones replace them. A section runs from its
    // "## " heading to the next one.
    preg_match_all('/^## (.+)$/m', $live, $m);
    $blogTitles = array_merge(array_map('trim', $m[1]), ['Blog', 'Centenary Blog Archive (2015)']);
    $out = [];
    $skip = false;
    foreach (explode("\n", rtrim($static)) as $line) {
        if (strncmp($line, '## ', 3) === 0) {
            $skip = in_array(trim(substr($line, 3)), $blogTitles, true);
        }
        if (!$skip) {
            $out[] = $line;
        }
    }
    $text = rtrim(implode("\n", $out));
    if ($live !== '') {
        // Before "## Optional" (llmstxt.org: the part a short context may drop), else at the end.
        $pos = strpos($text, "\n## Optional");
        $text = $pos === false ? $text . "\n\n" . $live : substr($text, 0, $pos) . "\n\n" . $live . "\n" . substr($text, $pos);
    }
    echo $text . "\n";
}

function esc(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Replaces the first `<meta {attr}="{key}" …>` (or adds one before </head>). */
function setMeta(string $html, string $attr, string $key, ?string $value): string
{
    if ($value === null || $value === '') return $html;
    $tag = '<meta ' . $attr . '="' . $key . '" content="' . esc($value) . '">';
    $html = preg_replace_callback('/<meta\s+' . $attr . '="' . preg_quote($key, '/') . '"[^>]*>/i', function () use ($tag) {
        return $tag;
    }, $html, 1, $count);
    return $count ? $html : str_replace('</head>', $tag . "\n</head>", $html);
}

function servePost(string $api, string $site): void
{
    header('Content-Type: text/html; charset=UTF-8');
    header('Cache-Control: no-cache, must-revalidate');
    $shell = (string) @file_get_contents(__DIR__ . '/index.csr.html');

    $path = (string) parse_url((string) ($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH);
    $slug = rawurldecode(trim((string) preg_replace('#^/blog/#', '', $path), '/'));
    $page = $slug === '' ? null : cachedApiData(
        $api,
        '/seo/public/blog-page/' . rawurlencode($slug) . '?site=' . rawurlencode($site) . '&api=' . rawurlencode($api)
    );

    // API unreachable: the plain app shell - the browser loads and shows the post as usual.
    if ($page === null) {
        echo $shell;
        return;
    }
    if (empty($page['found'])) {
        http_response_code(404);
        echo $shell;
        return;
    }

    $title = '<title>' . esc((string) $page['title']) . '</title>';
    $html = preg_replace_callback('#<title>.*?</title>#s', function () use ($title) {
        return $title;
    }, $shell, 1);
    $html = setMeta($html, 'name', 'description', $page['description'] ?? null);
    $html = setMeta($html, 'name', 'keywords', $page['keywords'] ?? null);
    $html = setMeta($html, 'property', 'og:type', 'article');
    $html = setMeta($html, 'property', 'og:url', $page['canonical'] ?? null);
    $html = setMeta($html, 'property', 'og:title', $page['title'] ?? null);
    $html = setMeta($html, 'property', 'og:description', $page['description'] ?? null);
    $html = setMeta($html, 'property', 'og:image', $page['image'] ?? null);
    $html = setMeta($html, 'property', 'og:image:alt', $page['imageAlt'] ?? null);
    $html = setMeta($html, 'name', 'twitter:title', $page['title'] ?? null);
    $html = setMeta($html, 'name', 'twitter:description', $page['description'] ?? null);
    $html = setMeta($html, 'name', 'twitter:image', $page['image'] ?? null);
    $canonical = '<link rel="canonical" href="' . esc((string) ($page['canonical'] ?? '')) . '">';
    $html = preg_replace_callback('/<link\s+rel="canonical"[^>]*>/i', function () use ($canonical) {
        return $canonical;
    }, $html, 1, $count);
    if (!$count) $html = str_replace('</head>', $canonical . "\n</head>", $html);

    // The same id SeoService uses, so the app replaces this block instead of adding a second one.
    $jsonLd = json_encode($page['jsonLd'] ?? null, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP);
    $html = str_replace('</head>', '<script type="application/ld+json" id="seo-page-jsonld">' . $jsonLd . "</script>\n</head>", $html);

    // The post's text for crawlers. The inline script runs while the page is still loading, so a
    // browser never paints this copy - it shows the app's own rendering of the same post.
    $article = $page['article'] ?? [];
    $snapshot = '<div id="seo-snapshot" lang="' . esc((string) ($page['lang'] ?? 'en')) . '"><article>'
        . '<h1>' . esc((string) ($article['heading'] ?? '')) . '</h1>'
        . '<p>' . esc((string) ($article['byline'] ?? '')) . '</p>'
        . (string) ($article['html'] ?? '')
        . '</article></div><script>document.getElementById("seo-snapshot").remove()</script>';
    $html = preg_replace_callback('#<app-root></app-root>#', function () use ($snapshot) {
        return '<app-root></app-root>' . $snapshot;
    }, $html, 1, $count);
    if (!$count) $html = str_replace('</body>', $snapshot . "\n</body>", $html);

    echo $html;
}

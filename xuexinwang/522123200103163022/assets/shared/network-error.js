(function(window, document) {
    var MASK_ID = 'network-error-mask';
    var DIALOG_ID = 'network-error-dialog';
    var STYLE_ID = 'network-error-style';
    var TRIGGER_CLASS = 'js-network-error-trigger';
    var TIMESTAMP_KEY = 't';
    var TIMESTAMP_MAX_DRIFT = 5000;
    var STYLE_TEXT = [
        '.network-error-mask{position:fixed;inset:0;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.45);z-index:9999;}',
        '.network-error-mask.is-visible{display:flex;}',
        '.network-error-dialog{width:min(84vw,320px);background:#fff;border-radius:12px;padding:24px 20px 18px;text-align:center;box-shadow:0 18px 50px rgba(0,0,0,.2);}',
        '.network-error-title{color:#1f1f1f;font-size:18px;font-weight:600;line-height:1.4;}',
        '.network-error-text{margin-top:8px;color:#666;font-size:14px;line-height:1.6;}',
        '.network-error-btn{margin-top:18px;width:100%;height:36px;border:0;border-radius:999px;background:#25b887;color:#fff;font-size:14px;cursor:pointer;}'
    ].join('');

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn, {
                once: true
            });
        } else {
            fn();
        }
    }

    function buildCurrentTimestampUrl() {
        var target = new URL(window.location.href);
        target.searchParams.set(TIMESTAMP_KEY, Date.now().toString());
        return target.toString();
    }

    function ensureFreshTimestamp() {
        try {
            var currentUrl = new URL(window.location.href);
            var rawTimestamp = (currentUrl.searchParams.get(TIMESTAMP_KEY) || '').trim();
            var timestamp = Number(rawTimestamp);
            var isValidTimestamp = rawTimestamp !== '' && Number.isFinite(timestamp);
            if (isValidTimestamp && Math.abs(Date.now() - timestamp) <= TIMESTAMP_MAX_DRIFT) {
                return true;
            }
            window.location.replace(buildCurrentTimestampUrl());
            return false;
        } catch (e) {
            return true;
        }
    }

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = STYLE_TEXT;
        (document.head || document.documentElement).appendChild(style);
    }

    function ensureModal() {
        if (document.getElementById(MASK_ID)) return;
        var mask = document.createElement('div');
        mask.id = MASK_ID;
        mask.className = 'network-error-mask';
        mask.setAttribute('aria-hidden', 'true');
        mask.innerHTML = [
            '<div id="' + DIALOG_ID + '" class="network-error-dialog" role="dialog" aria-modal="true" aria-labelledby="network-error-title">',
            '  <div id="network-error-title" class="network-error-title">当前网络开小差了</div>',
            '  <div class="network-error-text">请稍后再试</div>',
            '  <button type="button" class="network-error-btn">知道了</button>',
            '</div>'
        ].join('');
        document.body.appendChild(mask);
    }

    function showNetworkError() {
        ensureModal();
        var mask = document.getElementById(MASK_ID);
        if (!mask) return;
        mask.classList.add('is-visible');
        mask.setAttribute('aria-hidden', 'false');
    }

    function hideNetworkError() {
        var mask = document.getElementById(MASK_ID);
        if (!mask) return;
        mask.classList.remove('is-visible');
        mask.setAttribute('aria-hidden', 'true');
    }

    function isLocalStaticHref(rawHref) {
        if (!rawHref) return false;
        var href = String(rawHref).trim();
        if (!href || /^javascript:/i.test(href) || /^(mailto:|tel:)/i.test(href)) return false;

        try {
            var url = new URL(href, window.location.href);
            var pathname = url.pathname || '';
            if (pathname !== '/login' && !/\/[^/?#]+\.html?$/i.test(pathname)) return false;
            if (url.protocol === 'file:') return true;
            if (window.location.protocol === 'file:') return true;
            return url.origin === window.location.origin;
        } catch (e) {
            return false;
        }
    }

    function buildTimestampedUrl(rawHref) {
        try {
            var url = new URL(rawHref, window.location.href);
            url.searchParams.set(TIMESTAMP_KEY, Date.now().toString());
            return url.toString();
        } catch (e) {
            return rawHref;
        }
    }

    if (!ensureFreshTimestamp()) {
        return;
    }

    function decorateLocalAnchors(root) {
        if (!root || !root.querySelectorAll) return;
        var anchors = root.querySelectorAll('a[href]');
        for (var i = 0; i < anchors.length; i++) {
            var anchor = anchors[i];
            if (anchor.getAttribute('data-allow-local-link') === 'true') continue;
            var href = (anchor.getAttribute('href') || '').trim();
            if (!isLocalStaticHref(href)) continue;
            anchor.setAttribute('href', buildTimestampedUrl(href));
        }
    }

    function shouldBlockAnchor(anchor) {
        var href = (anchor.getAttribute('href') || '').trim();
        if (!href) return false;
        if (anchor.classList.contains(TRIGGER_CLASS) || anchor.getAttribute('data-network-error') === 'true') return true;
        if (href === '#') return true;
        return !isLocalStaticHref(href) && !/^javascript:/i.test(href);
    }

    function onDocumentClick(event) {
        if (event.button && event.button !== 0) return;
        var target = event.target;
        if (!target || !target.closest) return;
        var anchor = target.closest('a[href]');
        if (!anchor || anchor.getAttribute('data-allow-local-link') === 'true') return;
        var href = (anchor.getAttribute('href') || '').trim();
        if (isLocalStaticHref(href)) {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                anchor.setAttribute('href', buildTimestampedUrl(href));
                return;
            }
            if (anchor.target && anchor.target !== '_self') {
                anchor.setAttribute('href', buildTimestampedUrl(href));
                return;
            }
            event.preventDefault();
            window.location.href = buildTimestampedUrl(href);
            return;
        }
        if (!shouldBlockAnchor(anchor)) return;
        event.preventDefault();
        showNetworkError();
    }

    function navigateOrNetworkError(url) {
        if (isLocalStaticHref(url)) {
            window.location.href = buildTimestampedUrl(url);
            return true;
        }
        showNetworkError();
        return false;
    }

    ready(function() {
        injectStyles();
        ensureModal();
        decorateLocalAnchors(document);
        document.addEventListener('click', onDocumentClick, true);

        document.addEventListener('click', function(event) {
            var target = event.target;
            if (!target || !target.closest) return;
            var button = target.closest('.network-error-btn');
            if (button) hideNetworkError();
        }, true);

        document.addEventListener('click', function(event) {
            var target = event.target;
            if (!target || !target.closest) return;
            var mask = target.closest('#' + MASK_ID);
            var dialog = target.closest('#' + DIALOG_ID);
            if (mask && !dialog) hideNetworkError();
        }, true);
    });

    window.showNetworkError = showNetworkError;
    window.hideNetworkError = hideNetworkError;
    window.xuexinNavigate = navigateOrNetworkError;
    window.isLocalStaticHref = isLocalStaticHref;
    window.ensureFreshTimestamp = ensureFreshTimestamp;
})(window, document);
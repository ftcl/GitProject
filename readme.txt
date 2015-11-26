Android Studio WebView实现ionic加载js，运行localstroage缓存

	webView.getSettings().setJavaScriptEnabled(true);
	webView.getSettings().setAllowFileAccess(true);
	webView.getSettings().setAllowContentAccess(true);
	webView.getSettings().setAllowFileAccessFromFileURLs(true);
	webView.getSettings().setAllowUniversalAccessFromFileURLs(true);
	webView.getSettings().setDomStorageEnabled(true);
	webView.getSettings().setAppCacheMaxSize(1024*1024*8);
	String appCachePath = getApplicationContext().getCacheDir().getAbsolutePath();
	webView.getSettings().setAppCachePath(appCachePath);
	webView.getSettings().setAppCacheEnabled(true);
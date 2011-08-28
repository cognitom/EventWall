<?php
require_once '../path/to/fb/facebook.php';
require_once '../path/to/my/config.php';

//外部から来る変数
$callback = isset($_REQUEST['callback']) ? $_REQUEST['callback'] : '';
$user_id = isset($_REQUEST['user_id']) ? $_REQUEST['user_id'] : '';

//変数チェック
!empty($user_id) || die('ユーザIDが指定されていません。');

$file = "json/profile/$user_id.json";
if (!file_exists($file) || filemtime($file) < mktime()-60*60*1){
	//Fbオブジェクトの作成
	$facebook = new Facebook(array(
		'appId'=>$config['appId'],//Facebook Application ID
		'secret'=>$config['secret'],//Facebook Application Secret
	));
	
	//イベント情報の取得
	$profile = $facebook->api("$user_id");
	
	//参加者のフィードを取得
	$feed = $facebook->api("$user_id/feed?limit=3");
	$profile['feed'] = $feed['data'];
	//$likes = $facebook->api("$user_id/likes?limit=3");
	//$profile['likes'] = $likes['data'];
	$profile['detail_loaded'] = true;
	
	//jsonに再エンコード
	$json = json_encode($profile);
	file_put_contents($file, $json);
} else {
	$json = file_get_contents($file);
}

//コールバック指定がある場合は、関数で囲んで出力
if (empty($callback)) echo $json;
	else  echo "$callback($json)";
<?php
require_once '../path/to/fb/facebook.php';
require_once '../path/to/my/config.php';

//外部から来る変数
$callback = isset($_REQUEST['callback']) ? $_REQUEST['callback'] : '';
$event_id = isset($_REQUEST['event_id']) ? $_REQUEST['event_id'] : '';

//変数チェック
!empty($event_id) || die('イベントIDが指定されていません。');

$file = "json/event/$event_id.json";
if (!file_exists($file) || filemtime($file) < mktime()-60*60*1){
	//Fbオブジェクトの作成
	$facebook = new Facebook(array(
		'appId'=>$config['appId'],//Facebook Application ID
		'secret'=>$config['secret'],//Facebook Application Secret
	));
	
	//イベント情報の取得
	$event = $facebook->api("$event_id");
	
	//参加者一覧の取得
	$result = $facebook->api("$event_id/attending");
	$attendees = array();
	foreach ($result['data'] as $attendee){
		$attendee['detail_loaded'] = false;
		$attendees[$attendee['id']] = $attendee;
	}
	
	//jsonに再エンコード
	$json = json_encode(array(
		'event'=>$event,
		'attendees'=>$attendees,
	));
	file_put_contents($file, $json);
} else {
	$json = file_get_contents($file);
}

//コールバック指定がある場合は、関数で囲んで出力
if (empty($callback)) echo $json;
	else  echo "$callback($json)";
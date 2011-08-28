EVENTWALL
=================

EventWallはイベント会場などで、大画面モニタに参加者の写真を表示するためのプログラムです。情報は、Facebookのイベントから取得します。


使い方
-----

次のように、URLでイベントIDと、Twitterのハッシュタグに指定する文字列を渡します。

	http://www.osscafe.net/eventwall/?eid=126901887401754&hashtag=fbcmeetup

* eid : FacebookのイベントID
* hashtag : Twitterのハッシュタグ


インストール
----------

よしなに。

…とか、言っていたらツッコミが来たので、PHPスクリプトの設置について、ちょっと追記します。

まず、下記のような内容の設定ファイルを、どこか(path/to/my/config.php)に置きましょう。

	<?php
	$config = array(
		'appId' => '*********',
		'secret' => '*********',
	);

※それぞれ「*********」のところは、書き換えておいて下さい。

次に、GitHubからFacebook公式SDKを取って来ます。下記の内容(3つのファイル)をどこか(path/to/fb/)に置きましょう。

	https://github.com/facebook/php-sdk/tree/master/src


開発者
-------

**Tsutomu Kawamura**

+ http://www.osscafe.com/
+ http://github.com/cognitom
+ http://www.facebook.com/cognitom


Copyright and License
---------------------

Copyright 2011 CogniTom Academic Design.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
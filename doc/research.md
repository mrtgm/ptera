改めて自分の中にあったこういうアプリ作るぞのイメージを書き殴っていく：
- ノベルゲームメーカー
	- かつて仕事で作った[これ](https://dic.pixiv.net/a/%E3%83%9E%E3%83%84%E3%82%B1%E3%83%B3%E3%82%A2%E3%83%AA%E3%83%9E) を発展させて、ビジュアルノベルをブラウザ上で作って共有できるサービスを作りたい
		- ユーザは**ブラウザ上で**テキストを入力、アセットをアップロード / プリセットから選択してプレイ時間 5 分程度の簡易なノベルゲームを作成できる
			- 一旦高度な機能（セーブ、フラグ管理など）は考えないものとする
			- つまり、**選択肢による分岐しか発生しない**ものとする
		- MVP としてはこれぐらいがいいだろう
	- 原則としてモバイルファーストで開発する
		- つまり、ゲームはモバイル端末に合わせたアスペクト比で描画するってこと
		- まあこれは当然
	- コミュニティ機能（ランキング、コメント、いいね、ユーザプロファイル）を付けたい
		- MVP でもこれは付けたい
- 一言でいうと、**ブラウザで作ったノベルゲームを他人と共有できるプラットフォーム**

- 意外とこういうサービスは**ほぼ存在しない（一個だけ見つけた）**
	- ノベルゲームを共有するサービス自体はある
		- が、ブラウザでのゲーム作成に対応していないことが多い
			- Unity やノベルゲームエンジン（ティラノスクリプトなど）で作成したものをブラウザに展開する、ってパターンが多い
	- ブラウザ上で動作するノベルゲームエンジンもある
		- これも同様にブラウザでのゲーム作成に対応していない
		- UI やデータ設計の参考になるかもしれない

| name                                                                                           | ブラウザ上で作成できる | ブラウザ上でプレイできる | プラットフォーム機能 | 特筆事項                                                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------- | ----------- | ------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [ノベルゲームコレクション｜無料で遊べる。ノベルゲーム投稿サイト](https://novelgame.jp/)                                       | ✗           | ◯            | ◯          | - ティラノスクリプトで作成したゲームを共有<br>　- **国内のプラットフォームでは最大規模**<br>　- ランキング UI は古き良きニコ動みたいな感じ                                                                                                           |
| [NovelSphere - Embeddable visual novels](https://novelsphere.jp/)                              | ✗           | ◯            | ◯          | - 吉里吉里とかと互換性のある JS エンジンを提供してるらしい<br>- API ドキュメントの日本語が終わってる                                                                                                                                 |
| [Twine / An open-source tool for telling interactive, nonlinear stories](https://twinery.org/) | ◯           | ◯            | ✗          | - 日本語ユーザは少ない<br>- コミュニティ機能はない                                                                                                                                                              |
| [inklewriter](https://www.inklewriter.com/)                                                    | ◯           | ◯            | ✗          | - チュートリアルの出来がいい<br>- エディタは見づらい                                                                                                                                                             |
| [Moiki](https://moiki.fr/en)                                                                   | ◯           | ◯            | ◯          | - フランス語圏のサービス<br>- まさにこういうことがやりたい、ということが実現されていそう"<br> - **Play. Create. Share**.<br>" のキャッチが良い<br>- **[エディタ](https://moiki.fr/en/tutos/basics)の見栄えがいい**<br>　- ノードベースの UI っぽい<br>- 全然ユーザいない |
| [Tuesday JS web visual novel engine](https://kirilllive.github.io/tuesday-js/)                 | ◯           | ◯            | ✗          | - **エディタがめちゃくちゃ見栄えがいい**<br>　- ノードベース UI で、自分の 頭の中のイメージと近い<br>- しかも [OSS](https://github.com/Kirilllive/tuesday-js)                                                                         |
| [Ace Attorney Objection Maker](https://objection.lol/)                                         | ◯           | ◯            | ✗          | - 逆裁特化<br>- 動画生成できたりして、結構すごい<br>- Courtroom 機能が謎で面白い<br>　- 逆裁でチャット（？）できる                                                                                                                   |

ノベルゲーム用エンジン・言語
- UI や設計の参考にしたい

| name                                                                                                                        | 特記事項                                                                                                                                                                                                                                                                           |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [ティラノビルダー｜ノベルゲーム開発ソフト。スマホにも対応](https://b.tyrano.jp/)                                                                        | - 代表格その1<br>- JavaScript を出力する                                                                                                                                                                                                                                                 |
| [The Ren'Py Visual Novel Engine](https://ja.renpy.org/)                                                                     | - 代表格その2<br>- ドキドキ文芸部は Ren'Py 製<br>- Python -> WebAssembly で動かす                                                                                                                                                                                                                |
| [Visual Novel Engine • Naninovel](https://naninovel.com/)                                                                   | - 無名だが一通りの機能はありそう<br>- [ノードベースUI](https://www.youtube.com/watch?v=lRxIKDU9z4k&t=148s)っぽい、やっぱこうなるよなぁ                                                                                                                                                                            |
| [nscripter.com](https://www.nscripter.com/)                                                                                 | - スクリプトエンジンの代表格1                                                                                                                                                                                                                                                               |
| [吉里吉里Z](https://krkrz.github.io/)                                                                                           | - スクリプトエンジンの代表格2                                                                                                                                                                                                                                                               |
| [Unity用ビジュアルノベルツール「宴」](https://madnesslabo.net/utage/)                                                                      | - **エクセルでシナリオ編集**する Unity 用のプラグイン<br>　- csv インポートは将来的にあってもいいかもなぁ                                                                                                                                                                                                               |
| [ink - inkle's narrative scripting language](https://www.inklestudios.com/ink/)                                             | - 欧米圏で使われてそうなスクリプトエンジン1<br>- [OSS](https://github.com/inkle/ink)<br>- star 数4.2k                                                                                                                                                                                               |
| [Introduction to ChoiceScript - Choice of Games LLC](https://www.choiceofgames.com/make-your-own-games/choicescript-intro/) | - 欧米圏で使われてそうなスクリプトエンジン2<br>- [OSS](https://github.com/dfabulich/choicescript) で [wiki](https://choicescriptdev.fandom.com/wiki/ChoiceScript_Wiki)が充実している<br>- star 数400ちょい                                                                                                     |
| [ADRIFT: Create your own Interactive Fiction](https://www.adrift.co/)                                                       | - 無骨な UI                                                                                                                                                                                                                                                                       |
| [beyondloom.com/decker/](https://beyondloom.com/decker/)                                                                    | - Docker ではない<br>- かなり異色で、かなり面白い<br>- HyperCard のデザインが基になっているらしい<br>　- HyperCard ってデザイン良かったって結構聞くよなあ<br>- [海外アートゲームシーンで静かに広がる開発ツール「Decker」の世界——シュールな見た目に留まらない、HyperCardの流れを汲むミニマルゲーム開発に向いたツール｜令和ビデオゲーム・グラウンドゼロ——アートハウス・ビデオゲームメディア](https://note.com/reibizero/n/nf98447b25c3b) |
- 各ページの UI についてはイメージボード作って貼っつけて検討したい
	- 特にティラノ、Ren'Py、TuesdayJS、Visual Novel Engine、Moiki あたり

- ちょっと脱線するが、このリサーチを行う中で欧米圏では Interactive Fiction と呼ばれるジャンルがある（あった？）ということを知った
	- つまりわたしたちが馴染んでいる、ノベルゲーって言った時に想起する[これ](https://www.famitsu.com/images/000/283/670/y_5fbc9d45600fc.jpg)とか[こういう](https://prcdn.freetls.fastly.net/release_image/147227/16/147227-16-205f6e49e872982d11e75c8073f41ac5-1280x720.png?width=1950&height=1350&quality=85%2C75&format=jpeg&auto=webp&fit=bounds&bg-color=fff)もの（つまり、ビジュアルノベルとサウンドノベル）とは違う世界観のなにかが存在していたっぽい

- [Interactive fiction - Wikipedia](https://en.wikipedia.org/wiki/Interactive_fiction)
	- [インタラクティブフィクション - Wikipedia](https://ja.wikipedia.org/wiki/%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%A9%E3%82%AF%E3%83%86%E3%82%A3%E3%83%96%E3%83%95%E3%82%A3%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3)
	- 要はテキストべースで進行する、選択肢によって構成されたゲーム
		- 一言でいうと**絵の（必要）ないノベルゲーム**ってこと
	- 1970年代に MIT の研究員が作った Zork が嚆矢
		- [Zork: The Great Inner Workings. Exploring the source code and game… | by Rok Ajdnik | The Startup | Medium](https://medium.com/swlh/zork-the-great-inner-workings-b68012952bdc)：Zork のソースコードについて、面白そう
- [Interactive Fiction Technology Foundation](https://iftechfoundation.org/)
	- インタラクティブ・フィクション・テクノロジー財団（IFTF）は、インタラクティブ・フィクションの創作と配信に欠かせないツールやサービスの継続的な保守、改善、保存を支援するとともに、この芸術形式のさらなる発展を促す新しいプロジェクトの開発も手がけています。
		- 財団が・・・
	- [The Interactive Fiction Database - IF and Text Adventures](https://ifdb.org/)
		- IFTF が運営してる Interactive Fiction のリスト（すごい）
		- が、ここを見る限りそんなに今も盛り上がってるという、わけでも、ないのか、、、
- [IFWiki](https://www.ifwiki.org/)
- [DM4 §46: A short history of interactive fiction](https://www.inform-fiction.org/manual/html/s46.html)
- [Interactive Fiction: A History of Questing Essay | Sufficient Velocity](https://forums.sufficientvelocity.com/threads/interactive-fiction-a-history-of-questing.19687/)
	- 現代における Interactive Fiction
	- 特に 4chan とかで展開されてきた "Quest" っていうサブジャンルについて
- [Interactive Fiction Development (Twine, Ink, Choicescript) - Collection by PotentNeurotoxin - itch.io](https://itch.io/c/1314324/interactive-fiction-development-twine-ink-choicescript)
	- itch.io （インディーゲームのプラットフォーム）で遊べる Interactive Fiction のリスト
- [Inform - Wikipedia](https://ja.wikipedia.org/wiki/Inform)
	- Interactive Fiction 用のプログラミング言語（！？）
		- 前掲の ink や ChoiceScript の祖的な存在だと思われる
	- 自然言語っぽく書けるらしい
- [Z-machine - IFWiki](https://www.ifwiki.org/Z-machine)
	- Inform とか IF 用の言語をバイトコードにコンパイルして可搬にする、みたいなことが 90 年代から行われてきたらしい
	- Z-machine は仮想マシンの歴史の中でも最初期のものらしい（はえ〜）
	- [Glulx - IFWiki](https://www.ifwiki.org/Glulx)
		- Z-machine の後継、GIx って API を定義して、それに言語仕様が沿ってればバイトコードにできる、って感じっぽい（まあ POSIX みたいなもんか）
	- [Parchment - IFWiki](https://www.ifwiki.org/Parchment)
		- で、そういう Glulx とか Z-machine のフォーマットで生成されたバイトコードを Web で読み込むインタプリタがある
			- [Parchment](https://iplayif.com/)：インターフェースが無骨すぎる
		- 奥深すぎるだろ、本が一冊書けてしまう
- 日本のサウンドノベル、ビジュアルノベルはかつての **Interactive Fiction が異常進化した形態**なのかもしれない
	- が、なぜ日本で Interactive Fiction を記述する言語とか、そのインタプリタが育たなかったのかは謎　非 Ascii 文化圏の悲しい性なのか

---

と、いうわけで、MVP 作っていくうえで、ロードマップは大きく２つのフェーズに分かれると思われる：
- フェーズ1
	- 基本的なゲーム作成機能
	- 基本的なプレイヤー機能
	- 認証機能
	- アセット管理（基本機能）
- フェーズ2
	- コミュニティ機能
	- ランキング
	- コメント

あるべきページについて考える、最低限この辺は作るかなあ、というエリアをまず決める：
- ランキングは簡単にできそうならやってもいいが、新着があればとりあえず成り立つだろう
- ユーザ設定に関する操作（パスワード、メアドの変更、退会）は明らかに必要だが、MVP には含めないことにする
	- 他が重いし、体験として今回のキモではないので
![|500](./resources/Screenshot%202025-02-18%20at%2016.23.58.png)


ゲームに関しては、最低限この4画面さえあればノベルゲームは成り立ちそう（多分）：
![|300](./resources/Desktop%20-%201.png)
![|300](./resources/Desktop%20-%202.png)
![|300](./resources/Desktop%20-%203.png)
![|300](./resources/Desktop%20-%204.png)

ここに効果音やBGM、トランジションが追加されていく、というイメージ
で〜まあエディタがどうなるか、ここが一番むずいんだが（あんまりまだイメージがない）
まあまったりリサーチするか

---

- ティラノビルダー
	- ![|300](./resources/Screenshot%202025-02-18%20at%2016.47.22.png)
		- 要はギャルゲーかかまいたちの夜か選べるということか
	- ![|300](./resources/Screenshot%202025-02-18%20at%2017.02.32.png)
		- 立ち絵の領域調整機能は必要そうだな
	- ![|300](./resources/Screenshot%202025-02-18%20at%2017.13.32.png)
		- イベントをタイムラインに追加していくUI、分岐はラベル使った GOTO
		- 意外とサクサク作れて気持ち良い感じ、すっと入ってくる
			- イベントを色分けしてるのがいい
			- その場プレビューが良い
		- キャラクターを作成して登場させたり退場させたりするのも直感的で良い
			- 問題点は分岐の扱いが洗練されてないことか
				- 毎回遷移先を示すラベルを作って選択肢のターゲットとして登録しなきゃならない
				- シーン間の関連性がすぐに把握できない
- TuesdayJS
	- ![|300](./resources/Screenshot%202025-02-18%20at%2017.30.34.png)
		- ブロック（=ティラノビルダーのシーン）って概念があって、その中に背景とか選択肢を置いてくのかな？
	- ![|300](./resources/Screenshot%202025-02-18%20at%2017.35.17.png)
		- 意外と操作感は悪い・・・
			- まず↑このポップアップが厳しい、項目をグルーピングしたほうがいい
				- すべての操作がポップアップの中に隠れていて、「なんかしたい -> ボタン押下 -> ポップアップが出てくる -> 選ぶ」 ってプロセスを毎回辿る必要があるのが気持ちよくない
				- まだティラノビルダーみたいに操作対象のオブジェクトをドラッグアンドドロップで追加していく方が気持ちいい
		- あとブロックをユーザが自由に移動できるのだがあまり意味なくて、勝手に整列される方が良いと思う
	- ![|300](./resources/Screenshot%202025-02-18%20at%2017.40.17.png)
		- シーン間の関連性がこうやって見えるのは良いが、、
- Moiki
	- ![|300](./resources/Screenshot%202025-02-18%20at%2018.26.58.png)
		- UI の操作感はかなりいい
		- 分岐をかなり直感的に作れるし、シーン間の関連性を描画したグラフがかなりわかりやすい
			- **TuesdayJS みたいにグラフのノードを直接編集するのは操作体験が厳しい。やはりノードの詳細編集とノードの一覧ビューは別れていた方が良さそう**
		- プレビューも洒落てる。確かにモバイルファーストなんだから、プレビューはスマホ画角で考えないとあかんな・・・
	- ![|300](./resources/Screenshot%202025-02-18%20at%2018.20.58.png)
		- テキストを一覧できるモードが良い


こんなところかな・・・なんとなくティラノビルダーとMoikiのいいとこ取りをしていけばよさそうな気はする

機能を詳細化：
- シーングラフビュー
	- シーンの関連をグラフとして表示する
		- [Node-Based UIs in React - React Flow](https://reactflow.dev/)　よさそう
	- ノードにホバーすると先頭のテキストが表示される
	- 先頭ノード、中間ノード、葉ノードが色分けされている
	- エッジの上に選択肢が表示される
- シーン編集ビュー
	- タイムライン形式で、イベントを D&D で追加
	- 分岐選択
		- 既存のシーンとリンクする
		- 分岐を作成する
			- 新しいシーンを作成する
			- 既存のシーンとリンクする
		- 分岐の終わりとしてマークする
- リンク選択モーダル
	- 既存のシーンから選択
	- 検索可能
- プレビュー
	- 全体をプレビュー
	- シーン編集ビューで、任意のシークエンスからプレビュー
	- ツリービューの任意のシーンからプレビュー
- イベントパネル
	- メッセージ
		- テキスト
			- `# 名前` でタイトルを変更
		- メッセージウィンドウ消去
		- メッセージウィンドウ出現
	- キャラクター
		- キャラクター登場
			- キャラクター選択
			- 位置決め
		- キャラクター退場
			- キャラクター選択
		- 全員退場
	- 演出
		- 画面暗転
		- 暗転の解除
	- 背景変更
		- 画像ファイル選択 / 追加
	- メディア
		- BGM 再生
			- 音声ファイル選択 / 追加
			- ループ再生の有無（？）
		- 効果音再生
			- 音声ファイル選択 / 追加
- アセット一括追加モーダル
	- 背景画像
	- 音声ファイル
- キャラクター追加モーダル
	- 名前の登録
	- アセットのアップロード

グラフが大変そうだけど、まあやってくか・・・
スーパーウルトラざっくり WF を引く：
![|400](./resources/Screenshot%202025-02-18%20at%2022.24.22.png)

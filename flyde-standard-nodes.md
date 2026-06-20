# @flyde/nodes 標準ノード一覧

`@flyde/nodes` に含まれる組み込みノードの完全リファレンス。  
ソース: https://github.com/flydelabs/flyde/tree/main/nodes/src

---

## ControlFlow（制御フロー）

| ノード | 説明 |
|---|---|
| `Conditional` | 条件分岐（true/false 出力） |
| `Switch` | 複数条件分岐（case 式で出力先を選択） |
| `Console` | コンソール出力（デバッグ用） |
| `LimitTimes` | N 回だけ通過を許可 |
| `RoundRobin` | 複数出力を順番に切り替え |
| `Publish` / `Subscribe` | フロー内 PubSub（グローバルバス） |

---

## Lists（リスト操作）

| ノード | 説明 |
|---|---|
| `Collect` | N 個集まったらリストとして出力 |
| `Repeat` | 値を N 回繰り返してリスト生成 |
| `Loop List` | リストの各要素を 1 つずつ出力 |
| `SpreadList` | リストをバラして出力 |
| `Append` / `Prepend` | 末尾/先頭に要素追加 |
| `ConcatLists` | リスト結合 |
| `Flatten` | 入れ子リストを平坦化 |
| `GetListElement` | インデックス指定で要素取得 |
| `HeadAndRest` | 先頭要素と残りに分割 |
| `ListFrom` | 複数入力からリスト生成 |
| `ListIsEmpty` | 空リスト判定 |
| `ListLength` | リストの長さ |
| `Remove` / `RemoveAt` | 値/インデックスで要素削除 |
| `Reverse` | リストを逆順 |
| `Slice` | 部分リスト取得 |
| `AccumulateSomeValuesByCount` | 指定個数を蓄積して出力 |

---

## Strings（文字列）

| ノード | 説明 |
|---|---|
| `Concat` | 文字列結合 |
| `Split` | 文字列分割 |
| `StringOps` | 各種文字列操作（length / trim / upper / lower 等） |

---

## Numbers（数値）

| ノード | 説明 |
|---|---|
| `Add` / `Subtract` | 加算/減算 |
| `Math` | 数式評価 |
| `SumList` | リストの合計 |

---

## Objects（オブジェクト）

| ノード | 説明 |
|---|---|
| `GetAttribute` | プロパティ取得 |
| `SetAttribute` | プロパティ設定 |
| `DeleteAttribute` | プロパティ削除 |
| `JSONParse` / `JSONStringify` | JSON 変換 |
| `ObjectKeys` / `ObjectValues` / `ObjectEntries` | キー/値/エントリ一覧 |

---

## Values（値）

| ノード | 説明 |
|---|---|
| `InlineValue` | 固定値を出力（IIP をノードで置く場合） |
| `CodeExpression` | JS 式を評価して出力 |

---

## Timing（タイミング）

| ノード | 説明 |
|---|---|
| `Delay` | N ms 遅延して出力 |
| `Interval` | N ms ごとに繰り返し出力 |
| `Debounce` | 最後の入力から N ms 後に出力 |
| `Throttle` | N ms 以内の重複を間引く |

---

## State（状態）

| ノード | 説明 |
|---|---|
| `GetGlobalState` | グローバル変数を読む |
| `SetGlobalState` | グローバル変数に書く |

---

## Dates（日時）

| ノード | 説明 |
|---|---|
| `DateOps` | 現在時刻取得（now / nowString / nowISOString / nowUnixTime を選択） |

---

## FileSystem（ファイルシステム）

| ノード | 説明 |
|---|---|
| `ReadFile` | ファイル読み込み |
| `WriteFile` | ファイル書き込み |
| `AppendFile` | ファイルへ追記 |
| `DeleteFile` | ファイル削除 |
| `Exists` | ファイル存在確認 |

---

## Http

| ノード | 説明 |
|---|---|
| `Http` | HTTP リクエスト送信 |

---

## Note（注釈）

| ノード | 説明 |
|---|---|
| `Note` | フロー上に Markdown でメモを貼る（入出力なし、ドキュメント用） |

---

## ThirdParty（外部サービス連携）

| ノード | 説明 |
|---|---|
| `Anthropic` | Claude API 呼び出し |
| `OpenAI` / `OpenAI Responses` | OpenAI API 呼び出し |
| `LLM Condition` | LLM による条件分岐 |
| `Airtable` | Airtable DB 操作 |
| `Google Sheets` | Google Sheets 操作 |
| `Notion` | Notion DB 操作 |
| `Supabase` | Supabase DB 操作 |
| `PostgreSQL` | PostgreSQL 直接クエリ |
| `Slack` | Slack メッセージ送信 |
| `Discord` | Discord メッセージ送信 |
| `Resend` / `SendGrid` | メール送信 |
| `Firecrawl` / `ScrapingBee` | Web スクレイピング |
| `Tavily` | AI 検索 |
| `Browser` / `Server` | ブラウザ/サーバー操作 |

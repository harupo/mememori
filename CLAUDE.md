# CLAUDE.md — mememori（メメントモリ育成診断ツール）

このファイルは `E:\Dev\mememori` 直下に配置され、Claude Code がこのディレクトリで起動した時に自動読み込みされる最上位の指示書。

**作業ディレクトリ**: `E:\Dev\mememori`
**プロジェクト**: メメントモリ育成診断ツール（ラボ案件）
**上位組織**: `E:\Dev\claude\vault-private\`（Harupo の AI エージェント組織、vault-private リポジトリ）
**エージェント組織への登録**: 2026-05-22、ラボ案件として登録（`vault-private/vault/90_Context/repos.json` の `mentemori-shindan`）

---

## 1. プロジェクト概要

メメントモリ（バンク・オブ・イノベーション運営のスマホ RPG）を題材とした **育成診断ツール**。

> **注記**: 詳細な仕様・技術スタック・現在の進行状態は本ファイル整備時点で未記入。Code セッションで把握・確定したら本セクション（および `.project-state/state.md` を整備する場合はそちら）に追記する。**推測で埋めない。**

### 🚨 メメントモリ二次創作の公開前提（重要）

メメントモリ運営（バンク・オブ・イノベーション）の「著作物利用ガイドライン」に従う。同じメメントモリ題材の姉妹プロジェクト mememori-quiz では、2026-05-20 に運営から「**非営利・テキスト情報のみ・ゲーム内アセット（画像/音源等）不使用・非公式ファンサイト表記の常時表示** 等をすべて満たす場合に限りファン活動として公開可」との回答を取得済み。本プロジェクトを公開する場合も同条件を前提とする（公開条件の全文は `E:\Dev\mememori-quiz\CLAUDE.md` §1、または運営ガイドラインを参照）。公開可否は実装着手前に Harupo に確認する。

---

## 2. ロール / 応答プレフィックス規約

このプロジェクトの Code セッションのロールは **`pc-mentemori-shindan`**。

- 応答の**冒頭**に `[pc-mentemori-shindan]` を表示する。
- 応答の**最終行**に `— pc-mentemori-shindan` を出力する（複数の Claude Code ウインドウを画面最下部で判別するため。正本はグローバル `~/.claude/CLAUDE.md`「Code 応答末尾のロール表示」）。

---

## 3. エージェント組織の規約

- グローバル `~/.claude/CLAUDE.md` の全規約（bash の Node 化、自走運用、技術選定、サービス実装ガイドライン 等）に従う。
- 上位組織は vault-private。組織横断の規約・設計判断・他案件との調整は vault-private の chief-of-staff に確認する。

---

## 4. ダッシュボード進捗連携

Harupo のエージェント組織には `http://localhost:3456` でタスクダッシュボードが稼働している。まとまった作業の区切りで進捗を POST する:

- エンドポイント: `POST http://localhost:3456/api/progress`
- `taskId`: `mentemori-shindan`（repos.json の slug）
- 詳細はグローバル `~/.claude/CLAUDE.md`「Vault dashboard progress reporting」を参照。

---

## 5. Console↔Code 透過化レイヤー（未設定）

本プロジェクトはまだ Notion 透過化レイヤー（Console↔Code を Notion 経由で状態共有する仕組み）をセットアップしていない。Notion Project State ページ・同期スケジュールタスク・`config.json` エントリ・`.project-state/` は未作成。Console を介した運用が必要になったら、vault-private の chief-of-staff にセットアップを依頼する。

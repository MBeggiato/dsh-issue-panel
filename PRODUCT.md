# GitHub issues panel

<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Initially Marcel, working on GitHub-backed workspaces in DeepSeek Harness; potentially other users later.

## Product Purpose
Provide a quick overview of the next work, read issue descriptions and comments without leaving Harness, and stage issue context in chat for review before sending.

## Operating Context
A persistent plugin in the existing Harness GUI and current profile. Detect the current workspace Git repository. GitHub.com only; no Enterprise support. The initial development workspace is empty and not a Git repository. The host has gh installed.

## Capabilities and Constraints
Read-only GitHub access. Existing gh login by default with an optional host-stored token override. Show number, title, labels, assignees, author and update time. Browse all open issues using pagination, excluding pull requests. Automatic and manual refresh. Explain non-Git or non-GitHub workspaces without running issue-fetch logic. Issue details include description and comments. Adding context must not submit chat or start agent work. User approved a compact master-detail layout, stacked on narrow screens, inheriting Harness theme and controls.

## Product Principles
- Keep repository operations read-only.
- Preserve user control over chat submission.
- Keep credentials out of chat and browser storage.
- Integrate with the current Harness rather than create another application.

## Open decisions
Exact pagination and refresh intervals are delegated to implementation. Packaging should remain reusable for future sharing.

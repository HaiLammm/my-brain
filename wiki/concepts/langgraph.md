---
type: concept
title: LangGraph
slug: langgraph
date_added: 2026-05-12
confidence: medium
tags:
  - orchestration
  - multi-agent
  - langchain
id: concepts/langgraph
created: 2026-05-12
updated: 2026-05-12
key_sources:
  - sources/technical-research-semantic-to-geometric-translation-architecture
related_concepts: []
---

## Definition

LangGraph là thư viện Python mở rộng LangChain, cho phép xây dựng các ứng dụng multi-agent có trạng thái (stateful) dưới dạng đồ thị có hướng (directed graph). Khác với RAG tuyến tính, LangGraph hỗ trợ chu kỳ và vòng phản hồi (cycles and feedback loops), cho phép agents tinh chỉnh lặp lại kết quả dựa trên ràng buộc.

## Variants

- **Cyclical Workflow**: Đồ thị có chu kỳ cho phép agents quay lại và tinh chỉnh kết quả
- **Supervisor/Coordinator Pattern**: Agent trung tâm điều phối, phân tác cho các sub-agents chuyên biệt
- **ToolNode Pattern**: Tích hợp agents với external tools (vector search, geometric engines)

## Key sources

- [[sources/technical-research-semantic-to-geometric-translation-architecture]]

## Related concepts

- [[concepts/agentic-rag]]
- [[concepts/contract-driven-development]]
- [[concepts/physical-emotional-compiler]]

## Notes
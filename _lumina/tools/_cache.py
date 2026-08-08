"""HTTP session cache wrapper for the research fetchers.

Minimal local restoration: the upstream lumina-wiki v1.5.0 install shipped
`fetch_arxiv.py`, `fetch_s2.py`, `fetch_wikipedia.py` and `fetch_deepxiv.py`
importing `wrap_session` from this module, but the module itself was never
written to disk, so every fetcher raised ModuleNotFoundError on import.

This passthrough restores the contract (session in, session out) without
caching. Responses are fetched fresh on every call, which is correct but
slower and heavier on upstream rate limits than a caching implementation
would be. Replace with the real cache if upstream ships one.
"""

from __future__ import annotations

from typing import Any


def wrap_session(session: Any, namespace: str = "default") -> Any:
    """Return `session` unchanged.

    Args:
        session: A `requests.Session` configured by the calling fetcher.
        namespace: Cache partition name the caller intended to use. Accepted
            and ignored — kept so call sites need no edits.

    Returns:
        The same session object that was passed in.
    """
    return session

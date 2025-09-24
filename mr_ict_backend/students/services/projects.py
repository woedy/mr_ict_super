from __future__ import annotations

from typing import Dict, Iterable, List, Tuple

from .coding import CodeExecutionError, normalise_execution_files


DEFAULT_PROJECT_FILES = [
    {
        "name": "index.html",
        "language": "html",
        "content": """<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>My Mr ICT Project</title>\n    <link rel=\"stylesheet\" href=\"styles.css\" />\n  </head>\n  <body>\n    <main class=\"container\">\n      <h1>Welcome to your project!</h1>\n      <button id=\"action-btn\">Click me</button>\n    </main>\n    <script src=\"scripts.js\"></script>\n  </body>\n</html>\n""",
    },
    {
        "name": "styles.css",
        "language": "css",
        "content": """body {\n  font-family: 'Inter', sans-serif;\n  background: #f4f4f5;\n  margin: 0;\n  padding: 2rem;\n}\n\n.container {\n  max-width: 640px;\n  margin: 0 auto;\n  background: #ffffff;\n  border-radius: 0.75rem;\n  padding: 2rem;\n  box-shadow: 0 20px 25px -15px rgba(15, 23, 42, 0.25);\n}\n\nbutton {\n  background: #0f172a;\n  color: white;\n  border: none;\n  padding: 0.75rem 1.5rem;\n  border-radius: 9999px;\n  cursor: pointer;\n  font-size: 1rem;\n}\n\nbutton:hover {\n  background: #1e293b;\n}\n""",
    },
    {
        "name": "scripts.js",
        "language": "javascript",
        "content": """const button = document.querySelector('#action-btn');\nconst headline = document.querySelector('h1');\n\nbutton?.addEventListener('click', () => {\n  const colours = ['#ef4444', '#10b981', '#3b82f6', '#f97316'];\n  const next = colours[Math.floor(Math.random() * colours.length)];\n  if (headline) {\n    headline.style.color = next;\n  }\n  console.log('Button clicked!');\n});\n""",
    },
]


def ensure_default_project_files(files: Iterable[Dict[str, object]] | None) -> List[Dict[str, object]]:
    if not files:
        return list(DEFAULT_PROJECT_FILES)
    return normalise_execution_files(files)


def validate_project_files(
    files: Iterable[Dict[str, object]],
    schema: Dict[str, object] | None,
) -> Tuple[bool, List[Dict[str, object]]]:
    """Validate a project against simple declarative rules."""

    normalised = normalise_execution_files(files)
    lookup = {item["name"]: item["content"] for item in normalised}

    if not schema:
        return True, []

    results: List[Dict[str, object]] = []
    passed = True

    required_files = schema.get("required_files", []) if isinstance(schema, dict) else []
    for filename in required_files:
        exists = filename in lookup
        results.append({
            "type": "required_file",
            "file": filename,
            "passed": exists,
        })
        if not exists:
            passed = False

    rules = schema.get("rules", []) if isinstance(schema, dict) else []
    if not isinstance(rules, list):
        raise CodeExecutionError("Schema rules must be a list of instructions.")

    for rule in rules:
        if not isinstance(rule, dict):
            raise CodeExecutionError("Each rule must be a dictionary.")
        file_name = rule.get("file")
        if not isinstance(file_name, str) or not file_name:
            raise CodeExecutionError("Rule requires a target file.")
        content = lookup.get(file_name, "")
        contains = rule.get("contains", [])
        if contains and not isinstance(contains, list):
            raise CodeExecutionError("Rule 'contains' must be a list.")
        missing: List[str] = []
        for token in contains:
            if not isinstance(token, str):
                raise CodeExecutionError("Rule 'contains' items must be strings.")
            if token not in content:
                missing.append(token)
        rule_passed = not missing
        results.append({
            "type": "contains",
            "file": file_name,
            "passed": rule_passed,
            "missing": missing,
        })
        if not rule_passed:
            passed = False

    return passed, results

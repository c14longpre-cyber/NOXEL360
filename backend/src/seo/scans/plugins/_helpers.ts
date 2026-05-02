import { sha1 } from "../../shared/hash";
import type { IssueItem, IssueSeverity } from "../../issues/issue.types";

export function makeIssues() {
  return {
    critical: [] as IssueItem[],
    warning: [] as IssueItem[],
    info: [] as IssueItem[],
  };
}

export function mkIssue(
  severity: IssueSeverity,
  title: string,
  fix: string,
  why = "Signal detected during the scan.",
  impact = "May negatively impact SEO quality, performance, and user experience."
): IssueItem {
  const id = sha1(`${severity}:${title}:${fix}`);
  return { id, title, why, impact, fix, severity };
}

export function issue(
  severity: IssueSeverity,
  title: string,
  fix: string,
  why = "Signal detected during the scan.",
  impact = "May negatively impact SEO quality, performance, and user experience."
): IssueItem {
  return mkIssue(severity, title, fix, why, impact);
}
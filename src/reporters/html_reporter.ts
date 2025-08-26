import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import Handlebars from 'handlebars'
import { version } from '../../package.json'

import Reporter from './reporter'
import { Report, ReportFile, ReportIssue, ReportLine, Severity } from '../types'

export default class HTMLReporter extends Reporter {
  public override write = (): void => {
    const templateHTML = readFileSync(path.join(import.meta.dirname, './template.html'), { encoding: 'utf-8' })

    const template = Handlebars.compile(templateHTML)
    const values = {
      title: this.config?.title || 'Gherklin Report',
      generated: new Date().toISOString(),
      version,
      topRules: [],
      summary: {
        files: 0,
        errors: 0,
        warnings: 0,
        totalIssues: 0,
        totalTime: this.totalTime / 1000,
      },
      files: {},
    } as Report

    const ruleCounts = new Map<string, number>();

    for (const [key] of this.errors.entries()) {
      const errors = this.errors.get(key)
      if (!errors) {
        continue
      }

      if (Object.keys(values.files).indexOf(key) == -1) {
        values.files[key] = {
          path: key,
          issues: [],
          summary: {
            errors: 0,
            warnings: 0,
          },
        }
      }

      const errorTotal = errors.filter((e) => e.severity === Severity.error).length
      const warnTotal = errors.filter((e) => e.severity === Severity.warn).length
      values.summary.files += 1
      values.summary.errors += errorTotal
      values.summary.warnings += warnTotal
      values.files[key].summary.errors = errorTotal
      values.files[key].summary.warnings = warnTotal
      values.summary.totalIssues += errors.length

      errors.forEach((err) => {
        const issueInfo = {
          rule: err.rule,
          severity: err.severity,
          location: err.location,
        } as ReportIssue

        values.files[key].issues.push(issueInfo)

        ruleCounts.set(err.rule, (ruleCounts.get(err.rule) || 0) + 1);
      })
    }

    values.summary.donut = this.computeDonut({
      errors: values.summary.errors,
      warnings: values.summary.warnings,
      total: values.summary.totalIssues,
    })

    const topRaw = Array.from(ruleCounts, ([rule, count]) => ({ rule, count }))
      .sort((a,b)=>b.count - a.count).slice(0,10)
    const max = Math.max(1, ...topRaw.map(r=>r.count))
    const topRules = topRaw.map(r => ({ ...r, percent: Math.round((r.count / max) * 100) }))
    values.topRules = topRules

    const html = template(values)
    writeFileSync(path.resolve(this.config.configDirectory, this.config.outFile || 'gherklin-report.html'), html)
  }

  private computeDonut = (
    totals: { errors: number; warnings: number; total: number },
    r: number = 60,
    stroke: number = 15,
  ): object =>{
    const total = Math.max(0, totals.total);
    const C = 2 * Math.PI * r;

    if (total === 0) {
      return { r, stroke, total, segments: [] };
    }

    // Order matters: error -> warn -> info
    const parts = [
      { key: "error", value: totals.errors, color: "var(--err)" },
      { key: "warn",  value: totals.warnings,  color: "var(--warn)" },
    ].filter(p => p.value > 0);

    let offsetFrac = 0;
    const segments = parts.map(p => {
      const frac = p.value / total;
      const dash = C * frac;
      const gap  = C - dash;
      const dasharray  = `${dash.toFixed(2)} ${gap.toFixed(2)}`;
      const dashoffset = `-${(C * offsetFrac).toFixed(2)}`;
      offsetFrac += frac;
      return { color: p.color, dasharray, dashoffset };
    });

    return { r, stroke, total, segments };
  }
}

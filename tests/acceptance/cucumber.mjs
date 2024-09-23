const [, , path] = process.argv

let paths = [`tests/acceptance/features/*.feature`]

if (path.indexOf('.feature') > -1) {
  paths = [path]
}

export default {
  import: ['tests/acceptance/steps.ts'],
  paths,
  format: ['progress', 'html:cucumber-report.html'],
}
